from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, exercises, assignments, sessions, calls

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TeleRehab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://*.vercel.app",  # allows all vercel deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(exercises.router)
app.include_router(assignments.router)
app.include_router(sessions.router)
app.include_router(calls.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "TeleRehab API is running!"}