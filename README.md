# FreeLanceFlow - Freelance Business Management Platform

A production-ready SaaS dashboard for freelancers to manage clients, projects, payments, and schedules.

## 🚀 Features

- **Dashboard Overview**: Revenue stats, project tracking, and upcoming reminders
- **Client Management**: Track clients, contact info, and company details
- **Project Tracking**: Budget management, deadlines, status tracking
- **Payment System**: Flexible partial/full payment tracking
- **Reminders & Scheduling**: Deadline alerts, follow-ups, payment reminders
- **Authentication**: JWT + Google OAuth support
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Framer Motion (animations)
- Recharts (charts)
- Lucide React (icons)

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy (async)
- Alembic (migrations)
- JWT authentication
- APScheduler (background jobs)

## 📁 Project Structure

```
freelancing-manager/
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── backend/           # FastAPI
│   ├── app/
│   │   ├── routers/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── core/
│   ├── alembic/
│   └── main.py
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL

### 1. Clone & Setup

```bash
git clone <repository-url>
cd freelancing-manager
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
alembic upgrade head

# Start server
python main.py
```

Backend runs on http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start dev server
npm run dev
```

Frontend runs on http://localhost:5173

## 📖 API Documentation

Once backend is running, access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🗄️ Database Setup

### Local PostgreSQL

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE freelanceflow;
```

3. Update `backend/.env`:
```
DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@localhost:5432/freelanceflow
```

### Production Database (Recommended)

For 24/7 availability, use a cloud provider:

- **Supabase** (Free tier, easiest setup)
- **Railway** (Pay-as-you-go)
- **Render** (Free tier available)

## 🔐 Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://user:pass@host/db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
```

## 🚢 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Connect Vercel to your repo
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend (Render/Railway)

1. Push to GitHub
2. Connect Render/Railway
3. Set environment variables
4. Deploy

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🆘 Support

For issues or questions, please open a GitHub issue.

