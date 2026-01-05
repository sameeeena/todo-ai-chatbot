from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv

load_dotenv()

# Get DB URL from env
DATABASE_URL = os.getenv("DATABASE_URL")

# Ensure URL is set
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Handle special case for postgres:// vs postgresql:// (if needed by SQLAlchemy)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create Engine
# echo=True enables SQL logging for debugging, only enable in dev
DEBUG_MODE = os.getenv("DEBUG", "False").lower() == "true"
engine = create_engine(DATABASE_URL, echo=DEBUG_MODE)

def get_session() -> Generator[Session, None, None]:
    """
    Dependency to provide a database session for each request.
    Yields a Session object and ensures it's closed after use.
    """
    with Session(engine) as session:
        yield session
