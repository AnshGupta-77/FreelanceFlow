from pydantic import BaseModel, EmailStr
from datetime import datetime


class ClientBase(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    company: str | None = None
    notes: str | None = None


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    company: str | None = None
    notes: str | None = None


class ClientResponse(ClientBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
