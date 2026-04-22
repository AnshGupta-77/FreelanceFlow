from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal


class PaymentBase(BaseModel):
    amount: Decimal
    payment_date: datetime | None = None
    payment_method: str | None = None
    notes: str | None = None
    is_received: bool = False


class PaymentCreate(PaymentBase):
    project_id: str


class PaymentUpdate(BaseModel):
    amount: Decimal | None = None
    payment_date: datetime | None = None
    payment_method: str | None = None
    notes: str | None = None
    is_received: bool | None = None


class PaymentResponse(PaymentBase):
    id: str
    project_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class PaymentReceive(BaseModel):
    is_received: bool = True
