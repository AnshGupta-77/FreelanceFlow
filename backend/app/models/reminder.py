import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Boolean, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class ReminderType(str, enum.Enum):
    DEADLINE = "deadline"
    PAYMENT = "payment"
    FOLLOW_UP = "follow_up"
    CUSTOM = "custom"


class Reminder(Base):
    __tablename__ = "reminders"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    reminder_type = Column(Enum(ReminderType), default=ReminderType.CUSTOM, nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User", back_populates="reminders")
