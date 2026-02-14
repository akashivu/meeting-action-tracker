# Meeting Action Items Tracker

A lightweight workspace app that extracts and manages meeting action items from transcripts using an LLM-assisted backend.

This project demonstrates full-stack development, API design, and responsible integration of AI-assisted workflows.

---

## Features

- Paste meeting transcript
- Extract action items (task, owner, due date)
- Edit, delete, and mark tasks as done
- Add tasks manually
- View last 5 transcripts
- System health status page

---

## Tech Stack

Frontend: React (Vite)
Backend: FastAPI (Python)
Database: SQLite
LLM: Groq (Llama-3.1-8b-instant)

---

## Running Locally

Backend:
cd backend
uvicorn app:app --reload

Frontend:
cd frontend
npm install
npm run dev



---

## Environment Variables

Create `.env` inside backend:


---

## Design Approach

The application is structured as a simple workspace tool:
- FastAPI handles persistence and extraction logic
- React provides a minimal task-editing interface
- LLM is used only for structured action-item extraction
- All task editing is handled deterministically in backend APIs
