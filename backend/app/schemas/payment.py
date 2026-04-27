from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal


class PaymentBase(BaseModel):
    amount: Decimal
    currency_code: str = "USD"
    exchange_rate_used: Decimal = Decimal("1.0")
    payment_date: datetime | None = None
    payment_method: str | None = None
    notes: str | None = None
    is_received: bool = False


class PaymentCreate(PaymentBase):
    project_id: str


class PaymentUpdate(BaseModel):
    amount: Decimal | None = None
    currency_code: str | None = None
    exchange_rate_used: Decimal | None = None
    payment_date: datetime | None = None
    payment_method: str | None = None
    notes: str | None = None
    is_received: bool | None = None


class PaymentResponse(PaymentBase):
    id: str
    project_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PaymentReceive(BaseModel):
    is_received: bool = True
