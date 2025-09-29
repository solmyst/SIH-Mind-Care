"""
Serializers for chat sessions and messages.
"""

from rest_framework import serializers
from users.serializers import UserPublicSerializer
from .models import ChatSession, ChatMessage, ChatTemplate, ChatFeedback, ChatAnalytics


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for chat messages."""
    
    sender = UserPublicSerializer(read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'sender', 'content', 'message_type', 'tokens_used',
            'response_time', 'risk_level', 'requires_escalation',
            'is_edited', 'is_deleted', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'sender', 'tokens_used', 'response_time', 'risk_level',
            'requires_escalation', 'embedding', 'created_at', 'updated_at'
        ]


class ChatMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating chat messages."""
    
    class Meta:
        model = ChatMessage
        fields = ['content']
    
    def validate_content(self, value):
        """Validate message content."""
        if not value.strip():
            raise serializers.ValidationError("Message content cannot be empty.")
        
        if len(value) > 5000:
            raise serializers.ValidationError("Message is too long (max 5000 characters).")
        
        return value.strip()


class ChatSessionSerializer(serializers.ModelSerializer):
    """Serializer for chat sessions."""
    
    user = UserPublicSerializer(read_only=True)
    counsellor = UserPublicSerializer(read_only=True)
    duration = serializers.ReadOnlyField()
    message_count = serializers.ReadOnlyField()
    
    class Meta:
        model = ChatSession
        fields = [
            'id', 'user', 'counsellor', 'session_type', 'status', 'title',
            'ai_model', 'is_escalation', 'escalation_reason', 'priority',
            'message_count', 'total_tokens', 'session_rating', 'duration',
            'started_at', 'last_message_at', 'ended_at'
        ]
        read_only_fields = [
            'id', 'user', 'counsellor', 'message_count', 'total_tokens',
            'duration', 'started_at', 'last_message_at'
        ]


class ChatSessionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating chat sessions."""
    
    class Meta:
        model = ChatSession
        fields = ['session_type', 'title']
    
    def create(self, validated_data):
        """Create chat session with user from request."""
        validated_data['user'] = self.context['request'].user
        
        # Set default system prompt based on session type
        if validated_data['session_type'] == ChatSession.SessionType.AI_CHAT:
            validated_data['system_prompt'] = self.get_default_system_prompt()
        
        return super().create(validated_data)
    
    def get_default_system_prompt(self):
        """Get default system prompt for AI chat."""
        return """
        You are a supportive AI mental health assistant for students. Your role is to:
        1. Listen actively and empathetically
        2. Provide evidence-based coping strategies
        3. Offer emotional support and validation
        4. Suggest healthy activities and resources
        5. Recognize when professional help is needed
        
        Always maintain a warm, non-judgmental tone. If you detect signs of self-harm,
        suicidal thoughts, or severe mental health crisis, immediately recommend seeking
        professional help from a counsellor or emergency services.
        
        Remember: You are not a replacement for professional therapy, but a supportive
        companion for mental wellness.
        """


class ChatSessionDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for chat session with messages."""
    
    user = UserPublicSerializer(read_only=True)
    counsellor = UserPublicSerializer(read_only=True)
    messages = ChatMessageSerializer(many=True, read_only=True)
    duration = serializers.ReadOnlyField()
    
    class Meta:
        model = ChatSession
        fields = [
            'id', 'user', 'counsellor', 'session_type', 'status', 'title',
            'ai_model', 'system_prompt', 'context_entries', 'is_escalation',
            'escalation_reason', 'priority', 'message_count', 'total_tokens',
            'session_rating', 'duration', 'started_at', 'last_message_at',
            'ended_at', 'messages'
        ]
        read_only_fields = [
            'id', 'user', 'counsellor', 'message_count', 'total_tokens',
            'duration', 'started_at', 'last_message_at', 'messages'
        ]


class ChatTemplateSerializer(serializers.ModelSerializer):
    """Serializer for chat templates."""
    
    class Meta:
        model = ChatTemplate
        fields = [
            'id', 'name', 'category', 'system_prompt', 'welcome_message',
            'is_active', 'requires_escalation_review', 'max_messages',
            'usage_count'
        ]
        read_only_fields = ['usage_count']


class ChatFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for chat feedback."""
    
    class Meta:
        model = ChatFeedback
        fields = [
            'overall_rating', 'helpfulness_rating', 'ai_quality_rating',
            'positive_feedback', 'improvement_suggestions', 'would_recommend',
            'would_use_again', 'created_at'
        ]
        read_only_fields = ['created_at']
    
    def validate_overall_rating(self, value):
        """Validate rating range."""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
    
    def validate_helpfulness_rating(self, value):
        """Validate rating range."""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
    
    def validate_ai_quality_rating(self, value):
        """Validate rating range."""
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class ChatAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for chat analytics."""
    
    class Meta:
        model = ChatAnalytics
        fields = [
            'date', 'total_sessions', 'ai_sessions', 'counsellor_sessions',
            'escalated_sessions', 'total_messages', 'average_session_length',
            'average_response_time', 'high_risk_sessions', 'crisis_interventions',
            'average_rating', 'completion_rate', 'top_categories', 'common_concerns'
        ]


class ChatStatsSerializer(serializers.Serializer):
    """Serializer for chat statistics."""
    
    total_sessions = serializers.IntegerField()
    active_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()
    escalated_sessions = serializers.IntegerField()
    average_rating = serializers.FloatField()
    total_messages = serializers.IntegerField()
    average_session_duration = serializers.FloatField()
    high_risk_count = serializers.IntegerField()


class EscalationAlertSerializer(serializers.Serializer):
    """Serializer for escalation alerts."""
    
    session_id = serializers.UUIDField()
    user = UserPublicSerializer()
    risk_level = serializers.CharField()
    message_content = serializers.CharField()
    created_at = serializers.DateTimeField()
    escalation_reason = serializers.CharField()


class ChatSearchSerializer(serializers.Serializer):
    """Serializer for chat search parameters."""
    
    query = serializers.CharField(required=False)
    session_type = serializers.ChoiceField(
        choices=ChatSession.SessionType.choices,
        required=False
    )
    status = serializers.ChoiceField(
        choices=ChatSession.Status.choices,
        required=False
    )
    start_date = serializers.DateTimeField(required=False)
    end_date = serializers.DateTimeField(required=False)
    risk_level = serializers.ChoiceField(
        choices=['low', 'medium', 'high', 'critical'],
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


class MessageSentimentSerializer(serializers.Serializer):
    """Serializer for message sentiment analysis."""
    
    message_id = serializers.UUIDField()
    sentiment_score = serializers.FloatField()
    sentiment_label = serializers.CharField()
    confidence = serializers.FloatField()
    emotions = serializers.ListField(child=serializers.CharField())


class ChatInsightsSerializer(serializers.Serializer):
    """Serializer for chat insights and recommendations."""
    
    session_id = serializers.UUIDField()
    main_concerns = serializers.ListField(child=serializers.CharField())
    emotional_patterns = serializers.DictField()
    recommendations = serializers.ListField(child=serializers.CharField())
    risk_factors = serializers.ListField(child=serializers.CharField())
    positive_indicators = serializers.ListField(child=serializers.CharField())
    suggested_resources = serializers.ListField(child=serializers.CharField())
    follow_up_actions = serializers.ListField(child=serializers.CharField())