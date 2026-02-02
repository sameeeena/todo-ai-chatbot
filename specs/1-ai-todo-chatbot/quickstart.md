# Quickstart Guide: AI-Powered Todo Chatbot

## Prerequisites
- Python 3.11+
- Node.js 18+
- Neon PostgreSQL account
- OpenAI API key
- Better Auth account

## Setup

### 1. Environment Configuration
```bash
# Backend environment variables
cp backend/.env.example backend/.env
# Configure: OPENAI_API_KEY, DATABASE_URL, BETTER_AUTH_SECRET
```

### 2. Database Setup
```bash
# Initialize database with required models
python backend/src/models/init_db.py
```

### 3. Backend Service
```bash
cd backend
pip install -r requirements.txt
python -m src.api.main
```

### 4. Frontend Service
```bash
cd frontend
npm install
npm run dev
```

## Architecture Components

### MCP Tools Layer
- Located in `backend/src/mcp_tools/`
- Standardized interfaces for all database operations
- Implements Add, List, Update, Complete, Delete operations for tasks

### Agent Layer
- Located in `backend/src/agents/`
- Processes natural language input using OpenAI Agents SDK
- Integrates with MCP tools for database operations

### API Layer
- Located in `backend/src/api/`
- FastAPI endpoints for handling chat requests
- Authentication middleware with Better Auth

### Frontend Layer
- Located in `frontend/src/app/chat/`
- OpenAI ChatKit integration for conversational UI
- API communication with backend services

## Running Tests
```bash
# Backend tests
cd backend
pytest tests/unit/
pytest tests/integration/

# Frontend tests
cd frontend
npm test
```