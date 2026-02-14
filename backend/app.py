from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from fastapi.middleware.cors import CORSMiddleware

import os
import json
from sqlalchemy import text
from dotenv import load_dotenv
from groq import Groq
from database import engine, Base, get_db
import models

load_dotenv()
if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY is not set in environment variables")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI(title="Meeting Action Tracker API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "Backend is running"}

# Create and store a transcript in the database
@app.post("/transcripts")
def create_transcript(content: str, db: Session = Depends(get_db)):
    transcript = models.Transcript(content=content)
    db.add(transcript)
    db.commit()
    db.refresh(transcript)

    return {"id": transcript.id, "content": transcript.content}
# Returns the latest 5 transcripts (most recent first)
@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    transcripts = (
        db.query(models.Transcript)
        .order_by(models.Transcript.created_at.desc())
        .limit(5)
        .all()
    )

    return transcripts

def extract_action_items_llm(text: str):
    prompt = f"""
Extract action items from the meeting transcript.

Return ONLY valid JSON.
No explanation.

Format:
[
  {{"task": "task text", "owner": "person or null", "due_date": "date or null"}}
]

Transcript:
{text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",

        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )

    content = response.choices[0].message.content.strip()
    content = content.replace("```json", "").replace("```", "")

    return content



@app.post("/extract")
def extract(transcript_text: str, db: Session = Depends(get_db)):
    if not transcript_text.strip():
        return {"error": "Transcript cannot be empty"}

    # Save transcript
    transcript = models.Transcript(content=transcript_text)
    db.add(transcript)
    db.commit()
    db.refresh(transcript)

    # Call LLM
    try:
        llm_output = extract_action_items_llm(transcript_text)
        items = json.loads(llm_output)
    except Exception as e:
        print("LLM ERROR:", e)
        return {"error": "Failed to extract action items"}

    # Save action items
    saved_items = []

    for item in items:
        action = models.ActionItem(
            task=item.get("task"),
            owner=item.get("owner"),
            due_date=item.get("due_date"),
            transcript_id=transcript.id,
        )
        db.add(action)
        saved_items.append(action)

    db.commit()

    # Refresh to get DB IDs
    for action in saved_items:
        db.refresh(action)

    saved_items_data = [
        {
            "id": action.id,
            "task": action.task,
            "owner": action.owner,
            "due_date": action.due_date,
            "done": action.done,
        }
        for action in saved_items
    ]

    return {
        "transcript_id": transcript.id,
        "action_items": saved_items_data,
    }


@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.ActionItem).all()

@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: str, owner: str = None, due_date: str = None, db: Session = Depends(get_db)):
    action = db.query(models.ActionItem).filter(models.ActionItem.id == task_id).first()

    if not action:
        return {"error": "Task not found"}

    action.task = task
    action.owner = owner
    action.due_date = due_date

    db.commit()
    return {"message": "Task updated"}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    action = db.query(models.ActionItem).filter(models.ActionItem.id == task_id).first()

    if not action:
        return {"error": "Task not found"}

    db.delete(action)
    db.commit()

    return {"message": "Task deleted"}

@app.patch("/tasks/{task_id}/done")
def mark_done(task_id: int, done: bool, db: Session = Depends(get_db)):
    action = db.query(models.ActionItem).filter(models.ActionItem.id == task_id).first()

    if not action:
        return {"error": "Task not found"}

    action.done = done
    db.commit()

    return {"message": "Updated"}

@app.get("/status")
def status(db: Session = Depends(get_db)):
    status = {
        "backend": "ok",
        "database": "ok",
        "llm": "unknown"
    }

    # Check DB connection
    try:
        db.execute(text("SELECT 1"))
        status["database"] = "connected"
    except:
        status["database"] = "error"

    # Check LLM connection (lightweight test)
    try:
        client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": "hello"}],
            max_tokens=1
        )
        status["llm"] = "connected"
    except:
        status["llm"] = "error"

    return status

@app.post("/tasks")
def create_task(task: str, db: Session = Depends(get_db)):
    action = models.ActionItem(task=task)
    db.add(action)
    db.commit()
    db.refresh(action)

    return {
        "id": action.id,
        "task": action.task,
        "owner": action.owner,
        "due_date": action.due_date,
        "done": action.done,
    }
