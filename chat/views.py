"""
Chat views for AI conversations and counsellor sessions.
"""

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from django.db.models import Q, Avg, Count
from django.utils import timezone
from datetime import timedelta

from users.permissions import IsOwnerOrReadOnly, IsCounsellorOrAdmin
from .models import ChatSession, ChatMessage, ChatTemplate, ChatFeedback
from .serializers import (
    ChatSessionSerializer, ChatSessionCreateSerializer, ChatSessionDetailSerializer,
    ChatMessageSerializer, ChatMessageCreateSerializer, ChatTemplateSerializer,
    ChatFeedbackSerializer, ChatStatsSerializer
)
from .tasks import process_chat_message, generate_ai_response


class ChatSessionViewSet(ModelViewSet):
    """ViewSet for managing chat sessions."""
    
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """Return sessions for current user."""
        user = self.request.user
        if user.is_counsellor():
            return ChatSession.objects.filter(
                Q(user=user) | Q(counsellor=user)
            )
        return ChatSession.objects.filter(user=user)
    
    def get_serializer_class(self):
        """Use different serializers based on action."""
        if self.action == 'create':
            return ChatSessionCreateSerializer
        elif self.action == 'retrieve':
            return ChatSessionDetailSerializer
        return ChatSessionSerializer
    
    def perform_create(self, serializer):
        """Create session and add journal context."""
        session = serializer.save(user=self.request.user)
        
        # Add recent journal context for AI sessions
        if session.session_type == ChatSession.SessionType.AI_CHAT:
            session.add_context_from_journals()
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send message in chat session."""
        session = self.get_object()
        
        if session.status not in ['active', 'paused']:
            return Response(
                {'error': 'Cannot send message to inactive session'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ChatMessageCreateSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save(
                session=session,
                sender=request.user,
                message_type=ChatMessage.MessageType.USER
            )
            
            # Update session
            session.message_count += 1
            session.last_message_at = timezone.now()
            session.save()
            
            # Generate AI response for AI sessions
            if session.session_type == ChatSession.SessionType.AI_CHAT:
                generate_ai_response.delay(session.id, message.id)
            
            # Process message for risk assessment
            process_chat_message.delay(message.id)
            
            return Response(ChatMessageSerializer(message).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def end_session(self, request, pk=None):
        """End chat session."""
        session = self.get_object()
        session.status = ChatSession.Status.COMPLETED
        session.ended_at = timezone.now()
        session.save()
        
        return Response({'message': 'Session ended successfully'})
    
    @action(detail=True, methods=['post'])
    def escalate(self, request, pk=None):
        """Escalate session to counsellor."""
        session = self.get_object()
        reason = request.data.get('reason', 'User requested escalation')
        
        session.status = ChatSession.Status.ESCALATED
        session.is_escalation = True
        session.escalation_reason = reason
        session.priority = 'high'
        session.save()
        
        # TODO: Assign counsellor and notify
        
        return Response({'message': 'Session escalated to counsellor'})
    
    @action(detail=True, methods=['post'])
    def submit_feedback(self, request, pk=None):
        """Submit feedback for session."""
        session = self.get_object()
        
        serializer = ChatFeedbackSerializer(data=request.data)
        if serializer.is_valid():
            feedback = serializer.save(session=session)
            
            # Update session rating
            session.session_rating = feedback.overall_rating
            session.save()
            
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def chat_stats(request):
    """Get chat statistics for current user."""
    user = request.user
    
    sessions = ChatSession.objects.filter(user=user)
    
    stats = {
        'total_sessions': sessions.count(),
        'active_sessions': sessions.filter(status='active').count(),
        'completed_sessions': sessions.filter(status='completed').count(),
        'escalated_sessions': sessions.filter(is_escalation=True).count(),
        'average_rating': sessions.filter(session_rating__isnull=False)
                                 .aggregate(avg=Avg('session_rating'))['avg'] or 0,
        'total_messages': ChatMessage.objects.filter(session__user=user).count(),
        'average_session_duration': 0,  # TODO: Calculate
        'high_risk_count': ChatMessage.objects.filter(
            session__user=user,
            risk_level__in=['high', 'critical']
        ).count()
    }
    
    serializer = ChatStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsCounsellorOrAdmin])
def counsellor_queue(request):
    """Get escalated sessions queue for counsellors."""
    user = request.user
    
    if user.is_counsellor():
        escalated_sessions = ChatSession.objects.filter(
            status='escalated',
            user__institute_name=user.institute_name
        ).order_by('-priority', '-started_at')
    else:
        escalated_sessions = ChatSession.objects.filter(
            status='escalated'
        ).order_by('-priority', '-started_at')
    
    serializer = ChatSessionSerializer(escalated_sessions, many=True)
    return Response(serializer.data)


class ChatTemplateViewSet(ModelViewSet):
    """ViewSet for chat templates."""
    
    queryset = ChatTemplate.objects.filter(is_active=True)
    serializer_class = ChatTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Only counsellors can modify templates."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsCounsellorOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]
