from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from app.models.project import ProjectStatus
from app.schemas.client import ClientResponse


class ProjectBase(BaseModel):
    name: str
    description: str | None = None
    budget: Decimal
    currency_code: str = "USD"
    exchange_rate_to_usd: Decimal = Decimal("1.0")
    status: ProjectStatus = ProjectStatus.ACTIVE
    deadline: datetime | None = None


class ProjectCreate(ProjectBase):
    client_id: str


class ProjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    budget: Decimal | None = None
    currency_code: str | None = None
    exchange_rate_to_usd: Decimal | None = None
    status: ProjectStatus | None = None
    deadline: datetime | None = None
    client_id: str | None = None


class ProjectResponse(ProjectBase):
    id: str
    user_id: str
    client_id: str
    client: ClientResponse | None = None
    amount_paid: Decimal
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
