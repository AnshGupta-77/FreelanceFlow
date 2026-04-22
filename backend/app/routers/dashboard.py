from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from typing import List
from decimal import Decimal
from datetime import datetime, timezone, timedelta

from app.core.database import get_db
from app.models import User, Project, Payment, Client, ProjectStatus
from app.schemas import DashboardStats, MonthlyEarning, TopClient, DashboardOverview, ClientResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Total revenue (received payments)
    revenue_result = await db.execute(
        select(func.sum(Payment.amount))
        .join(Project)
        .where(
            Project.user_id == current_user.id,
            Payment.is_received == True
        )
    )
    total_revenue = revenue_result.scalar() or Decimal("0")
    
    # Pending payments
    pending_result = await db.execute(
        select(func.sum(Payment.amount))
        .join(Project)
        .where(
            Project.user_id == current_user.id,
            Payment.is_received == False
        )
    )
    pending_payments = pending_result.scalar() or Decimal("0")
    
    # Active projects
    active_result = await db.execute(
        select(func.count(Project.id)).where(
            Project.user_id == current_user.id,
            Project.status.in_([ProjectStatus.ACTIVE, ProjectStatus.OVERDUE])
        )
    )
    active_projects = active_result.scalar() or 0
    
    # Overdue projects
    overdue_result = await db.execute(
        select(func.count(Project.id)).where(
            Project.user_id == current_user.id,
            Project.status == ProjectStatus.OVERDUE
        )
    )
    overdue_projects = overdue_result.scalar() or 0
    
    # Total clients
    clients_result = await db.execute(
        select(func.count(Client.id)).where(
            Client.user_id == current_user.id
        )
    )
    total_clients = clients_result.scalar() or 0
    
    return DashboardStats(
        totalRevenue=total_revenue,
        pendingPayments=pending_payments,
        activeProjects=active_projects,
        overdueProjects=overdue_projects,
        totalClients=total_clients
    )


@router.get("/monthly-earnings", response_model=List[MonthlyEarning])
async def get_monthly_earnings(
    months: int = 6,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Calculate date range
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=30 * months)
    
    result = await db.execute(
        select(
            extract('year', Payment.created_at).label('year'),
            extract('month', Payment.created_at).label('month'),
            func.sum(Payment.amount).label('total')
        )
        .join(Project)
        .where(
            Project.user_id == current_user.id,
            Payment.is_received == True,
            Payment.created_at >= start_date
        )
        .group_by('year', 'month')
        .order_by('year', 'month')
    )
    
    earnings = []
    for row in result.all():
        month_name = datetime(int(row.year), int(row.month), 1).strftime("%b %Y")
        earnings.append(MonthlyEarning(
            month=month_name,
            amount=row.total or Decimal("0")
        ))
    
    return earnings


@router.get("/top-clients", response_model=List[TopClient])
async def get_top_clients(
    limit: int = 5,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(
            Client,
            func.sum(Payment.amount).label('total_revenue')
        )
        .join(Project, Client.id == Project.client_id)
        .join(Payment, Project.id == Payment.project_id)
        .where(
            Client.user_id == current_user.id,
            Payment.is_received == True
        )
        .group_by(Client.id)
        .order_by(func.sum(Payment.amount).desc())
        .limit(limit)
    )
    
    top_clients = []
    for row in result.all():
        client_data = ClientResponse.model_validate(row.Client)
        top_clients.append(TopClient(
            client=client_data,
            totalRevenue=row.total_revenue or Decimal("0")
        ))
    
    return top_clients


@router.get("/overview", response_model=DashboardOverview)
async def get_dashboard_overview(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stats = await get_dashboard_stats(db, current_user)
    monthly_earnings = await get_monthly_earnings(months=6, db=db, current_user=current_user)
    top_clients = await get_top_clients(limit=5, db=db, current_user=current_user)
    
    return DashboardOverview(
        stats=stats,
        monthlyEarnings=monthly_earnings,
        topClients=top_clients
    )
