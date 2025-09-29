# SIH Backend Setup with Your PostgreSQL Configuration

## Quick Setup Steps

### 1. **Database Setup**
Your `.env` file is already configured with your PostgreSQL credentials:
- **User**: postgres
- **Password**: admin79***
- **Host**: localhost:5432
- **New Database**: sih_backend

### 2. **Create Database & Setup**

**Option A: Automatic Setup (Recommended)**
```bash
# Run the database setup script
setup_db.bat
```

**Option B: Manual Setup**
```sql
-- Connect to PostgreSQL and run these commands:
CREATE DATABASE sih_backend;

-- Connect to the new database and enable vector extension
\c sih_backend
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. **Install Dependencies & Run**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
py manage.py migrate

# Create initial data (journal prompts, chat templates)
py manage.py setup_initial_data

# Create superuser account
py manage.py createsuperuser

# Start the development server
py manage.py runserver
```

### 4. **Optional: Start Background Services**
For full AI functionality, you'll also need:

```bash
# Terminal 1: Start Redis (for caching and WebSockets)
redis-server

# Terminal 2: Start Celery worker (for AI processing)
celery -A sih_backend worker -l info

# Terminal 3: Django server (already running)
py manage.py runserver
```

## What Works Out of the Box

✅ **Full AI Integration** with PostgreSQL + pgvector
✅ **Vector Embeddings** for semantic search
✅ **Journal Entries** with mood tracking
✅ **AI Chat Sessions** with Gemini API
✅ **Risk Assessment** and escalation
✅ **User Management** with role-based access
✅ **Real-time WebSockets** for chat
✅ **Admin Interface** at `/admin/`
✅ **API Documentation** at `/swagger/`

## Database Schema

Your new `sih_backend` database will contain:
- **users_user** - Custom user model with roles
- **users_profile** - Extended user profiles  
- **journals_journal** - Journal entries with AI analysis
- **chat_session** - AI chat sessions
- **chat_message** - Chat messages with risk assessment
- And more...

## Environment Variables

The `.env` file is configured with:
```env
DATABASE_URL=postgresql://postgres:admin79***@localhost:5432/sih_backend
```

You can update the `GEMINI_API_KEY` when you get your Google AI API key for full AI features.

## Troubleshooting

**If database creation fails:**
1. Ensure PostgreSQL is running
2. Check password is correct: `admin79***`
3. Verify user has database creation privileges

**If pgvector fails to install:**
- AI features will still work (sentiment analysis, chat)
- Only vector similarity search will be disabled
- You can install pgvector later if needed

**Access URLs:**
- **Main App**: http://localhost:8000/
- **Admin Panel**: http://localhost:8000/admin/
- **API Docs**: http://localhost:8000/swagger/
- **API Schema**: http://localhost:8000/redoc/