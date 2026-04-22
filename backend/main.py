from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import init_db
from app.routers import (
    auth_router,
    clients_router,
    projects_router,
    payments_router,
    reminders_router,
    dashboard_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    if settings.ENVIRONMENT == "development":
        await init_db()
    yield
    # Shutdown


app = FastAPI(
    title="FreeLanceFlow API",
    description="Backend API for FreeLanceFlow - Freelance Business Management Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(clients_router, prefix="/api/v1/clients", tags=["Clients"])
app.include_router(projects_router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(payments_router, prefix="/api/v1/payments", tags=["Payments"])
app.include_router(reminders_router, prefix="/api/v1/reminders", tags=["Reminders"])
app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["Dashboard"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to FreeLanceFlow API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
