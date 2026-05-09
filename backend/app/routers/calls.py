from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ActiveCall, User
from app.dependencies import get_current_user, get_current_therapist

router = APIRouter(prefix="/api/calls", tags=["Calls"])

# Therapist starts a call with a patient
@router.post("/start")
def start_call(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_therapist)
):
    # End any existing call with this patient first
    existing = db.query(ActiveCall).filter(
        ActiveCall.therapist_id == current_user.id,
        ActiveCall.patient_id == patient_id
    ).first()
    if existing:
        db.delete(existing)
        db.commit()

    room_name = f"telerehab-{current_user.id}-{patient_id}"
    call = ActiveCall(
        therapist_id=current_user.id,
        patient_id=patient_id,
        room_name=room_name
    )
    db.add(call)
    db.commit()
    return {"room_name": room_name}

# Therapist ends the call
@router.post("/end")
def end_call(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_therapist)
):
    call = db.query(ActiveCall).filter(
        ActiveCall.therapist_id == current_user.id,
        ActiveCall.patient_id == patient_id
    ).first()
    if call:
        db.delete(call)
        db.commit()
    return {"message": "Call ended"}

# Patient checks if there's an incoming call for them
@router.get("/incoming")
def check_incoming_call(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    call = db.query(ActiveCall).filter(
        ActiveCall.patient_id == current_user.id,
        ActiveCall.is_active == "active"
    ).first()
    if call:
        return {"has_call": True, "room_name": call.room_name}
    return {"has_call": False, "room_name": None}