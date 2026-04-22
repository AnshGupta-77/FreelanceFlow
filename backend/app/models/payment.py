import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric, Boolean, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_date = Column(DateTime(timezone=True), nullable=True)
    payment_method = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    is_received = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    project = relationship("Project", back_populates="payments")
