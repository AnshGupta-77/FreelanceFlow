#!/usr/bin/env python3
"""
Database schema synchronization script.

This script drops all tables and recreates them based on current SQLAlchemy models.
WARNING: This will DELETE ALL DATA. Use only in development.
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine
from app.core.database import Base
from app.core.config import settings
from app.models import User, Client, Project, Payment, Reminder


async def reset_database():
    """Drop and recreate all tables."""
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        print("Dropping all tables...")
        await conn.run_sync(Base.metadata.drop_all)
        
        print("Creating tables from current models...")
        await conn.run_sync(Base.metadata.create_all)
    
    await engine.dispose()
    print("Database synchronized successfully!")


if __name__ == "__main__":
    print("WARNING: This will DELETE ALL DATA and recreate tables.")
    print("Current models:")
    print(f"  - User: {User.__tablename__}")
    print(f"  - Client: {Client.__tablename__}")
    print(f"  - Project: {Project.__tablename__}")
    print(f"  - Payment: {Payment.__tablename__}")
    print(f"  - Reminder: {Reminder.__tablename__}")
    print()
    
    response = input("Type 'yes' to continue: ")
    if response.lower() == 'yes':
        asyncio.run(reset_database())
    else:
        print("Cancelled.")
