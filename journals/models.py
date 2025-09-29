"""
Journal models for mood tracking and private entries.
"""

from django.db import models
from django.conf import settings
import uuid


class Journal(models.Model):
    """
    Main journal model for user entries.
    """
    
    class MoodLevel(models.IntegerChoices):
        VERY_LOW = 1, 'Very Low'
        LOW = 2, 'Low'
        NEUTRAL = 3, 'Neutral'
        GOOD = 4, 'Good'
        EXCELLENT = 5, 'Excellent'
    
    class EntryType(models.TextChoices):
        TEXT = 'text', 'Text Entry'
        VOICE = 'voice', 'Voice Recording'
        MIXED = 'mixed', 'Text and Voice'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='journals'
    )
    
    # Content
    title = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    entry_type = models.CharField(
        max_length=10, 
        choices=EntryType.choices, 
        default=EntryType.TEXT
    )
    
    # Voice recording
    voice_file = models.FileField(
        upload_to='journal_audio/',
        blank=True, 
        null=True,
        help_text="Audio file for voice entries"
    )
    voice_transcription = models.TextField(
        blank=True,
        help_text="Auto-generated transcription of voice entry"
    )
    
    # Mood tracking
    mood_level = models.IntegerField(
        choices=MoodLevel.choices,
        help_text="Overall mood level (1-5 scale)"
    )
    emotions = models.JSONField(
        default=list,
        blank=True,
        help_text="List of emotions selected by user"
    )
    
    # Additional metadata
    tags = models.JSONField(
        default=list,
        blank=True,
        help_text="User-defined tags for categorization"
    )
    weather = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=100, blank=True)
    
    # AI analysis
    sentiment_score = models.FloatField(
        null=True, 
        blank=True,
        help_text="AI-generated sentiment score (-1 to 1)"
    )
    risk_level = models.CharField(
        max_length=20,
        choices=[
            ('low', 'Low Risk'),
            ('medium', 'Medium Risk'),
            ('high', 'High Risk'),
            ('critical', 'Critical Risk')
        ],
        default='low'
    )
    ai_insights = models.JSONField(
        default=dict,
        blank=True,
        help_text="AI-generated insights and recommendations"
    )
    
    # Content analysis for search (replacing embeddings)
    content_keywords = models.JSONField(
        default=list,
        blank=True,
        help_text="Extracted keywords for search and similarity"
    )
    content_summary = models.TextField(
        blank=True,
        help_text="AI-generated content summary"
    )
    
    # Privacy and sharing
    is_private = models.BooleanField(default=True)
    shared_with_counsellor = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'journals_journal'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['mood_level']),
            models.Index(fields=['risk_level']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Journal entry by {self.user.email} on {self.created_at.strftime('%Y-%m-%d')}"
    
    @property
    def word_count(self):
        """Calculate word count of the entry."""
        text = self.content
        if self.voice_transcription:
            text += " " + self.voice_transcription
        return len(text.split())
    
    def get_mood_display_color(self):
        """Get color code for mood level."""
        colors = {
            1: '#FF4444',  # Red
            2: '#FF8C00',  # Orange
            3: '#FFD700',  # Yellow
            4: '#32CD32',  # Green
            5: '#00FF7F',  # Bright Green
        }
        return colors.get(self.mood_level, '#808080')
    
    def find_similar_entries(self, limit=5):
        """Find similar entries based on keywords and mood."""
        similar_entries = Journal.objects.filter(
            user=self.user
        ).exclude(id=self.id)
        
        # Filter by similar mood level (±1)
        similar_entries = similar_entries.filter(
            mood_level__gte=self.mood_level - 1,
            mood_level__lte=self.mood_level + 1
        )
        
        # If we have keywords, filter by those
        if self.content_keywords:
            # Find entries with overlapping keywords
            similar_entries = similar_entries.extra(
                where=["content_keywords::jsonb ?| %s"],
                params=[self.content_keywords]
            )
        
        return similar_entries.order_by('-created_at')[:limit]


class JournalPrompt(models.Model):
    """
    Pre-defined prompts to help users with journal entries.
    """
    
    class Category(models.TextChoices):
        MOOD = 'mood', 'Mood Reflection'
        GRATITUDE = 'gratitude', 'Gratitude'
        GOALS = 'goals', 'Goals & Aspirations'
        RELATIONSHIPS = 'relationships', 'Relationships'
        STRESS = 'stress', 'Stress Management'
        CREATIVITY = 'creativity', 'Creative Expression'
        GENERAL = 'general', 'General Reflection'
    
    title = models.CharField(max_length=200)
    prompt_text = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices)
    
    # Targeting
    is_active = models.BooleanField(default=True)
    target_mood_levels = models.JSONField(
        default=list,
        blank=True,
        help_text="Mood levels this prompt is suitable for"
    )
    
    # Usage tracking
    usage_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'journals_prompt'
        ordering = ['category', 'title']
    
    def __str__(self):
        return self.title


class JournalAnalytics(models.Model):
    """
    Aggregated analytics for user journaling patterns.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='journal_analytics'
    )
    
    # Time period
    date = models.DateField()
    week_start = models.DateField()
    month_start = models.DateField()
    
    # Metrics
    entry_count = models.PositiveIntegerField(default=0)
    total_words = models.PositiveIntegerField(default=0)
    average_mood = models.FloatField(null=True, blank=True)
    mood_variance = models.FloatField(null=True, blank=True)
    
    # Risk tracking
    high_risk_days = models.PositiveIntegerField(default=0)
    consecutive_positive_days = models.PositiveIntegerField(default=0)
    consecutive_negative_days = models.PositiveIntegerField(default=0)
    
    # Engagement
    voice_entries_count = models.PositiveIntegerField(default=0)
    tags_used = models.JSONField(default=list, blank=True)
    most_common_emotions = models.JSONField(default=list, blank=True)
    
    # Keyword and theme analysis
    trending_keywords = models.JSONField(default=list, blank=True)
    theme_analysis = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'journals_analytics'
        unique_together = ['user', 'date']
        indexes = [
            models.Index(fields=['user', 'date']),
            models.Index(fields=['week_start']),
            models.Index(fields=['month_start']),
        ]
    
    def __str__(self):
        return f"Analytics for {self.user.email} on {self.date}"


class JournalReminder(models.Model):
    """
    Personalized reminders for journal entries.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='journal_reminders'
    )
    
    # Timing
    reminder_time = models.TimeField()
    days_of_week = models.JSONField(
        default=list,
        help_text="List of weekday numbers (0=Monday, 6=Sunday)"
    )
    
    # Customization
    message = models.TextField(
        default="Time for your daily reflection! How are you feeling today?",
        help_text="Custom reminder message"
    )
    is_active = models.BooleanField(default=True)
    
    # Tracking
    last_sent = models.DateTimeField(null=True, blank=True)
    total_sent = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'journals_reminder'
    
    def __str__(self):
        return f"Reminder for {self.user.email} at {self.reminder_time}"
