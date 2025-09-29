"""
Serializers for journal entries and related models.
"""

from rest_framework import serializers
from .models import Journal, JournalPrompt, JournalAnalytics, JournalReminder


class JournalSerializer(serializers.ModelSerializer):
    """Serializer for journal entries."""
    
    user = serializers.StringRelatedField(read_only=True)
    word_count = serializers.ReadOnlyField()
    mood_display_color = serializers.ReadOnlyField(source='get_mood_display_color')
    
    class Meta:
        model = Journal
        fields = [
            'id', 'user', 'title', 'content', 'entry_type',
            'voice_file', 'voice_transcription', 'mood_level', 'emotions',
            'tags', 'weather', 'location', 'sentiment_score', 'risk_level',
            'ai_insights', 'is_private', 'shared_with_counsellor',
            'word_count', 'mood_display_color', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'voice_transcription', 'sentiment_score',
            'risk_level', 'ai_insights', 'embedding', 'word_count',
            'mood_display_color', 'created_at', 'updated_at'
        ]
    
    def validate(self, data):
        """Validate journal entry data."""
        if data.get('entry_type') == Journal.EntryType.VOICE and not data.get('voice_file'):
            raise serializers.ValidationError(
                "Voice file is required for voice entries."
            )
        
        if not data.get('content') and not data.get('voice_file'):
            raise serializers.ValidationError(
                "Either content or voice file must be provided."
            )
        
        return data


class JournalCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating journal entries."""
    
    class Meta:
        model = Journal
        fields = [
            'title', 'content', 'entry_type', 'voice_file',
            'mood_level', 'emotions', 'tags', 'weather', 'location',
            'is_private', 'shared_with_counsellor'
        ]
    
    def create(self, validated_data):
        """Create journal entry with user from request."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class JournalUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating journal entries."""
    
    class Meta:
        model = Journal
        fields = [
            'title', 'content', 'mood_level', 'emotions', 'tags',
            'weather', 'location', 'is_private', 'shared_with_counsellor'
        ]


class JournalSummarySerializer(serializers.ModelSerializer):
    """Brief serializer for journal listings."""
    
    word_count = serializers.ReadOnlyField()
    mood_display_color = serializers.ReadOnlyField(source='get_mood_display_color')
    
    class Meta:
        model = Journal
        fields = [
            'id', 'title', 'mood_level', 'mood_display_color',
            'risk_level', 'word_count', 'created_at'
        ]


class JournalPromptSerializer(serializers.ModelSerializer):
    """Serializer for journal prompts."""
    
    class Meta:
        model = JournalPrompt
        fields = [
            'id', 'title', 'prompt_text', 'category',
            'target_mood_levels', 'usage_count'
        ]
        read_only_fields = ['usage_count']


class JournalAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for journal analytics."""
    
    class Meta:
        model = JournalAnalytics
        fields = [
            'date', 'week_start', 'month_start', 'entry_count',
            'total_words', 'average_mood', 'mood_variance',
            'high_risk_days', 'consecutive_positive_days', 
            'consecutive_negative_days', 'voice_entries_count',
            'tags_used', 'most_common_emotions'
        ]


class JournalReminderSerializer(serializers.ModelSerializer):
    """Serializer for journal reminders."""
    
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = JournalReminder
        fields = [
            'id', 'user', 'reminder_time', 'days_of_week',
            'message', 'is_active', 'last_sent', 'total_sent',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'last_sent', 'total_sent',
            'created_at', 'updated_at'
        ]
    
    def validate_days_of_week(self, value):
        """Validate days of week format."""
        if not isinstance(value, list):
            raise serializers.ValidationError("Days of week must be a list.")
        
        for day in value:
            if not isinstance(day, int) or day < 0 or day > 6:
                raise serializers.ValidationError(
                    "Days must be integers between 0 and 6."
                )
        
        return value


class JournalStatsSerializer(serializers.Serializer):
    """Serializer for journal statistics."""
    
    total_entries = serializers.IntegerField()
    this_month_entries = serializers.IntegerField()
    this_week_entries = serializers.IntegerField()
    average_mood = serializers.FloatField()
    mood_trend = serializers.CharField()
    longest_streak = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    most_used_emotions = serializers.ListField()
    risk_alerts = serializers.IntegerField()
    total_words = serializers.IntegerField()


class MoodTrendSerializer(serializers.Serializer):
    """Serializer for mood trend data."""
    
    date = serializers.DateField()
    mood_level = serializers.FloatField()
    entry_count = serializers.IntegerField()


class EmotionFrequencySerializer(serializers.Serializer):
    """Serializer for emotion frequency data."""
    
    emotion = serializers.CharField()
    count = serializers.IntegerField()
    percentage = serializers.FloatField()


class JournalSearchSerializer(serializers.Serializer):
    """Serializer for journal search parameters."""
    
    query = serializers.CharField(required=False)
    mood_level = serializers.IntegerField(required=False, min_value=1, max_value=5)
    tags = serializers.ListField(child=serializers.CharField(), required=False)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    risk_level = serializers.ChoiceField(
        choices=['low', 'medium', 'high', 'critical'],
        required=False
    )
    entry_type = serializers.ChoiceField(
        choices=Journal.EntryType.choices,
        required=False
    )
    
    def validate(self, data):
        """Validate date range."""
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                "Start date must be before end date."
            )
        
        return data