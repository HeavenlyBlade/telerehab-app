from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Assignment, User
from app.schemas import AssignmentCreate, AssignmentOut
from app.dependencies import get_current_therapist, get_current_user
from typing import List

router = APIRouter(prefix="/api/assignments", tags=["Assignments"])

# Assign an exercise to a patient (therapists only)
@router.post("", response_model=AssignmentOut)
def create_assignment(
    data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_therapist)
):
    # Check patient exists
    patient = db.query(User).filter(
        User.id == data.patient_id,
        User.role == "patient"
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    assignment = Assignment(
        **data.model_dump(),
        therapist_id=current_user.id
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return db.query(Assignment).options(
        joinedload(Assignment.exercise)
    ).filter(Assignment.id == assignment.id).first()

# Get all patients (therapists only)
@router.get("/patients", response_model=List[dict])
def get_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_therapist)
):
    patients = db.query(User).filter(User.role == "patient").all()
    return [{"id": p.id, "full_name": p.full_name, "email": p.email} for p in patients]

# Get assignments for the logged-in patient
@router.get("/my", response_model=List[AssignmentOut])
def get_my_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Assignment).options(
        joinedload(Assignment.exercise)
    ).filter(Assignment.patient_id == current_user.id).all()