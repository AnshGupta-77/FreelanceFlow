from pydantic import BaseModel
from datetime import datetime
from app.models.reminder import ReminderType


class ReminderBase(BaseModel):
    title: str
    description: str | None = None
    reminder_type: ReminderType = ReminderType.CUSTOM
    due_date: datetime
    is_completed: bool = False


class ReminderCreate(ReminderBase):
    pass


class ReminderUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    reminder_type: ReminderType | None = None
    due_date: datetime | None = None
    is_completed: bool | None = None


class ReminderResponse(ReminderBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
