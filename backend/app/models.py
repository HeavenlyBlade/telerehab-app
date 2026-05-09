from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    therapist = "therapist"
    patient = "patient"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)

    created_exercises = relationship("Exercise", back_populates="creator")
    assignments = relationship(
        "Assignment",
        back_populates="patient",
        foreign_keys="Assignment.patient_id"
    )
    sessions = relationship("Session", back_populates="patient")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    duration_seconds = Column(Integer, default=30)
    sets = Column(Integer, default=3)
    reps = Column(Integer, default=10)
    body_part = Column(String, nullable=False)
    difficulty = Column(String, default="beginner")
    created_by = Column(Integer, ForeignKey("users.id"))

    creator = relationship("User", back_populates="created_exercises")
    assignments = relationship("Assignment", back_populates="exercise")
    sessions = relationship("Session", back_populates="exercise")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    therapist_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String, default="assigned")

    patient = relationship(
        "User",
        back_populates="assignments",
        foreign_keys=[patient_id]
    )
    exercise = relationship("Exercise", back_populates="assignments")

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    reps_completed = Column(Integer, nullable=False)
    reps_target = Column(Integer, nullable=False)
    completed = Column(String, default="partial")  # partial or completed
    created_at = Column(DateTime, server_default=func.now())

    patient = relationship("User", back_populates="sessions")
    exercise = relationship("Exercise", back_populates="sessions")

class ActiveCall(Base):
    __tablename__ = "active_calls"

    id = Column(Integer, primary_key=True, index=True)
    therapist_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_name = Column(String, nullable=False)
    is_active = Column(String, default="active")