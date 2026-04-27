import uuid
from datetime import datetime, timezone, timedelta
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, engine
from app.core.database import Base
from app.core.security import hash_password
from app.models.user import User
from app.models.client import Client
from app.models.project import Project, ProjectStatus
from app.models.payment import Payment
from app.models.reminder import Reminder, ReminderType


async def clear_database(session: AsyncSession):
    """Clear all existing data from database to avoid hash conflicts."""
    print("Clearing existing database data...")
    
    # Delete in reverse order of dependencies
    from app.models.reminder import Reminder
    from app.models.payment import Payment
    from app.models.project import Project
    from app.models.client import Client
    from app.models.user import User
    
    # Delete all records (order matters due to foreign keys)
    await session.execute(select(Reminder))
    await session.execute(select(Payment))
    await session.execute(select(Project))
    await session.execute(select(Client))
    await session.execute(select(User))
    
    # Use raw delete to bypass ORM
    from sqlalchemy import text
    await session.execute(text("DELETE FROM reminders"))
    await session.execute(text("DELETE FROM payments"))
    await session.execute(text("DELETE FROM projects"))
    await session.execute(text("DELETE FROM clients"))
    await session.execute(text("DELETE FROM users"))
    
    await session.commit()
    print("Database cleared successfully.")


async def seed_database():
    """Seed the database with demo data using Argon2 password hashing."""
    async with AsyncSessionLocal() as session:
        # Always clear existing data to avoid bcrypt/argon2 hash conflicts
        await clear_database(session)
        
        print("Seeding database with demo data...")
        
        # Create demo user
        demo_user = User(
            id=str(uuid.uuid4()),
            email="demo@example.com",
            hashed_password=hash_password("password123"),
            full_name="Demo User",
            default_currency="USD",
        )
        session.add(demo_user)
        await session.flush()  # Get the user_id
        
        print(f"Created demo user: {demo_user.email}")
        
        # Create clients
        clients_data = [
            {
                "name": "Acme Corporation",
                "email": "contact@acme.com",
                "phone": "+1 (555) 123-4567",
                "company": "Acme Corp",
                "notes": "Long-term client, prefers email communication"
            },
            {
                "name": "TechStart Inc",
                "email": "projects@techstart.io",
                "phone": "+1 (555) 987-6543",
                "company": "TechStart",
                "notes": "Startup client, fast-paced projects"
            },
            {
                "name": "Global Design Studio",
                "email": "hello@globaldesign.com",
                "phone": "+44 20 7123 4567",
                "company": "Global Design",
                "notes": "UK-based, design-focused projects"
            },
            {
                "name": "Finance Hub",
                "email": "dev@financehub.com",
                "phone": "+1 (555) 456-7890",
                "company": "FinanceHub",
                "notes": "Financial services, high security requirements"
            }
        ]
        
        clients = []
        for client_data in clients_data:
            client = Client(
                id=str(uuid.uuid4()),
                user_id=demo_user.id,
                **client_data
            )
            session.add(client)
            clients.append(client)
        
        await session.flush()
        print(f"Created {len(clients)} clients")
        
        # Create projects with different currencies
        projects_data = [
            {
                "name": "E-commerce Website Redesign",
                "description": "Complete redesign of the e-commerce platform with modern UI/UX",
                "budget": Decimal("15000.00"),
                "currency_code": "USD",
                "exchange_rate_to_usd": Decimal("1.0"),
                "status": ProjectStatus.ACTIVE,
                "deadline": datetime.now(timezone.utc) + timedelta(days=45),
                "client_index": 0
            },
            {
                "name": "Mobile App Development",
                "description": "iOS and Android app for inventory management",
                "budget": Decimal("25000.00"),
                "currency_code": "EUR",
                "exchange_rate_to_usd": Decimal("1.08"),
                "status": ProjectStatus.ACTIVE,
                "deadline": datetime.now(timezone.utc) + timedelta(days=90),
                "client_index": 1
            },
            {
                "name": "Brand Identity Package",
                "description": "Logo, brand guidelines, and marketing materials",
                "budget": Decimal("8500.00"),
                "currency_code": "GBP",
                "exchange_rate_to_usd": Decimal("1.27"),
                "status": ProjectStatus.COMPLETED,
                "deadline": datetime.now(timezone.utc) - timedelta(days=30),
                "client_index": 2
            },
            {
                "name": "Financial Dashboard",
                "description": "Real-time analytics dashboard for trading data",
                "budget": Decimal("35000.00"),
                "currency_code": "USD",
                "exchange_rate_to_usd": Decimal("1.0"),
                "status": ProjectStatus.ACTIVE,
                "deadline": datetime.now(timezone.utc) + timedelta(days=60),
                "client_index": 3
            },
            {
                "name": "API Integration Project",
                "description": "Third-party API integration and data synchronization",
                "budget": Decimal("12000.00"),
                "currency_code": "CAD",
                "exchange_rate_to_usd": Decimal("0.74"),
                "status": ProjectStatus.OVERDUE,
                "deadline": datetime.now(timezone.utc) - timedelta(days=15),
                "client_index": 1
            }
        ]
        
        projects = []
        for project_data in projects_data:
            client_idx = project_data.pop("client_index")
            project = Project(
                id=str(uuid.uuid4()),
                user_id=demo_user.id,
                client_id=clients[client_idx].id,
                amount_paid=Decimal("0.00"),
                **project_data
            )
            session.add(project)
            projects.append(project)
        
        await session.flush()
        print(f"Created {len(projects)} projects")
        
        # Create payments
        payments_data = [
            {
                "project_index": 0,
                "amount": Decimal("5000.00"),
                "currency_code": "USD",
                "is_received": True,
                "payment_method": "Bank Transfer",
                "notes": "Initial deposit"
            },
            {
                "project_index": 0,
                "amount": Decimal("3000.00"),
                "currency_code": "USD",
                "is_received": True,
                "payment_method": "PayPal",
                "notes": "Milestone 1 payment"
            },
            {
                "project_index": 1,
                "amount": Decimal("10000.00"),
                "currency_code": "EUR",
                "is_received": True,
                "payment_method": "Wire Transfer",
                "notes": "Upfront payment"
            },
            {
                "project_index": 2,
                "amount": Decimal("8500.00"),
                "currency_code": "GBP",
                "is_received": True,
                "payment_method": "Credit Card",
                "notes": "Full payment - project completed"
            },
            {
                "project_index": 3,
                "amount": Decimal("10000.00"),
                "currency_code": "USD",
                "is_received": False,
                "payment_method": "Bank Transfer",
                "notes": "Pending - awaiting approval"
            },
            {
                "project_index": 4,
                "amount": Decimal("4000.00"),
                "currency_code": "CAD",
                "is_received": True,
                "payment_method": "e-Transfer",
                "notes": "Partial payment received"
            }
        ]
        
        payments = []
        for payment_data in payments_data:
            project_idx = payment_data.pop("project_index")
            payment = Payment(
                id=str(uuid.uuid4()),
                project_id=projects[project_idx].id,
                exchange_rate_used=projects[project_idx].exchange_rate_to_usd,
                payment_date=datetime.now(timezone.utc) - timedelta(days=7) if payment_data["is_received"] else None,
                **payment_data
            )
            session.add(payment)
            payments.append(payment)
            
            # Update project amount_paid
            if payment_data["is_received"]:
                projects[project_idx].amount_paid += payment_data["amount"]
        
        await session.flush()
        print(f"Created {len(payments)} payments")
        
        # Create reminders
        reminders_data = [
            {
                "title": "Website Redesign - Client Review",
                "description": "Schedule review meeting with Acme Corp for design approval",
                "reminder_type": ReminderType.DEADLINE,
                "due_date": datetime.now(timezone.utc) + timedelta(days=3),
                "is_completed": False
            },
            {
                "title": "Mobile App - Sprint Planning",
                "description": "Plan next sprint for inventory management features",
                "reminder_type": ReminderType.DEADLINE,
                "due_date": datetime.now(timezone.utc) + timedelta(days=7),
                "is_completed": False
            },
            {
                "title": "Follow up with Finance Hub",
                "description": "Check on pending payment approval status",
                "reminder_type": ReminderType.FOLLOW_UP,
                "due_date": datetime.now(timezone.utc) + timedelta(days=2),
                "is_completed": False
            },
            {
                "title": "Payment Due - API Integration",
                "description": "Send invoice reminder for overdue payment",
                "reminder_type": ReminderType.PAYMENT,
                "due_date": datetime.now(timezone.utc) - timedelta(days=5),
                "is_completed": False
            },
            {
                "title": "Complete Documentation",
                "description": "Update project documentation for completed brand identity work",
                "reminder_type": ReminderType.CUSTOM,
                "due_date": datetime.now(timezone.utc) + timedelta(days=14),
                "is_completed": True
            },
            {
                "title": "Quarterly Tax Preparation",
                "description": "Prepare financial reports for quarterly tax filing",
                "reminder_type": ReminderType.CUSTOM,
                "due_date": datetime.now(timezone.utc) + timedelta(days=30),
                "is_completed": False
            }
        ]
        
        for reminder_data in reminders_data:
            reminder = Reminder(
                id=str(uuid.uuid4()),
                user_id=demo_user.id,
                **reminder_data
            )
            session.add(reminder)
        
        await session.flush()
        print(f"Created {len(reminders_data)} reminders")
        
        # Commit all changes
        await session.commit()
        print("Database seeding completed successfully!")
        print(f"\nDemo account:")
        print(f"  Email: demo@example.com")
        print(f"  Password: password123")
