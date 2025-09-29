"""
Celery tasks for chat processing and AI responses.
"""

from celery import shared_task
from django.conf import settings
import google.generativeai as genai
import logging

logger = logging.getLogger(__name__)


@shared_task
def generate_ai_response(session_id, user_message_id):
    """Generate AI response for chat message."""
    try:
        from .models import ChatSession, ChatMessage
        
        session = ChatSession.objects.get(id=session_id)
        user_message = ChatMessage.objects.get(id=user_message_id)
        
        # Configure Gemini API
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(session.ai_model or 'gemini-pro')
        
        # Build conversation context
        recent_messages = ChatMessage.objects.filter(
            session=session
        ).order_by('created_at')[-10:]  # Last 10 messages
        
        conversation_history = []
        for msg in recent_messages:
            role = "user" if msg.message_type == ChatMessage.MessageType.USER else "model"
            conversation_history.append({
                "role": role,
                "parts": [msg.content]
            })
        
        # Add journal context if available
        context_prompt = ""
        if session.context_entries:
            context_prompt = "\n\nRecent journal context:\n"
            for entry in session.context_entries[:3]:  # Use last 3 entries
                context_prompt += f"- Mood: {entry['mood_level']}/5, Content: {entry['content'][:200]}...\n"
        
        # Create chat session with system prompt
        chat = model.start_chat(history=conversation_history[:-1])  # Exclude last user message
        
        # Generate response with system prompt
        full_prompt = f"{session.system_prompt}\n{context_prompt}\n\nUser message: {user_message.content}"
        
        response = chat.send_message(full_prompt)
        
        # Create AI response message
        ai_message = ChatMessage.objects.create(
            session=session,
            sender=None,  # AI message
            content=response.text,
            message_type=ChatMessage.MessageType.AI,
            tokens_used=response.usage_metadata.total_token_count if hasattr(response, 'usage_metadata') else 0
        )
        
        # Update session
        session.message_count += 1
        session.total_tokens += ai_message.tokens_used
        session.save()
        
        # Process AI message for risk assessment
        process_chat_message.delay(ai_message.id)
        
        logger.info(f"Generated AI response for session {session_id}")
        
    except Exception as e:
        logger.error(f"Error generating AI response for session {session_id}: {str(e)}")


@shared_task
def process_chat_message(message_id):
    """Process chat message for risk assessment."""
    try:
        from .models import ChatMessage
        
        message = ChatMessage.objects.get(id=message_id)
        
        # Skip processing AI messages
        if message.message_type == ChatMessage.MessageType.AI:
            return
        
        # Configure Gemini API
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
        
        # Risk assessment
        risk_prompt = f"""
        Assess the mental health risk level of this chat message. Look for:
        - Suicidal ideation or self-harm mentions
        - Severe depression or hopelessness
        - Crisis situations
        - Substance abuse
        - Immediate danger
        
        Message: {message.content}
        
        Respond with only one word: low, medium, high, or critical
        """
        
        risk_response = model.generate_content(risk_prompt)
        risk_level = risk_response.text.strip().lower()
        
        if risk_level in ['low', 'medium', 'high', 'critical']:
            message.risk_level = risk_level
            
            # Flag for escalation if high risk
            if risk_level in ['high', 'critical']:
                message.requires_escalation = True
                
                # Auto-escalate critical messages
                if risk_level == 'critical':
                    escalate_chat_session.delay(message.session.id, 'Critical risk detected in message')
        
        # Generate keywords for the message (replacing embeddings)
        if message.message_type == ChatMessage.MessageType.USER:
            keywords_prompt = f"""
            Extract 3-5 key words from this chat message that represent the main topics or concerns.
            
            Message: {message.content}
            
            Respond with a JSON array: ["keyword1", "keyword2", ...]
            """
            
            try:
                keywords_response = model.generate_content(keywords_prompt)
                import json
                keywords = json.loads(keywords_response.text.strip())
                if isinstance(keywords, list):
                    message.message_keywords = keywords[:5]
            except Exception as e:
                logger.warning(f"Could not generate keywords for message {message_id}: {str(e)}")
                message.message_keywords = []
        
        # Generate sentiment analysis for user messages
        if message.message_type == ChatMessage.MessageType.USER:
            sentiment_prompt = f"""
            Analyze the sentiment and emotions in this message. Respond with JSON:
            {{
                "sentiment_score": -1 to 1,
                "primary_emotion": "emotion name",
                "emotions": ["list", "of", "emotions"],
                "intensity": 1 to 5
            }}
            
            Message: {message.content}
            """
            
            try:
                sentiment_response = model.generate_content(sentiment_prompt)
                import json
                sentiment = json.loads(sentiment_response.text.strip())
                message.message_sentiment = sentiment
            except Exception as e:
                logger.warning(f"Could not analyze sentiment for message {message_id}: {str(e)}")
                message.message_sentiment = {}
        
        message.save()
        
        logger.info(f"Processed chat message {message_id}, risk level: {message.risk_level}")
        
    except Exception as e:
        logger.error(f"Error processing chat message {message_id}: {str(e)}")


@shared_task
def escalate_chat_session(session_id, reason):
    """Escalate chat session to counsellor."""
    try:
        from .models import ChatSession, ChatMessage
        from users.models import User
        
        session = ChatSession.objects.get(id=session_id)
        user = session.user
        
        # Find available counsellors
        counsellors = User.objects.filter(
            role=User.Role.COUNSELLOR,
            institute_name=user.institute_name,
            is_active=True,
            is_verified=True
        )
        
        if not counsellors.exists():
            logger.warning(f"No counsellors available for session {session_id}")
            return
        
        # Assign counsellor (simple round-robin for now)
        counsellor = counsellors.first()
        
        # Update session
        session.status = ChatSession.Status.ESCALATED
        session.is_escalation = True
        session.escalation_reason = reason
        session.counsellor = counsellor
        session.priority = 'urgent'
        session.save()
        
        # Create escalation message
        escalation_message = f"""
        ESCALATION ALERT: Chat session requires immediate attention
        
        Student: {user.full_name} ({user.email})
        Session ID: {session.id}
        Escalation Reason: {reason}
        Priority: URGENT
        
        Please review the conversation history and reach out to the student immediately.
        """
        
        ChatMessage.objects.create(
            session=session,
            sender=None,  # System message
            content=escalation_message,
            message_type=ChatMessage.MessageType.ESCALATION
        )
        
        # TODO: Send notification to counsellor
        
        logger.info(f"Escalated chat session {session_id} to counsellor {counsellor.email}")
        
    except Exception as e:
        logger.error(f"Error escalating chat session {session_id}: {str(e)}")


@shared_task
def update_chat_analytics():
    """Update daily chat analytics."""
    try:
        from .models import ChatSession, ChatMessage, ChatAnalytics
        from django.db.models import Avg, Count
        from datetime import date
        
        today = date.today()
        
        # Session metrics
        total_sessions = ChatSession.objects.filter(started_at__date=today).count()
        ai_sessions = ChatSession.objects.filter(
            started_at__date=today,
            session_type='ai_chat'
        ).count()
        counsellor_sessions = ChatSession.objects.filter(
            started_at__date=today,
            session_type='counsellor'
        ).count()
        escalated_sessions = ChatSession.objects.filter(
            started_at__date=today,
            is_escalation=True
        ).count()
        
        # Message metrics
        total_messages = ChatMessage.objects.filter(created_at__date=today).count()
        
        # Risk metrics
        high_risk_sessions = ChatSession.objects.filter(
            started_at__date=today,
            messages__risk_level__in=['high', 'critical']
        ).distinct().count()
        
        # User satisfaction
        avg_rating = ChatSession.objects.filter(
            started_at__date=today,
            session_rating__isnull=False
        ).aggregate(avg=Avg('session_rating'))['avg']
        
        # Update or create analytics
        analytics, created = ChatAnalytics.objects.update_or_create(
            date=today,
            defaults={
                'total_sessions': total_sessions,
                'ai_sessions': ai_sessions,
                'counsellor_sessions': counsellor_sessions,
                'escalated_sessions': escalated_sessions,
                'total_messages': total_messages,
                'high_risk_sessions': high_risk_sessions,
                'average_rating': avg_rating,
            }
        )
        
        logger.info(f"Updated chat analytics for {today}")
        
    except Exception as e:
        logger.error(f"Error updating chat analytics: {str(e)}")


@shared_task
def cleanup_old_sessions():
    """Clean up old completed chat sessions."""
    try:
        from .models import ChatSession
        from datetime import timedelta
        from django.utils import timezone
        
        # Delete sessions older than 90 days that are completed
        cutoff_date = timezone.now() - timedelta(days=90)
        
        old_sessions = ChatSession.objects.filter(
            status='completed',
            ended_at__lt=cutoff_date
        )
        
        count = old_sessions.count()
        old_sessions.delete()
        
        logger.info(f"Cleaned up {count} old chat sessions")
        
    except Exception as e:
        logger.error(f"Error cleaning up old sessions: {str(e)}")


@shared_task
def generate_session_insights(session_id):
    """Generate insights for completed chat session."""
    try:
        from .models import ChatSession, ChatMessage
        
        session = ChatSession.objects.get(id=session_id)
        
        if session.status != 'completed':
            return
        
        # Get all messages in session
        messages = ChatMessage.objects.filter(session=session).order_by('created_at')
        user_messages = messages.filter(message_type='user')
        
        if not user_messages.exists():
            return
        
        # Combine all user messages
        combined_content = '\n'.join([msg.content for msg in user_messages])
        
        # Configure Gemini API
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
        
        # Generate insights
        insights_prompt = f"""
        Analyze this chat session and provide insights in JSON format:
        {{
            "main_concerns": ["list of main concerns discussed"],
            "emotional_state": "overall emotional state assessment",
            "progress_indicators": ["positive signs observed"],
            "recommendations": ["recommendations for follow-up"],
            "risk_factors": ["any ongoing risk factors"],
            "session_quality": "assessment of session effectiveness"
        }}
        
        Chat content:
        {combined_content}
        
        Respond with valid JSON only.
        """
        
        insights_response = model.generate_content(insights_prompt)
        
        try:
            import json
            insights = json.loads(insights_response.text.strip())
            
            # TODO: Store insights in database or send to user
            logger.info(f"Generated insights for session {session_id}")
            
        except json.JSONDecodeError:
            logger.warning(f"Could not parse insights JSON for session {session_id}")
        
    except Exception as e:
        logger.error(f"Error generating insights for session {session_id}: {str(e)}")