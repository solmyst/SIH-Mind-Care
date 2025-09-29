"""
Chat models for AI conversations and counsellor sessions.
"""

from django.db import models
from django.conf import settings
import uuid


class ChatSession(models.Model):
    """
    Chat session with AI or counsellor.
    """
    
    class SessionType(models.TextChoices):
        AI_CHAT = 'ai_chat', 'AI Chat'
        COUNSELLOR = 'counsellor', 'Counsellor Session'
        ESCALATION = 'escalation', 'Escalated Session'
        GROUP = 'group', 'Group Session'
    
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        PAUSED = 'paused', 'Paused'
        COMPLETED = 'completed', 'Completed'
        ESCALATED = 'escalated', 'Escalated'
        CLOSED = 'closed', 'Closed'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_sessions'
    )
    counsellor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='counsellor_sessions',
        limit_choices_to={'role': 'counsellor'}
    )
    
    # Session details
    session_type = models.CharField(
        max_length=20,
        choices=SessionType.choices,
        default=SessionType.AI_CHAT
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    title = models.CharField(max_length=200, blank=True)
    
    # AI Configuration
    ai_model = models.CharField(max_length=50, default='gemini-pro')
    system_prompt = models.TextField(blank=True)
    context_entries = models.JSONField(
        default=list,
        blank=True,
        help_text="Journal entries used for context"
    )
    
    # Session metadata
    is_escalation = models.BooleanField(default=False)
    escalation_reason = models.TextField(blank=True)
    priority = models.CharField(
        max_length=10,
        choices=[
            ('low', 'Low'),
            ('medium', 'Medium'),
            ('high', 'High'),
            ('urgent', 'Urgent')
        ],
        default='low'
    )
    
    # Analytics
    message_count = models.PositiveIntegerField(default=0)
    total_tokens = models.PositiveIntegerField(default=0)
    session_rating = models.IntegerField(
        null=True,
        blank=True,
        help_text="User rating from 1-5"
    )
    
    # Content analysis (replacing embeddings)
    session_keywords = models.JSONField(
        default=list,
        blank=True,
        help_text="Keywords extracted from session content"
    )
    session_themes = models.JSONField(
        default=list,
        blank=True,
        help_text="Main themes discussed in session"
    )
    
    # Timestamps
    started_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'chat_session'
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['user', '-started_at']),
            models.Index(fields=['counsellor', 'status']),
            models.Index(fields=['session_type', 'status']),
            models.Index(fields=['is_escalation', 'priority']),
        ]
    
    def __str__(self):
        return f"Chat Session {self.id} - {self.user.email}"
    
    @property
    def duration(self):
        """Calculate session duration."""
        if self.ended_at:
            return self.ended_at - self.started_at
        return None
    
    def add_context_from_journals(self, days=7):
        """Add recent journal entries as context."""
        from journals.models import Journal
        from datetime import timedelta
        from django.utils import timezone
        
        recent_journals = Journal.objects.filter(
            user=self.user,
            created_at__gte=timezone.now() - timedelta(days=days)
        ).order_by('-created_at')[:5]
        
        context_entries = []
        for journal in recent_journals:
            context_entries.append({
                'id': str(journal.id),
                'content': journal.content[:500],  # Limit content length
                'mood_level': journal.mood_level,
                'emotions': journal.emotions,
                'date': journal.created_at.isoformat(),
                'keywords': journal.content_keywords
            })
        
        self.context_entries = context_entries
        self.save()
    
    def find_similar_sessions(self, limit=5):
        """Find similar chat sessions based on keywords and themes."""
        similar_sessions = ChatSession.objects.filter(
            user=self.user,
            status='completed'
        ).exclude(id=self.id)
        
        # If we have keywords, filter by those
        if self.session_keywords:
            similar_sessions = similar_sessions.extra(
                where=["session_keywords::jsonb ?| %s"],
                params=[self.session_keywords]
            )
        
        return similar_sessions.order_by('-started_at')[:limit]


class ChatMessage(models.Model):
    """
    Individual message in a chat session.
    """
    
    class MessageType(models.TextChoices):
        USER = 'user', 'User Message'
        AI = 'ai', 'AI Response'
        COUNSELLOR = 'counsellor', 'Counsellor Message'
        SYSTEM = 'system', 'System Message'
        ESCALATION = 'escalation', 'Escalation Alert'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    # Message content
    content = models.TextField()
    message_type = models.CharField(
        max_length=20,
        choices=MessageType.choices
    )
    
    # AI response metadata
    tokens_used = models.PositiveIntegerField(default=0)
    response_time = models.FloatField(
        null=True,
        blank=True,
        help_text="Response time in seconds"
    )
    
    # Risk assessment
    risk_level = models.CharField(
        max_length=10,
        choices=[
            ('low', 'Low'),
            ('medium', 'Medium'),
            ('high', 'High'),
            ('critical', 'Critical')
        ],
        default='low'
    )
    requires_escalation = models.BooleanField(default=False)
    
    # Message metadata
    is_edited = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    # Content analysis (replacing embeddings)
    message_keywords = models.JSONField(
        default=list,
        blank=True,
        help_text="Keywords extracted from message"
    )
    message_sentiment = models.JSONField(
        default=dict,
        blank=True,
        help_text="Sentiment analysis results"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'chat_message'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['session', 'created_at']),
            models.Index(fields=['message_type']),
            models.Index(fields=['risk_level']),
        ]
    
    def __str__(self):
        return f"Message in {self.session.id} - {self.message_type}"


class ChatTemplate(models.Model):
    """
    Predefined chat templates for different scenarios.
    """
    
    class Category(models.TextChoices):
        WELCOME = 'welcome', 'Welcome Messages'
        STRESS = 'stress', 'Stress Management'
        ANXIETY = 'anxiety', 'Anxiety Support'
        DEPRESSION = 'depression', 'Depression Support'
        ACADEMIC = 'academic', 'Academic Pressure'
        RELATIONSHIPS = 'relationships', 'Relationship Issues'
        CRISIS = 'crisis', 'Crisis Intervention'
        GENERAL = 'general', 'General Support'
    
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=Category.choices)
    system_prompt = models.TextField(
        help_text="System prompt for AI behavior"
    )
    welcome_message = models.TextField(
        blank=True,
        help_text="Initial message to user"
    )
    
    # Configuration
    is_active = models.BooleanField(default=True)
    requires_escalation_review = models.BooleanField(default=False)
    max_messages = models.PositiveIntegerField(
        default=50,
        help_text="Maximum messages before suggesting human help"
    )
    
    # Usage tracking
    usage_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'chat_template'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.category})"


class ChatFeedback(models.Model):
    """
    User feedback on chat sessions.
    """
    session = models.OneToOneField(
        ChatSession,
        on_delete=models.CASCADE,
        related_name='feedback'
    )
    
    # Ratings (1-5 scale)
    overall_rating = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 6)]
    )
    helpfulness_rating = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 6)]
    )
    ai_quality_rating = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 6)],
        null=True,
        blank=True
    )
    
    # Feedback text
    positive_feedback = models.TextField(blank=True)
    improvement_suggestions = models.TextField(blank=True)
    
    # Would recommend
    would_recommend = models.BooleanField(null=True, blank=True)
    would_use_again = models.BooleanField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'chat_feedback'
    
    def __str__(self):
        return f"Feedback for session {self.session.id}"


class ChatAnalytics(models.Model):
    """
    Analytics data for chat sessions.
    """
    date = models.DateField()
    
    # Session metrics
    total_sessions = models.PositiveIntegerField(default=0)
    ai_sessions = models.PositiveIntegerField(default=0)
    counsellor_sessions = models.PositiveIntegerField(default=0)
    escalated_sessions = models.PositiveIntegerField(default=0)
    
    # Message metrics
    total_messages = models.PositiveIntegerField(default=0)
    average_session_length = models.FloatField(default=0)
    average_response_time = models.FloatField(default=0)
    
    # Risk metrics
    high_risk_sessions = models.PositiveIntegerField(default=0)
    crisis_interventions = models.PositiveIntegerField(default=0)
    
    # User satisfaction
    average_rating = models.FloatField(null=True, blank=True)
    completion_rate = models.FloatField(default=0)
    
    # Popular topics and themes (replacing vector analysis)
    top_categories = models.JSONField(default=list, blank=True)
    common_concerns = models.JSONField(default=list, blank=True)
    trending_keywords = models.JSONField(default=list, blank=True)
    emotion_patterns = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'chat_analytics'
        unique_together = ['date']
        ordering = ['-date']
    
    def __str__(self):
        return f"Chat Analytics for {self.date}"
