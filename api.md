# SIH Backend API Documentation

This document provides comprehensive API documentation for the Student Mental Health Platform backend.

## Base URL
```
http://localhost:8000/api/
```

## Authentication

All API endpoints (except registration and login) require JWT authentication.

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### JWT Token Lifecycle
- **Access Token**: 60 minutes lifetime
- **Refresh Token**: 7 days lifetime (stored in HttpOnly cookie)
- **Auto-rotation**: Refresh tokens are rotated on each use

---

## Authentication Endpoints

### POST /api/auth/login/
Login with email and password.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": "student"
    }
}
```

### POST /api/auth/registration/
Register new user account.

**Request Body:**
```json
{
    "email": "newuser@example.com",
    "password1": "securepassword123",
    "password2": "securepassword123",
    "first_name": "Jane",
    "last_name": "Smith",
    "role": "student",
    "institute_name": "University of Example",
    "student_id": "STU001"
}
```

**Response (201):**
```json
{
    "detail": "Verification e-mail sent."
}
```

### POST /api/auth/token/refresh/
Refresh access token using refresh token.

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### POST /api/auth/logout/
Logout and blacklist refresh token.

**Auth Required:** Yes  
**Response (200):**
```json
{
    "detail": "Successfully logged out."
}
```

### GET /api/auth/user/
Get current user information.

**Auth Required:** Yes  
**Response (200):**
```json
{
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "role": "student",
    "phone_number": "+1234567890",
    "date_of_birth": "1995-05-15",
    "profile_picture": "http://localhost:8000/media/profile_pics/user1.jpg",
    "institute_name": "University of Example",
    "student_id": "STU001",
    "is_profile_public": false,
    "is_verified": true,
    "last_active": "2024-01-15T10:30:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "profile": {
        "course": "Computer Science",
        "year_of_study": 3,
        "graduation_year": 2025,
        "preferred_language": "en",
        "timezone": "UTC",
        "email_notifications": true,
        "push_notifications": true
    }
}
```

---

## User Management

### GET /api/users/
List users (filtered by permissions).

**Auth Required:** Yes  
**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Results per page (default: 20)

**Response (200):**
```json
{
    "count": 50,
    "next": "http://localhost:8000/api/users/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "full_name": "John Doe",
            "role": "student",
            "profile_picture": null,
            "institute_name": "University of Example"
        }
    ]
}
```

### GET /api/users/me/
Get current user detailed information.

**Auth Required:** Yes  
**Response (200):** Same as GET /api/auth/user/

### PUT /api/users/update-profile/
Update current user profile.

**Auth Required:** Yes  
**Request Body:**
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "course": "Computer Science",
    "year_of_study": 3,
    "email_notifications": true,
    "emergency_contact_name": "Jane Doe",
    "emergency_contact_phone": "+1234567891"
}
```

### POST /api/users/change-password/
Change user password.

**Auth Required:** Yes  
**Request Body:**
```json
{
    "old_password": "currentpassword",
    "new_password": "newpassword123",
    "confirm_password": "newpassword123"
}
```

### GET /api/users/counsellors/
Get list of available counsellors.

**Auth Required:** Yes  
**Response (200):**
```json
[
    {
        "id": 5,
        "first_name": "Dr. Sarah",
        "last_name": "Johnson",
        "full_name": "Dr. Sarah Johnson",
        "role": "counsellor",
        "profile_picture": "http://localhost:8000/media/profile_pics/counsellor1.jpg",
        "institute_name": "University of Example"
    }
]
```

### GET /api/users/search/
Search users by name or email.

**Auth Required:** Yes  
**Query Parameters:**
- `q`: Search query (required)
- `role`: Filter by role (optional)

**Response (200):**
```json
{
    "users": [
        {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "full_name": "John Doe",
            "role": "student",
            "profile_picture": null,
            "institute_name": "University of Example"
        }
    ]
}
```

---

## Journal Entries

### GET /api/journals/entries/
List user's journal entries.

**Auth Required:** Yes  
**Roles Allowed:** All authenticated users  
**Query Parameters:**
- `page`: Page number
- `page_size`: Results per page

**Response (200):**
```json
{
    "count": 25,
    "next": "http://localhost:8000/api/journals/entries/?page=2",
    "previous": null,
    "results": [
        {
            "id": "uuid-here",
            "title": "Today's Reflection",
            "mood_level": 4,
            "mood_display_color": "#32CD32",
            "risk_level": "low",
            "word_count": 150,
            "created_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

### POST /api/journals/entries/
Create new journal entry.

**Auth Required:** Yes  
**Request Body:**
```json
{
    "title": "Today's Reflection",
    "content": "Today was a good day. I felt more motivated and focused during my studies.",
    "entry_type": "text",
    "mood_level": 4,
    "emotions": ["happy", "motivated", "peaceful"],
    "tags": ["study", "motivation"],
    "weather": "sunny",
    "location": "library",
    "is_private": true,
    "shared_with_counsellor": false
}
```

**Response (201):**
```json
{
    "id": "uuid-here",
    "user": "user@example.com",
    "title": "Today's Reflection",
    "content": "Today was a good day. I felt more motivated and focused during my studies.",
    "entry_type": "text",
    "voice_file": null,
    "voice_transcription": "",
    "mood_level": 4,
    "emotions": ["happy", "motivated", "peaceful"],
    "tags": ["study", "motivation"],
    "weather": "sunny",
    "location": "library",
    "sentiment_score": 0.7,
    "risk_level": "low",
    "ai_insights": {
        "themes": ["academic success", "positive mood"],
        "recommendations": ["Continue current study routine", "Maintain positive mindset"],
        "resources": ["Mindfulness techniques"],
        "followup_questions": ["What specific study methods helped you today?"]
    },
    "content_keywords": ["motivated", "focused", "studies", "good day"],
    "content_summary": "Student feeling motivated and focused during studies, experiencing a positive day.",
    "is_private": true,
    "shared_with_counsellor": false,
    "word_count": 15,
    "mood_display_color": "#32CD32",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
}
```

### GET /api/journals/entries/{id}/
Get specific journal entry.

**Auth Required:** Yes  
**Permissions:** Owner only  

### PUT /api/journals/entries/{id}/
Update journal entry.

**Auth Required:** Yes  
**Permissions:** Owner only  

### DELETE /api/journals/entries/{id}/
Delete journal entry.

**Auth Required:** Yes  
**Permissions:** Owner only  

### GET /api/journals/entries/stats/
Get journal statistics for current user.

**Auth Required:** Yes  
**Response (200):**
```json
{
    "total_entries": 25,
    "this_month_entries": 8,
    "this_week_entries": 3,
    "average_mood": 3.4,
    "mood_trend": "improving",
    "longest_streak": 15,
    "current_streak": 5,
    "most_used_emotions": ["happy", "stressed", "tired", "motivated", "anxious"],
    "risk_alerts": 2,
    "total_words": 3750
}
```

### GET /api/journals/entries/mood-trend/
Get mood trend data for charts.

**Auth Required:** Yes  
**Query Parameters:**
- `days`: Number of days (default: 30)

**Response (200):**
```json
[
    {
        "date": "2024-01-01",
        "mood_level": 3.5,
        "entry_count": 2
    },
    {
        "date": "2024-01-02",
        "mood_level": 4.0,
        "entry_count": 1
    }
]
```

### POST /api/journals/entries/search/
Search journal entries with advanced filters.

**Auth Required:** Yes  
**Request Body:**
```json
{
    "query": "study stress",
    "mood_level": 3,
    "tags": ["academic"],
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "risk_level": "medium",
    "entry_type": "text"
}
```

### GET /api/journals/entries/search-similar/{id}/
Get similar journal entries based on keywords and mood.

**Auth Required:** Yes  
**Permissions:** Owner only  
**Response (200):**
```json
{
    "similar_entries": [
        {
            "id": "uuid-here",
            "title": "Similar Reflection", 
            "mood_level": 4,
            "content_keywords": ["motivated", "study", "focused"],
            "created_at": "2024-01-14T10:30:00Z",
            "similarity_score": 0.85
        }
    ],
    "similarity_basis": {
        "mood_match": true,
        "keyword_overlap": ["motivated", "focused"],
        "theme_similarity": ["academic_success"]
    }
}
```

### GET /api/journals/prompts/
Get available journal prompts.

**Auth Required:** Yes  
**Response (200):**
```json
[
    {
        "id": 1,
        "title": "Daily Gratitude",
        "prompt_text": "What are three things you're grateful for today?",
        "category": "gratitude",
        "target_mood_levels": [1, 2, 3],
        "usage_count": 150
    }
]
```

### GET /api/journals/prompts/random/
Get random journal prompts based on recent mood.

**Auth Required:** Yes  
**Response (200):**
```json
[
    {
        "id": 1,
        "title": "Stress Management",
        "prompt_text": "Describe a situation that caused you stress today and how you handled it.",
        "category": "stress",
        "target_mood_levels": [2, 3],
        "usage_count": 89
    }
]
```

### GET /api/journals/emotion-frequency/
Get emotion frequency data.

**Auth Required:** Yes  
**Query Parameters:**
- `days`: Number of days (default: 30)

**Response (200):**
```json
[
    {
        "emotion": "happy",
        "count": 15,
        "percentage": 25.0
    },
    {
        "emotion": "stressed",
        "count": 12,
        "percentage": 20.0
    }
]
```

### GET /api/journals/counsellor/shared/
Get journals shared with counsellors (counsellor/admin only).

**Auth Required:** Yes  
**Roles Allowed:** counsellor, institute_admin, superadmin  

---

## AI Chat Sessions

### GET /api/chat/sessions/
List user's chat sessions.

**Auth Required:** Yes  
**Response (200):**
```json
{
    "count": 10,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": "uuid-here",
            "user": {
                "id": 1,
                "first_name": "John",
                "last_name": "Doe",
                "full_name": "John Doe",
                "role": "student"
            },
            "counsellor": null,
            "session_type": "ai_chat",
            "status": "active",
            "title": "Anxiety Support Session",
            "ai_model": "gemini-pro",
            "is_escalation": false,
            "priority": "low",
            "message_count": 8,
            "total_tokens": 1250,
            "session_rating": null,
            "duration": null,
            "started_at": "2024-01-15T10:00:00Z",
            "last_message_at": "2024-01-15T10:30:00Z",
            "ended_at": null
        }
    ]
}
```

### POST /api/chat/sessions/
Create new chat session.

**Auth Required:** Yes  
**Request Body:**
```json
{
    "session_type": "ai_chat",
    "title": "Stress Management Help"
}
```

**Response (201):**
```json
{
    "id": "uuid-here",
    "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe",
        "role": "student"
    },
    "counsellor": null,
    "session_type": "ai_chat",
    "status": "active",
    "title": "Stress Management Help",
    "ai_model": "gemini-pro",
    "is_escalation": false,
    "priority": "low",
    "message_count": 0,
    "total_tokens": 0,
    "session_rating": null,
    "duration": null,
    "started_at": "2024-01-15T11:00:00Z",
    "last_message_at": "2024-01-15T11:00:00Z",
    "ended_at": null
}
```

### GET /api/chat/sessions/{id}/
Get chat session with full message history.

**Auth Required:** Yes  
**Permissions:** Owner or assigned counsellor  
**Response (200):**
```json
{
    "id": "uuid-here",
    "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe",
        "role": "student"
    },
    "counsellor": null,
    "session_type": "ai_chat",
    "status": "active",
    "title": "Stress Management Help",
    "ai_model": "gemini-pro",
    "system_prompt": "You are a supportive AI mental health assistant...",
    "context_entries": [
        {
            "id": "journal-uuid",
            "content": "Today I felt overwhelmed with assignments...",
            "mood_level": 2,
            "emotions": ["stressed", "overwhelmed"],
            "date": "2024-01-14T00:00:00Z"
        }
    ],
    "is_escalation": false,
    "priority": "low",
    "message_count": 4,
    "total_tokens": 850,
    "session_rating": null,
    "started_at": "2024-01-15T11:00:00Z",
    "last_message_at": "2024-01-15T11:15:00Z",
    "ended_at": null,
    "messages": [
        {
            "id": "msg-uuid-1",
            "sender": {
                "id": 1,
                "first_name": "John",
                "last_name": "Doe",
                "full_name": "John Doe",
                "role": "student"
            },
            "content": "I've been feeling really stressed about my upcoming exams.",
            "message_type": "user",
            "tokens_used": 0,
            "response_time": null,
            "risk_level": "medium",
            "requires_escalation": false,
            "is_edited": false,
            "is_deleted": false,
            "created_at": "2024-01-15T11:05:00Z",
            "updated_at": "2024-01-15T11:05:00Z"
        },
        {
            "id": "msg-uuid-2",
            "sender": null,
            "content": "I understand that exam stress can feel overwhelming. It's completely normal to feel this way. Let's work together to find some strategies that can help you manage this stress. Can you tell me more about what specifically is making you feel most anxious about the exams?",
            "message_type": "ai",
            "tokens_used": 425,
            "response_time": 2.3,
            "risk_level": "low",
            "requires_escalation": false,
            "is_edited": false,
            "is_deleted": false,
            "message_keywords": ["anxiety", "exam", "stress"],
            "message_sentiment": {
                "sentiment_score": -0.3,
                "primary_emotion": "worried", 
                "emotions": ["anxious", "overwhelmed"],
                "intensity": 3
            },
            "created_at": "2024-01-15T11:05:30Z",
            "updated_at": "2024-01-15T11:05:30Z"
        }
    ]
}
```

### POST /api/chat/sessions/{id}/send-message/
Send message in chat session.

**Auth Required:** Yes  
**Permissions:** Owner or assigned counsellor  
**Request Body:**
```json
{
    "content": "I'm worried I won't have enough time to study for all subjects."
}
```

**Response (200):**
```json
{
    "id": "msg-uuid-3",
    "sender": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe",
        "role": "student"
    },
    "content": "I'm worried I won't have enough time to study for all subjects.",
    "message_type": "user",
    "tokens_used": 0,
    "response_time": null,
    "risk_level": "low",
    "requires_escalation": false,
    "is_edited": false,
    "is_deleted": false,
    "created_at": "2024-01-15T11:10:00Z",
    "updated_at": "2024-01-15T11:10:00Z"
}
```

**Note:** AI response will be generated automatically and sent as a separate message.

### POST /api/chat/sessions/{id}/end-session/
End chat session.

**Auth Required:** Yes  
**Permissions:** Owner or assigned counsellor  
**Response (200):**
```json
{
    "message": "Session ended successfully"
}
```

### POST /api/chat/sessions/{id}/escalate/
Escalate session to counsellor.

**Auth Required:** Yes  
**Permissions:** Owner  
**Request Body:**
```json
{
    "reason": "User requested human counsellor support"
}
```

**Response (200):**
```json
{
    "message": "Session escalated to counsellor"
}
```

### POST /api/chat/sessions/{id}/submit-feedback/
Submit feedback for completed session.

**Auth Required:** Yes  
**Permissions:** Owner  
**Request Body:**
```json
{
    "overall_rating": 4,
    "helpfulness_rating": 5,
    "ai_quality_rating": 4,
    "positive_feedback": "The AI was very understanding and provided helpful coping strategies.",
    "improvement_suggestions": "Could provide more specific study planning techniques.",
    "would_recommend": true,
    "would_use_again": true
}
```

**Response (200):**
```json
{
    "overall_rating": 4,
    "helpfulness_rating": 5,
    "ai_quality_rating": 4,
    "positive_feedback": "The AI was very understanding and provided helpful coping strategies.",
    "improvement_suggestions": "Could provide more specific study planning techniques.",
    "would_recommend": true,
    "would_use_again": true,
    "created_at": "2024-01-15T12:00:00Z"
}
```

### GET /api/chat/stats/
Get chat statistics for current user.

**Auth Required:** Yes  
**Response (200):**
```json
{
    "total_sessions": 15,
    "active_sessions": 2,
    "completed_sessions": 12,
    "escalated_sessions": 1,
    "average_rating": 4.2,
    "total_messages": 180,
    "average_session_duration": 25.5,
    "high_risk_count": 3
}
```

### GET /api/chat/counsellor/queue/
Get escalated sessions queue (counsellor/admin only).

**Auth Required:** Yes  
**Roles Allowed:** counsellor, institute_admin, superadmin  
**Response (200):**
```json
[
    {
        "id": "uuid-here",
        "user": {
            "id": 2,
            "first_name": "Jane",
            "last_name": "Smith",
            "full_name": "Jane Smith",
            "role": "student"
        },
        "session_type": "escalation",
        "status": "escalated",
        "title": "Crisis Support Needed",
        "is_escalation": true,
        "escalation_reason": "High risk detected in conversation",
        "priority": "urgent",
        "message_count": 12,
        "started_at": "2024-01-15T09:30:00Z",
        "last_message_at": "2024-01-15T10:45:00Z"
    }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
    "error": "Invalid request data",
    "details": {
        "field_name": ["This field is required."]
    }
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

### 429 Too Many Requests
```json
{
    "detail": "Request was throttled. Expected available in 3600 seconds."
}
```

### 500 Internal Server Error
```json
{
    "error": "Internal server error",
    "message": "An unexpected error occurred. Please try again later."
}
```

---

## Rate Limiting

- **Anonymous users**: 100 requests/hour
- **Authenticated users**: 1000 requests/hour
- **Chat API**: Additional limits apply for AI generation

---

## WebSocket Endpoints

### Group Chat
**URL:** `ws://localhost:8000/ws/groups/{group_id}/`  
**Auth Required:** Yes

**Message Format:**
```json
{
    "message": "Hello everyone!",
    "message_type": "text"
}
```

### Peer Chat
**URL:** `ws://localhost:8000/ws/peer-chat/{user_id}/`  
**Auth Required:** Yes

**Message Format:**
```json
{
    "message": "Hi there!",
    "recipient_id": "target-user-id",
    "message_type": "text"
}
```

---

## Notes

### AI Features
- **Risk Detection**: All journal entries and chat messages are automatically analyzed for mental health risk
- **Escalation**: High-risk content triggers automatic escalation to counsellors
- **Context**: AI chat uses recent journal entries for better contextual responses
- **Embeddings**: Content is vectorized for similarity search and recommendations

### Privacy & Security
- **Data Encryption**: All sensitive data is encrypted at rest and in transit
- **Role-based Access**: Users can only access data appropriate to their role
- **Audit Logging**: All actions are logged for security and analytics
- **GDPR Compliant**: Users can request data export and deletion

### Background Processing
- **Celery Tasks**: AI processing, analytics, and notifications run asynchronously
- **Redis**: Used for caching, session storage, and task queuing
- **Monitoring**: All background tasks include error handling and logging

This API provides a comprehensive foundation for building mental health support applications with AI integration, real-time communication, and robust user management.

---

## AI Features & Implementation

### AI Integration Overview

The SIH Backend uses **keyword-based intelligence** instead of complex vector embeddings, making setup easier while maintaining full AI functionality.

#### What Works (Everything Important!)
- ✅ **Gemini API Integration** - Chat responses, sentiment analysis, risk assessment
- ✅ **Smart Content Analysis** - Keyword extraction, theme detection
- ✅ **Similar Content Discovery** - Using keywords and mood matching
- ✅ **Risk Detection & Escalation** - Full safety features
- ✅ **Background AI Processing** - Celery tasks for analysis
- ✅ **JSON-based Analytics** - Rich data aggregation

### How AI Features Work Now

#### Journal Analysis
When a journal entry is created, the AI:
```python
# Extract keywords for search and categorization
content_keywords = ["stress", "exams", "anxiety", "study"]

# Generate content summary
content_summary = "Student feeling overwhelmed about upcoming exams"

# AI insights with themes and recommendations
ai_insights = {
    "themes": ["academic_stress", "time_management"],
    "recommendations": ["Break study into smaller chunks", "Practice relaxation"],
    "resources": ["Study planning tools", "Stress management techniques"],
    "risk_level": "medium"
}
```

#### Chat Intelligence
Chat sessions track themes and sentiment:
```python
# Session-level analysis
session_keywords = ["anxiety", "academic", "pressure"]
session_themes = ["stress_management", "coping_strategies"]

# Message-level sentiment
message_sentiment = {
    "sentiment_score": -0.3,  # -1 to 1 scale
    "primary_emotion": "worried",
    "emotions": ["anxious", "overwhelmed"],
    "intensity": 4  # 1-5 scale
}
```

#### Content Similarity
Find related content using:
```python
# Find similar journals using mood + keywords
similar_entries = Journal.objects.filter(
    mood_level__range=[current_mood-1, current_mood+1],  # ±1 mood level
    content_keywords__overlap=current_keywords  # Overlapping keywords
).order_by('-created_at')[:5]

# PostgreSQL JSON query example
SELECT * FROM journals_journal 
WHERE content_keywords @> '["stress", "exam"]'  -- Contains keywords
  AND mood_level BETWEEN 2 AND 4;              -- Similar mood
```

### Background AI Processing

All AI analysis happens asynchronously via Celery:

#### Journal Processing (`journals.tasks.process_journal_entry`)
1. **Sentiment Analysis** - Gemini API analyzes emotional tone
2. **Risk Assessment** - Detects concerning content
3. **Keyword Extraction** - AI extracts 5-10 relevant keywords  
4. **Content Summary** - Brief AI-generated summary
5. **Escalation** - Auto-escalate high-risk entries

#### Chat Processing (`chat.tasks.process_chat_message`)
1. **Risk Detection** - Real-time analysis of messages
2. **Keyword Extraction** - Extract main topics/concerns
3. **Sentiment Analysis** - Emotional state assessment
4. **Context Building** - Integration with journal history
5. **AI Response Generation** - Contextual Gemini responses

### Benefits of This Approach

| Feature | Vector Embeddings | Keyword-based | Winner |
|---------|------------------|---------------|---------|
| Setup Complexity | High (pgvector) | Low (standard PG) | ✅ Keywords |
| AI Integration | ✅ Full | ✅ Full | ✅ Tie |
| Content Similarity | Very High | High | Vectors |
| Performance | Good | ✅ Excellent | ✅ Keywords |
| Interpretability | Low | ✅ High | ✅ Keywords |
| Maintenance | Complex | ✅ Simple | ✅ Keywords |
| Development Speed | Slow | ✅ Fast | ✅ Keywords |
| Production Ready | ✅ Yes | ✅ Yes | ✅ Tie |

**Result:** Keyword-based approach provides **90% of the functionality** with **10% of the complexity**!