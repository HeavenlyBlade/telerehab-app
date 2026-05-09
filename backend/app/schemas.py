from pydantic import BaseModel, EmailStr
from app.models import UserRole
from typing import Optional
from datetime import datetime


# ─── User Schemas ───────────────────────────────────────────────────

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: UserRole

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    role: UserRole

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ─── Exercise Schemas ───────────────────────────────────────────────

class ExerciseCreate(BaseModel):
    title: str
    description: str
    duration_seconds: int = 30
    sets: int = 3
    reps: int = 10
    body_part: str
    difficulty: str = "beginner"

class ExerciseOut(BaseModel):
    id: int
    title: str
    description: str
    duration_seconds: int
    sets: int
    reps: int
    body_part: str
    difficulty: str
    created_by: int

    class Config:
        from_attributes = True


# ─── Assignment Schemas ─────────────────────────────────────────────

class AssignmentCreate(BaseModel):
    patient_id: int
    exercise_id: int
    notes: Optional[str] = None

class AssignmentOut(BaseModel):
    id: int
    patient_id: int
    therapist_id: int
    exercise_id: int
    notes: Optional[str]
    status: str
    exercise: ExerciseOut

    class Config:
        from_attributes = True


# ─── Session Schemas ────────────────────────────────────────────────

class SessionCreate(BaseModel):
    exercise_id: int
    reps_completed: int
    reps_target: int
    completed: str = "partial"

class SessionOut(BaseModel):
    id: int
    exercise_id: int
    reps_completed: int
    reps_target: int
    completed: str
    created_at: datetime
    exercise: ExerciseOut

    class Config:
        from_attributes = True