from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from decimal import Decimal

from app.core.database import get_db
from app.models import Payment, Project, User
from app.schemas import PaymentCreate, PaymentUpdate, PaymentResponse, PaymentReceive
from app.routers.auth import get_current_user

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/", response_model=List[PaymentResponse])
async def get_payments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Payment)
        .join(Project)
        .where(Project.user_id == current_user.id)
    )
    payments = result.scalars().all()
    return list(payments)


@router.get("/pending", response_model=List[PaymentResponse])
async def get_pending_payments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Payment)
        .join(Project)
        .where(
            Project.user_id == current_user.id,
            Payment.is_received == False
        )
    )
    payments = result.scalars().all()
    return list(payments)


@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def create_payment(
    payment_data: PaymentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify project exists and belongs to user
    result = await db.execute(
        select(Project).where(
            Project.id == payment_data.project_id,
            Project.user_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    payment = Payment(**payment_data.model_dump())
    db.add(payment)
    
    # Update project's amount_paid if payment is received
    if payment.is_received:
        project.amount_paid = Decimal(str(project.amount_paid)) + Decimal(str(payment.amount))
    
    await db.commit()
    await db.refresh(payment)
    return payment


@router.put("/{payment_id}/receive", response_model=PaymentResponse)
async def mark_payment_received(
    payment_id: str,
    data: PaymentReceive,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Payment)
        .join(Project)
        .where(
            Payment.id == payment_id,
            Project.user_id == current_user.id
        )
    )
    payment = result.scalar_one_or_none()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Get project for amount update
    result = await db.execute(
        select(Project).where(Project.id == payment.project_id)
    )
    project = result.scalar_one()
    
    # Update payment status
    old_status = payment.is_received
    payment.is_received = data.is_received
    
    # Update project's amount_paid
    if data.is_received and not old_status:
        project.amount_paid = Decimal(str(project.amount_paid)) + Decimal(str(payment.amount))
    elif not data.is_received and old_status:
        project.amount_paid = Decimal(str(project.amount_paid)) - Decimal(str(payment.amount))
    
    await db.commit()
    await db.refresh(payment)
    return payment


@router.get("/total-revenue")
async def get_total_revenue(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(func.sum(Payment.amount))
        .join(Project)
        .where(
            Project.user_id == current_user.id,
            Payment.is_received == True
        )
    )
    total = result.scalar() or Decimal("0")
    return {"total_revenue": total}
