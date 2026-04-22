from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from datetime import datetime, timezone

from app.core.database import get_db
from app.models import Reminder, User, ReminderType
from app.schemas import ReminderCreate, ReminderUpdate, ReminderResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/reminders", tags=["Reminders"])


@router.get("/", response_model=List[ReminderResponse])
async def get_reminders(
    completed: bool | None = None,
    reminder_type: ReminderType | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Reminder).where(Reminder.user_id == current_user.id)
    
    if completed is not None:
        query = query.where(Reminder.is_completed == completed)
    
    if reminder_type:
        query = query.where(Reminder.reminder_type == reminder_type)
    
    query = query.order_by(Reminder.due_date)
    
    result = await db.execute(query)
    reminders = result.scalars().all()
    return list(reminders)


@router.get("/upcoming", response_model=List[ReminderResponse])
async def get_upcoming_reminders(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from datetime import timedelta
    
    future_date = datetime.now(timezone.utc) + timedelta(days=days)
    
    result = await db.execute(
        select(Reminder).where(
            Reminder.user_id == current_user.id,
            Reminder.is_completed == False,
            Reminder.due_date <= future_date
        ).order_by(Reminder.due_date)
    )
    reminders = result.scalars().all()
    return list(reminders)


@router.post("/", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    reminder_data: ReminderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminder = Reminder(
        user_id=current_user.id,
        **reminder_data.model_dump()
    )
    db.add(reminder)
    await db.commit()
    await db.refresh(reminder)
    return reminder


@router.put("/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(
    reminder_id: str,
    reminder_data: ReminderUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Reminder).where(
            Reminder.id == reminder_id,
            Reminder.user_id == current_user.id
        )
    )
    reminder = result.scalar_one_or_none()
    
    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found"
        )
    
    update_data = reminder_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(reminder, field, value)
    
    await db.commit()
    await db.refresh(reminder)
    return reminder


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(
    reminder_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Reminder).where(
            Reminder.id == reminder_id,
            Reminder.user_id == current_user.id
        )
    )
    reminder = result.scalar_one_or_none()
    
    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found"
        )
    
    await db.delete(reminder)
    await db.commit()
