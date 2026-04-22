from pydantic import BaseModel
from decimal import Decimal
from app.schemas.client import ClientResponse


class DashboardStats(BaseModel):
    totalRevenue: Decimal
    pendingPayments: Decimal
    activeProjects: int
    overdueProjects: int
    totalClients: int


class MonthlyEarning(BaseModel):
    month: str
    amount: Decimal


class TopClient(BaseModel):
    client: ClientResponse
    totalRevenue: Decimal


class DashboardOverview(BaseModel):
    stats: DashboardStats
    monthlyEarnings: list[MonthlyEarning]
    topClients: list[TopClient]
