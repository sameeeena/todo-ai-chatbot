from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Get DB URL from env
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback to local sqlite for safety, but HuggingFace should have this set
    DATABASE_URL = "sqlite:///./todo.db"
    print("Warning: DATABASE_URL not set, using local SQLite")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create Engine
if DATABASE_URL.startswith("sqlite:///"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session