from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
from sqlmodel import SQLModel

# Import modules
import sys
from pathlib import Path

# Add the current directory to path to ensure modules are found
current_dir = Path(__file__).resolve().parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

# Standardized imports (without backend. prefix for Docker compatibility)
from core.database import engine
from models.todo import Todo 
from models.task import Task
from models.conversation import Conversation
from models.message import Message
from api.routes.todos import router as todos_router
from api.routes.chat import router as chat_router

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
    "http://127.0.0.1:3000",
    "https://todo-ai-chatbot-five.vercel.app",
    "*"  # Allow all origins during development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Authorization"],
)

# Include Routers
app.include_router(todos_router, prefix="/todos", tags=["todos"])
app.include_router(chat_router, prefix="/api", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "ok", "database_url_configured": "DATABASE_URL" in os.environ}
