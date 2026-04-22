from app.routers.auth import router as auth_router
from app.routers.clients import router as clients_router
from app.routers.projects import router as projects_router
from app.routers.payments import router as payments_router
from app.routers.reminders import router as reminders_router
from app.routers.dashboard import router as dashboard_router

__all__ = [
    "auth_router",
    "clients_router",
    "projects_router",
    "payments_router",
    "reminders_router",
    "dashboard_router",
]
