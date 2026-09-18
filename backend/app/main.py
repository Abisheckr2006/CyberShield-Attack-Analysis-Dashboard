from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine, Base
from app.api.endpoints import router as api_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Level 1 — Network Security Exposure Assessment API",
    description="Defensive network exposure assessment backend for authorized systems and lab environments.",
    version="1.0.0"
)

# Enable CORS for React frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local frontend calls
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {
        "title": "Level 1 — Network Security Exposure Assessment API",
        "status": "Online",
        "scope": "Defensive Network Exposure Only (Level 1)",
        "authorization_warning": "Only scan systems you own or have explicit authorization to assess."
    }
