"""
Celery tasks for journal processing and AI analysis.
"""

from celery import shared_task
from django.conf import settings
from django.utils import timezone
import google.generativeai as genai
import numpy as np
import logging

logger = logging.getLogger(__name__)


@shared_task
def process_journal_entry(journal_id):
    """
    Process journal entry with AI analysis.
    """
    try:
        from .models import Journal
        
        journal = Journal.objects.get(id=journal_id)
        
        # Configure Gemini API
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
        
        # Combine text content
        text_content = journal.content
        if journal.voice_transcription:
            text_content += "\n" + journal.voice_transcription
        
        # Generate sentiment analysis
        sentiment_prompt = f"""
        Analyze the sentiment of this journal entry and provide a score between -1 (very negative) and 1 (very positive):
        
        Entry: {text_content}
        
        Respond with only a number between -1 and 1.
        """
        
        sentiment_response = model.generate_content(sentiment_prompt)
        try:
            sentiment_score = float(sentiment_response.text.strip())
            journal.sentiment_score = max(-1, min(1, sentiment_score))
        except ValueError:
            logger.warning(f"Could not parse sentiment score: {sentiment_response.text}")
            journal.sentiment_score = 0
        
        # Risk assessment
        risk_prompt = f"""
        Assess the mental health risk level of this journal entry. Consider mentions of:
        - Self-harm or suicidal thoughts
        - Severe depression or hopelessness
        - Substance abuse
        - Social isolation
        - Academic/work stress
        
        Entry: {text_content}
        Mood Level: {journal.mood_level}/5
        
        Respond with only one word: low, medium, high, or critical
        """
        
        risk_response = model.generate_content(risk_prompt)
        risk_level = risk_response.text.strip().lower()
        if risk_level in ['low', 'medium', 'high', 'critical']:
            journal.risk_level = risk_level
        
        # Generate insights and recommendations
        insights_prompt = f"""
        Provide helpful insights and recommendations for this journal entry. Format as JSON with these fields:
        - themes: array of main themes identified
        - recommendations: array of specific, actionable recommendations
        - resources: array of helpful resources or techniques
        - followup_questions: array of reflective questions for the user
        
        Entry: {text_content}
        Mood Level: {journal.mood_level}/5
        Emotions: {journal.emotions}
        
        Respond with valid JSON only.
        """
        
        insights_response = model.generate_content(insights_prompt)
        try:
            import json
            insights = json.loads(insights_response.text.strip())
            journal.ai_insights = insights
        except (json.JSONDecodeError, ValueError):
            logger.warning(f"Could not parse insights JSON: {insights_response.text}")
            journal.ai_insights = {
                'themes': [],
                'recommendations': ['Continue journaling to track your emotional patterns'],
                'resources': [],
                'followup_questions': []
            }
        
        # Generate keywords for search and similarity (replacing embeddings)
        keywords_prompt = f"""
        Extract 5-10 key words and phrases from this journal entry that would be useful for categorizing and finding similar content.
        Focus on emotions, activities, topics, and themes.
        
        Entry: {text_content}
        
        Respond with a JSON array of keywords: ["keyword1", "keyword2", ...]
        """
        
        keywords_response = model.generate_content(keywords_prompt)
        try:
            import json
            keywords = json.loads(keywords_response.text.strip())
            if isinstance(keywords, list):
                journal.content_keywords = keywords[:10]  # Limit to 10 keywords
        except (json.JSONDecodeError, ValueError):
            logger.warning(f"Could not parse keywords JSON: {keywords_response.text}")
            # Fallback: extract keywords from emotions and tags
            journal.content_keywords = list(set(journal.emotions + journal.tags))
        
        # Generate content summary
        summary_prompt = f"""
        Create a brief 1-2 sentence summary of this journal entry focusing on the main theme and emotional state.
        
        Entry: {text_content}
        
        Respond with only the summary text.
        """
        
        summary_response = model.generate_content(summary_prompt)
        journal.content_summary = summary_response.text.strip()[:500]  # Limit length
        
        journal.save()
        
        # Check if escalation is needed
        if journal.risk_level in ['high', 'critical']:
            escalate_to_counsellor.delay(journal_id)
        
        logger.info(f"Successfully processed journal entry {journal_id}")
        
    except Exception as e:
        logger.error(f"Error processing journal entry {journal_id}: {str(e)}")


@shared_task
def escalate_to_counsellor(journal_id):
    """
    Escalate high-risk journal entry to counsellor.
    """
    try:
        from .models import Journal
        from chat.models import ChatSession, ChatMessage
        from users.models import User
        
        journal = Journal.objects.get(id=journal_id)
        user = journal.user
        
        # Find available counsellors from the same institute
        counsellors = User.objects.filter(
            role=User.Role.COUNSELLOR,
            institute_name=user.institute_name,
            is_active=True,
            is_verified=True
        )
        
        if not counsellors.exists():
            logger.warning(f"No counsellors available for escalation of journal {journal_id}")
            return
        
        # Create escalation chat session
        counsellor = counsellors.first()  # TODO: Implement load balancing
        
        chat_session, created = ChatSession.objects.get_or_create(
            user=user,
            counsellor=counsellor,
            is_escalation=True,
            defaults={
                'session_type': 'escalation',
                'status': 'active'
            }
        )
        
        if created:
            # Create escalation message
            escalation_message = f"""
            ESCALATION ALERT: High-risk journal entry detected
            
            User: {user.full_name} ({user.email})
            Risk Level: {journal.risk_level.upper()}
            Mood Level: {journal.mood_level}/5
            Date: {journal.created_at.strftime('%Y-%m-%d %H:%M')}
            
            Entry Preview: {journal.content[:200]}...
            
            AI Assessment: {journal.ai_insights.get('recommendations', [])}
            
            Please reach out to the student as soon as possible.
            """
            
            ChatMessage.objects.create(
                session=chat_session,
                sender=None,  # System message
                content=escalation_message,
                message_type='escalation'
            )
            
            # TODO: Send notification to counsellor
            # send_counsellor_notification.delay(counsellor.id, chat_session.id)
        
        logger.info(f"Escalated journal {journal_id} to counsellor {counsellor.email}")
        
    except Exception as e:
        logger.error(f"Error escalating journal {journal_id}: {str(e)}")


@shared_task
def generate_journal_insights(user_id, days=7):
    """
    Generate comprehensive insights for user's recent journal entries.
    """
    try:
        from .models import Journal
        from users.models import User
        from datetime import timedelta
        
        user = User.objects.get(id=user_id)
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)
        
        journals = Journal.objects.filter(
            user=user,
            created_at__gte=start_date
        ).order_by('created_at')
        
        if not journals.exists():
            logger.info(f"No journal entries found for user {user_id} in the last {days} days")
            return
        
        # Compile all journal content
        all_content = []
        mood_levels = []
        emotions_used = []
        
        for journal in journals:
            content = journal.content
            if journal.voice_transcription:
                content += "\n" + journal.voice_transcription
            all_content.append(content)
            mood_levels.append(journal.mood_level)
            emotions_used.extend(journal.emotions)
        
        combined_content = "\n\n---\n\n".join(all_content)
        
        # Configure Gemini API
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
        
        # Generate comprehensive insights
        insights_prompt = f"""
        Analyze these journal entries from the past {days} days and provide comprehensive insights. 
        Format as JSON with these fields:
        
        - overall_pattern: summary of emotional patterns
        - mood_trend: description of mood progression
        - key_themes: array of recurring themes
        - strengths: array of positive patterns identified
        - areas_for_growth: array of areas that could be improved
        - recommendations: array of specific, actionable recommendations
        - coping_strategies: array of healthy coping strategies to try
        - warning_signs: array of concerning patterns if any
        - progress_indicators: array of signs of positive progress
        
        Journal Entries:
        {combined_content}
        
        Mood Levels: {mood_levels}
        Common Emotions: {list(set(emotions_used))}
        
        Respond with valid JSON only.
        """
        
        insights_response = model.generate_content(insights_prompt)
        
        try:
            import json
            insights = json.loads(insights_response.text.strip())
            
            # TODO: Store insights in database or send notification to user
            # For now, just log the insights
            logger.info(f"Generated insights for user {user_id}: {insights}")
            
        except (json.JSONDecodeError, ValueError):
            logger.warning(f"Could not parse comprehensive insights JSON: {insights_response.text}")
        
    except Exception as e:
        logger.error(f"Error generating insights for user {user_id}: {str(e)}")


@shared_task
def update_journal_analytics():
    """
    Update daily journal analytics for all users.
    """
    try:
        from .models import Journal, JournalAnalytics
        from users.models import User
        from django.db.models import Avg, Count
        from datetime import date
        
        today = date.today()
        
        # Get all users who have journal entries
        users_with_journals = User.objects.filter(
            journals__isnull=False
        ).distinct()
        
        for user in users_with_journals:
            # Get today's journals
            today_journals = Journal.objects.filter(
                user=user,
                created_at__date=today
            )
            
            if not today_journals.exists():
                continue
            
            # Calculate metrics
            entry_count = today_journals.count()
            total_words = sum(journal.word_count for journal in today_journals)
            average_mood = today_journals.aggregate(avg=Avg('mood_level'))['avg']
            
            # Count voice entries
            voice_entries = today_journals.filter(
                entry_type__in=['voice', 'mixed']
            ).count()
            
            # Get all emotions used today
            all_emotions = []
            for journal in today_journals:
                all_emotions.extend(journal.emotions)
            
            # Count emotions
            emotion_counts = {}
            for emotion in all_emotions:
                emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
            
            most_common = sorted(
                emotion_counts.items(),
                key=lambda x: x[1],
                reverse=True
            )[:5]
            
            # Risk tracking
            high_risk_today = today_journals.filter(
                risk_level__in=['high', 'critical']
            ).exists()
            
            # Update or create analytics record
            analytics, created = JournalAnalytics.objects.update_or_create(
                user=user,
                date=today,
                defaults={
                    'week_start': today - timedelta(days=today.weekday()),
                    'month_start': today.replace(day=1),
                    'entry_count': entry_count,
                    'total_words': total_words,
                    'average_mood': average_mood,
                    'voice_entries_count': voice_entries,
                    'tags_used': list(set(all_emotions)),
                    'most_common_emotions': [item[0] for item in most_common],
                    'high_risk_days': 1 if high_risk_today else 0,
                }
            )
            
        logger.info(f"Updated journal analytics for {users_with_journals.count()} users")
        
    except Exception as e:
        logger.error(f"Error updating journal analytics: {str(e)}")


@shared_task
def transcribe_voice_journal(journal_id):
    """
    Transcribe voice journal entry using AI.
    """
    try:
        from .models import Journal
        import speech_recognition as sr
        
        journal = Journal.objects.get(id=journal_id)
        
        if not journal.voice_file:
            logger.warning(f"No voice file found for journal {journal_id}")
            return
        
        # Initialize speech recognition
        r = sr.Recognizer()
        
        # Convert audio file to text
        with sr.AudioFile(journal.voice_file.path) as source:
            audio_data = r.record(source)
            try:
                transcription = r.recognize_google(audio_data)
                journal.voice_transcription = transcription
                journal.save()
                
                # Process the transcription with AI
                process_journal_entry.delay(journal_id)
                
                logger.info(f"Successfully transcribed journal {journal_id}")
                
            except sr.UnknownValueError:
                logger.warning(f"Could not understand audio in journal {journal_id}")
            except sr.RequestError as e:
                logger.error(f"Error transcribing journal {journal_id}: {str(e)}")
                
    except Exception as e:
        logger.error(f"Error transcribing voice journal {journal_id}: {str(e)}")


@shared_task
def send_journal_reminders():
    """
    Send daily journal reminders to users.
    """
    try:
        from .models import JournalReminder
        from datetime import datetime
        
        now = datetime.now()
        current_time = now.time()
        current_weekday = now.weekday()
        
        # Get active reminders for current time and day
        reminders = JournalReminder.objects.filter(
            is_active=True,
            reminder_time__hour=current_time.hour,
            reminder_time__minute=current_time.minute,
            days_of_week__contains=[current_weekday]
        )
        
        for reminder in reminders:
            # Check if reminder was already sent today
            if (reminder.last_sent and 
                reminder.last_sent.date() == now.date()):
                continue
            
            # TODO: Send notification (email, push, etc.)
            # send_notification.delay(reminder.user.id, reminder.message)
            
            # Update reminder tracking
            reminder.last_sent = now
            reminder.total_sent += 1
            reminder.save()
        
        logger.info(f"Sent {reminders.count()} journal reminders")
        
    except Exception as e:
        logger.error(f"Error sending journal reminders: {str(e)}")