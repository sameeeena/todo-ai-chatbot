from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from backend.core.database import engine
from backend.models import Todo # Import to register models
from backend.api.routes import todos

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(title="Todo API", version="1.0.0", lifespan=lifespan)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "https://todo-app-frontend.vercel.app", # Placeholder for production
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(todos.router, prefix="/todos", tags=["todos"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running", "status": "independent"}

@app.get("/health")
def health_check():
    return {"status": "ok", "database_url_configured": "DATABASE_URL" in os.environ}
