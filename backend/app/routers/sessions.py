from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Session as SessionModel, User
from app.schemas import SessionCreate, SessionOut
from app.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])

# Save a completed session
@router.post("", response_model=SessionOut)
def create_session(
    data: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = SessionModel(
        **data.model_dump(),
        patient_id=current_user.id
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return db.query(SessionModel).options(
        joinedload(SessionModel.exercise)
    ).filter(SessionModel.id == session.id).first()

# Get all sessions for the logged in patient
@router.get("/my", response_model=List[SessionOut])
def get_my_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(SessionModel).options(
        joinedload(SessionModel.exercise)
    ).filter(SessionModel.patient_id == current_user.id).all()

# Get all sessions for a specific patient (therapist use)
@router.get("/patient/{patient_id}", response_model=List[SessionOut])
def get_patient_sessions(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(SessionModel).options(
        joinedload(SessionModel.exercise)
    ).filter(SessionModel.patient_id == patient_id).all()