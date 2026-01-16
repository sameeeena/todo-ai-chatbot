from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
try:
    from backend.core.database import engine
    from backend.models import Todo # Import to register models
    from backend.api.routes import todos
except ImportError:
    # Fallback for when running directly from backend directory
    from .core.database import engine
    from .models import Todo # Import to register models
    from .api.routes import todos

# Load environment variables
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(title="Todo API", version="1.0.0", lifespan=lifespan)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",  # In case frontend is served from backend
    "https://todo-app-frontend.vercel.app", # Placeholder for production
    "*"  # Allow all origins during development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers including Authorization
    expose_headers=["Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Access-Control-Expose-Headers", "Authorization"],
    # Add this to allow preflight requests
    max_age=3600,  # Cache preflight responses for 1 hour
)

# Include Routers
app.include_router(todos.router, prefix="/todos", tags=["todos"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running", "status": "independent"}

@app.get("/health")
def health_check():
    return {"status": "ok", "database_url_configured": "DATABASE_URL" in os.environ}