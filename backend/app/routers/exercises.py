from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Exercise, User
from app.schemas import ExerciseCreate, ExerciseOut
from app.dependencies import get_current_therapist
from typing import List

router = APIRouter(prefix="/api/exercises", tags=["Exercises"])

# Create a new exercise (therapists only)
@router.post("", response_model=ExerciseOut)
def create_exercise(
    data: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_therapist)
):
    exercise = Exercise(**data.model_dump(), created_by=current_user.id)
    db.add(exercise)
    db.commit()
    db.refresh(exercise)
    return exercise

# Get all exercises
@router.get("", response_model=List[ExerciseOut])
def get_exercises(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_therapist)
):
    return db.query(Exercise).all()

# Update an exercise
@router.put("/{exercise_id}", response_model=ExerciseOut)
def update_exercise(
    exercise_id: int,
    data: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_therapist)
):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    for key, value in data.model_dump().items():
        setattr(exercise, key, value)

    db.commit()
    db.refresh(exercise)
    return exercise

# Delete an exercise
@router.delete("/{exercise_id}")
def delete_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_therapist)
):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    db.delete(exercise)
    db.commit()
    return {"message": "Exercise deleted"}