# SIH Backend - Student Mental Health Platform

A production-ready Django backend for a comprehensive student mental health platform with AI integration.

## Features

### Core Functionality
- **JWT Authentication** with refresh tokens in HttpOnly cookies
- **Email-based Login** (no username required)
- **Role-based Access Control** (Student, Counsellor, Peer Moderator, Institute Admin, Super Admin)
- **OAuth Integration** with Google and Microsoft via Django Allauth
- **RESTful APIs** with comprehensive documentation

### Mental Health Features
- **Private Journaling** with mood tracking and voice entries
- **AI Chat Sessions** powered by Google Gemini API
- **Risk Assessment** with automatic escalation to counsellors
- **Keyword-based Content Similarity** (no complex vector setup needed)
- **Peer Support Groups** with real-time chat
- **Counselling Management** with appointment booking
- **Analytics Dashboard** with anonymized insights

### Technical Features
- **PostgreSQL** with JSON fields for rich data aggregation
- **Redis** for caching and WebSocket support
- **Celery** for background AI processing
- **Django Channels** for real-time WebSocket communication
- **Keyword-based Similarity** instead of complex vector embeddings
- **Comprehensive API Documentation** with Swagger/ReDoc

## Quick Start

### Prerequisites
- Python 3.10+
- PostgreSQL 12+ (no extensions needed!)
- Redis 6+

### 🚀 **Super Quick Setup (Recommended)**

```bash
# Clone the repository
git clone <repository-url>
cd sih-backend

# Run the automated setup
quick_setup.bat
```

**That's it!** The script will:
- Create PostgreSQL database
- Install dependencies
- Run migrations
- Create superuser (admin@sih.com / admin123)
- Set up initial data

### 🔧 **Manual Setup**

#### 1. **Database Setup**
```bash
# Create database (no extensions needed!)
psql -U postgres -h localhost -p 5432 -d postgres -c "CREATE DATABASE sih_backend;"
```
**Password:** `admin79***`

#### 2. **Python Environment**
```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

#### 3. **Environment Configuration**
```bash
# Copy environment file
copy .env.example .env
# Edit .env with your settings (already configured for your PostgreSQL)
```

#### 4. **Database Migrations**
```bash
# Create and apply migrations
py manage.py makemigrations
py manage.py migrate
```

#### 5. **Create Superuser**
```bash
# Interactive creation
py manage.py createsuperuser

# Or non-interactive
py manage.py createsuperuser --email admin@example.com --first-name Admin --last-name User --no-input
```

#### 6. **Initial Data Setup**
```bash
# Set up journal prompts and chat templates
py manage.py setup_initial_data
```

#### 7. **Test Setup**
```bash
# Verify everything works
py manage.py test_setup
```

### 🏃 **Running the Application**

#### Development Server
```bash
py manage.py runserver
```

#### With Background Services (Full AI Features)
```bash
# Terminal 1: Redis
redis-server

# Terminal 2: Celery Worker
celery -A sih_backend worker -l info

# Terminal 3: Django Server
py manage.py runserver
```

## 🎯 **Access Points**

After setup, access these URLs:

### **📚 API Documentation & Testing**
- **Swagger UI**: http://localhost:8000/swagger/ - Interactive API documentation
- **ReDoc**: http://localhost:8000/redoc/ - Clean API documentation
- **JSON Schema**: http://localhost:8000/swagger.json - OpenAPI schema
- **Admin Panel**: http://localhost:8000/admin/ - Django admin interface

### **🔗 Core API Endpoints**

#### **Authentication** (`/api/auth/`)
- `POST /api/auth/login/` - Login with email/password
- `POST /api/auth/logout/` - Logout and blacklist tokens
- `POST /api/auth/registration/` - Register new user
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/user/` - Get current user info
- `POST /api/auth/password/change/` - Change password

#### **User Management** (`/api/users/`)
- `GET /api/users/` - List users (role-based filtering)
- `GET /api/users/me/` - Current user detailed info
- `PUT /api/users/update-profile/` - Update user profile
- `POST /api/users/change-password/` - Change password
- `GET /api/users/counsellors/` - List available counsellors
- `GET /api/users/search/?q=query` - Search users
- `GET /api/users/stats/` - User statistics

#### **Journaling** (`/api/journals/`)
- `GET /api/journals/entries/` - List journal entries
- `POST /api/journals/entries/` - Create journal entry
- `GET /api/journals/entries/{id}/` - Get specific entry
- `PUT /api/journals/entries/{id}/` - Update entry
- `DELETE /api/journals/entries/{id}/` - Delete entry
- `GET /api/journals/entries/stats/` - Journal statistics
- `GET /api/journals/entries/mood-trend/` - Mood trend data
- `POST /api/journals/entries/search/` - Advanced search
- `POST /api/journals/entries/{id}/share-with-counsellor/` - Share with counsellor
- `GET /api/journals/prompts/` - Available prompts
- `GET /api/journals/prompts/random/` - Random prompts based on mood
- `GET /api/journals/emotion-frequency/` - Emotion frequency data
- `GET /api/journals/counsellor/shared/` - Shared journals (counsellor only)

#### **AI Chat** (`/api/chat/`)
- `GET /api/chat/sessions/` - List chat sessions
- `POST /api/chat/sessions/` - Create new chat session
- `GET /api/chat/sessions/{id}/` - Get session with messages
- `POST /api/chat/sessions/{id}/send-message/` - Send message
- `POST /api/chat/sessions/{id}/end-session/` - End session
- `POST /api/chat/sessions/{id}/escalate/` - Escalate to counsellor
- `POST /api/chat/sessions/{id}/submit-feedback/` - Submit feedback
- `GET /api/chat/stats/` - Chat statistics
- `GET /api/chat/counsellor/queue/` - Escalated sessions (counsellor only)
- `GET /api/chat/templates/` - Available chat templates

#### **Groups & WebSockets** (`/api/groups/`)
- `ws://localhost:8000/ws/groups/{group_id}/` - Group chat WebSocket
- `ws://localhost:8000/ws/peer-chat/{user_id}/` - Peer chat WebSocket

#### **Future Endpoints** (Skeleton Available)
- `/api/posts/` - Community forum posts
- `/api/counselling/` - Counselling appointments
- `/api/analytics/` - Advanced analytics
- `/api/wearables/` - Wearable data integration

### **Default Credentials (Quick Setup)**
- **Email**: `admin@sih.com`
- **Password**: `admin123`
- **Role**: Super Admin

### **🧪 Quick API Test**
```bash
# Test login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sih.com", "password": "admin123"}'

# Test user info (replace TOKEN with actual token)
curl -X GET http://localhost:8000/api/auth/user/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Configuration

### Environment Variables

Your `.env` file is pre-configured with your PostgreSQL settings:

```env
# Database (configured for your setup)
DATABASE_URL=postgresql://postgres:admin79***@localhost:5432/sih_backend

# Security
SECRET_KEY=sih-backend-secret-key-change-in-production
DEBUG=True

# Redis
REDIS_URL=redis://localhost:6379/0

# Gemini API (add your key)
GEMINI_API_KEY=your-gemini-api-key-here

# OAuth (optional)
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret
```

## Project Structure

```
sih_backend/
├── sih_backend/           # Main project settings
│   ├── settings.py        # Django settings
│   ├── urls.py           # Main URL configuration
│   ├── celery.py         # Celery configuration
│   └── asgi.py           # ASGI configuration for WebSockets
├── users/                # User management and authentication ✅
├── journals/             # Private journaling with AI analysis ✅
├── chat/                 # AI chat sessions and counsellor communication ✅
├── posts/                # Community forum (skeleton)
├── counselling/          # Counselling appointments (skeleton)
├── groups/               # Peer support groups with WebSockets (partial)
├── analytics/            # Analytics and reporting (skeleton)
├── wearables/            # Wearable data integration (skeleton)
├── requirements.txt      # Python dependencies
├── api.md               # Comprehensive API documentation
├── quick_setup.bat      # Automated setup script
└── README.md            # This file
```

## Key Models

### User Model
- Custom user model with email-based authentication
- Role-based permissions (5 roles)
- Extended profile with academic and emergency contact info
- Session tracking for security and analytics

### Journal Model
- Private mood tracking entries with AI analysis
- Voice recording support with transcription
- **Keyword extraction** instead of vector embeddings
- AI sentiment analysis and risk assessment
- JSON-based content categorization

### Chat Models
- AI-powered chat sessions with context from journals
- **Theme detection** using keywords and JSON analysis
- Risk detection with automatic escalation
- Counsellor assignment and queue management
- Session feedback and analytics

## AI Integration

### What Works (Everything Important!)
- ✅ **Gemini AI Integration** - Chat responses, sentiment analysis, risk assessment
- ✅ **Smart Content Analysis** - Keyword extraction, theme detection  
- ✅ **Similar Content Discovery** - Using keywords and mood matching
- ✅ **Risk Detection & Escalation** - Full safety features
- ✅ **Background AI Processing** - Celery tasks for analysis
- ✅ **JSON-based Analytics** - Rich data aggregation

### How AI Features Work

#### Journal Analysis
```python
# AI extracts keywords and themes
content_keywords = ["stress", "exams", "anxiety", "study"]
ai_insights = {
    "themes": ["academic_stress", "time_management"],
    "recommendations": ["Break study into smaller chunks"],
    "risk_level": "medium"
}
```

#### Chat Intelligence
```python
# Sessions track themes and sentiment
session_keywords = ["anxiety", "academic", "pressure"]
message_sentiment = {
    "sentiment_score": -0.3,
    "primary_emotion": "worried",
    "emotions": ["anxious", "overwhelmed"]
}
```

#### Content Similarity
```python
# Find similar content using keywords + mood
similar_entries = Journal.objects.filter(
    mood_level__range=[current_mood-1, current_mood+1],
    content_keywords__overlap=current_keywords
)
```

## Management Commands

### 🗄️ **Database Management**
```bash
# Drop all tables (DANGEROUS - requires confirmation)
py manage.py drop_all_tables --confirm

# Drop tables and reset migration files
py manage.py drop_all_tables --confirm --reset-migrations

# Complete database reset (drop tables + rebuild + setup data)
py manage.py reset_database --confirm

# Skip superuser creation in reset (for automation)
py manage.py reset_database --confirm --skip-superuser
```

### 👤 **User Management**
```bash
# Create superuser (email-based)
py manage.py createsuperuser

# Non-interactive superuser creation
py manage.py createsuperuser --email admin@example.com --first-name Admin --last-name User --no-input

# Setup initial data (journal prompts, chat templates)
py manage.py setup_initial_data
```

### 🧪 **Testing & Validation**
```bash
# Test complete setup and configuration
py manage.py test_setup

# Run Django tests
py manage.py test

# Check Django configuration
py manage.py check
```

### 🔧 **Development Utilities**
```bash
# Open Django shell
py manage.py shell

# Open database shell
py manage.py dbshell

# Collect static files
py manage.py collectstatic

# Show all available commands
py manage.py help
```

### 📊 **Database Operations**
```bash
# Create migrations after model changes
py manage.py makemigrations

# Apply migrations
py manage.py migrate

# Show migration status
py manage.py showmigrations

# Reverse migrations (be careful!)
py manage.py migrate app_name 0001
```

### 🚀 **Background Services**
```bash
# Start Celery worker (for AI processing)
celery -A sih_backend worker -l info

# Start Celery beat (for scheduled tasks)
celery -A sih_backend beat -l info

# Monitor Celery tasks
celery -A sih_backend flower
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login/` - JWT login with email
- `POST /api/auth/registration/` - User registration
- `GET /api/auth/user/` - Current user info
- `POST /api/auth/token/refresh/` - Token refresh

### Core Features
- `GET/POST /api/journals/entries/` - Journal CRUD operations
- `GET /api/journals/entries/stats/` - Journal statistics and trends
- `GET/POST /api/chat/sessions/` - AI chat sessions
- `POST /api/chat/sessions/{id}/send-message/` - Send chat messages
- `GET /api/users/counsellors/` - Available counsellors

See `api.md` for comprehensive API documentation with examples.

## Security Features

### Authentication
- JWT tokens with short expiration (60 minutes)
- Refresh tokens stored in HttpOnly cookies
- Automatic token rotation for enhanced security
- Email-based authentication (no username required)

### Authorization
- Role-based access control with granular permissions
- Data isolation by institute/organization
- Privacy controls for user-generated content

### Data Protection
- JSON-based data storage (human-readable and secure)
- HTTPS enforcement in production
- CORS configuration for frontend integration

## Development

### Running Tests
```bash
py manage.py test
```

### Database Migrations
```bash
# Create migrations after model changes
py manage.py makemigrations

# Apply migrations
py manage.py migrate

# Reset database (development)
py manage.py reset_database --confirm
```

### Code Quality
```bash
# Format code
black .

# Lint code
flake8 .
```

## Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in `.env`
- [ ] Configure secure `SECRET_KEY`
- [ ] Set up SSL/TLS certificates
- [ ] Configure production database
- [ ] Set up Redis with persistence
- [ ] Configure email backend
- [ ] Set up monitoring and logging
- [ ] Configure static file serving
- [ ] Set up backup procedures

### Docker Deployment (Optional)
```bash
# Build image
docker build -t sih-backend .

# Run with docker-compose
docker-compose up -d
```

## Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Check PostgreSQL is running and credentials are correct
psql -U postgres -h localhost -p 5432 -d sih_backend -c "SELECT version();"
```

**Migration Errors:**
```bash
# Reset migrations
py manage.py reset_database --confirm
```

**Superuser Creation Fails:**
```bash
# Use custom command
py manage.py createsuperuser --email admin@example.com --no-input
```

**Dependencies Install Fails:**
```bash
# Update pip first
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Health Checks
```bash
# Test complete setup
py manage.py test_setup

# Check database connection
py manage.py dbshell

# Verify user model
py manage.py shell
>>> from users.models import User
>>> User.objects.count()
```

## What's New (Simplified Version)

### ✅ **Simplified Setup**
- **No vector extensions** needed - just standard PostgreSQL
- **Keyword-based similarity** instead of complex embeddings
- **JSON-based analytics** for rich data aggregation
- **One-command setup** with `quick_setup.bat`

### ✅ **Enhanced Features**
- **Email-based authentication** (no username required)
- **Custom user management** commands
- **Improved error handling** and setup validation
- **Better development tools** and testing commands

### ✅ **AI Features Preserved**
All AI functionality works the same:
- Gemini API integration
- Risk assessment and escalation
- Content analysis and recommendations
- Background processing with Celery

## Support

### Development Help
- Check `SIMPLIFIED_SETUP.md` for detailed setup explanation
- Run `py manage.py test_setup` to verify configuration
- Check logs in `logs/django.log` (if file logging enabled)

### API Usage
- Full API documentation in `api.md`
- Interactive docs at `/swagger/` and `/redoc/`
- Test API endpoints with provided examples

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass with `py manage.py test`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Quick Commands Reference

```bash
# 🚀 Complete setup in one command
quick_setup.bat

# 🧪 Test if everything works
py manage.py test_setup

# 🔄 Reset database completely
py manage.py reset_database --confirm

# 👤 Create superuser (email-based)
py manage.py createsuperuser

# 📝 Setup initial data (prompts, templates)
py manage.py setup_initial_data

# 🏃 Start development server
py manage.py runserver

# 🔄 Apply database changes
py manage.py makemigrations && py manage.py migrate

# 🧹 Drop all tables (DANGEROUS!)
py manage.py drop_all_tables --confirm

# 📊 Open database shell
py manage.py dbshell

# 🐍 Open Django shell
py manage.py shell

# ⚙️  Check configuration
py manage.py check

# 📋 List all commands
py manage.py help
```

### 🌐 **Important URLs**
```bash
# 📚 API Documentation
http://localhost:8000/swagger/          # Interactive docs
http://localhost:8000/redoc/            # Clean docs  
http://localhost:8000/admin/            # Admin panel

# 🔗 API Endpoints  
http://localhost:8000/api/auth/         # Authentication
http://localhost:8000/api/users/        # User management
http://localhost:8000/api/journals/     # Journaling
http://localhost:8000/api/chat/         # AI Chat

# 🔌 WebSocket Endpoints
ws://localhost:8000/ws/groups/{id}/     # Group chat
ws://localhost:8000/ws/peer-chat/{id}/  # Peer chat
```

### 🧪 **Quick API Tests**
```bash
# Login test
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sih.com", "password": "admin123"}'

# Create journal entry (replace TOKEN)
curl -X POST http://localhost:8000/api/journals/entries/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test entry", "mood_level": 4}'

# Start AI chat session
curl -X POST http://localhost:8000/api/chat/sessions/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"session_type": "ai_chat", "title": "Test Chat"}'
```

**Your production-ready mental health platform backend is ready!** 🚀🎯

---

### 📞 **Need Help?**

- 🐛 **Issues**: Create GitHub issue
- 📖 **API Docs**: `/swagger/` and `api.md`
- 🧪 **Test Setup**: `py manage.py test_setup`
- 🔧 **Reset Everything**: `py manage.py reset_database --confirm`