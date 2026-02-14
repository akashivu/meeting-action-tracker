from pydantic import BaseModel
from typing import Optional, List

# Shared fields for action items
class ActionItemBase(BaseModel):
    task: str
    owner: Optional[str] = None
    due_date: Optional[str] = None
    done: Optional[bool] = False

# Schema used when creating a new action item
class ActionItemCreate(ActionItemBase):
    pass

# Schema returned in API responses
class ActionItem(ActionItemBase):
    id: int

    class Config:
        from_attributes = True

# Schema for creating a transcript
class TranscriptCreate(BaseModel):
    content: str

# Transcript response schema including extracted action items
class Transcript(BaseModel):
    id: int
    content: str
    action_items: List[ActionItem] = []

    class Config:
        from_attributes = True

class ExtractResponse(BaseModel):
    transcript_id: int
    action_items: List[ActionItem]
