"""
User views with role-based access control.
"""

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.db.models import Q

from .models import User, UserProfile, UserSession
from .serializers import (
    UserSerializer, UserDetailsSerializer, UserPublicSerializer,
    UserSessionSerializer, PasswordChangeSerializer, ProfileUpdateSerializer
)
from .permissions import IsOwnerOrReadOnly, IsAdminOrOwner


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get and update current user profile.
    """
    serializer_class = UserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserProfileUpdateView(generics.UpdateAPIView):
    """
    Update user profile with extended fields.
    """
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class UserViewSet(ModelViewSet):
    """
    ViewSet for user management (admin only).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Different permissions for different actions."""
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filter queryset based on user role."""
        user = self.request.user
        
        if user.is_superadmin() or user.is_institute_admin():
            return User.objects.all()
        elif user.is_counsellor():
            # Counsellors can see students from their institute
            return User.objects.filter(
                Q(institute_name=user.institute_name) | Q(id=user.id)
            )
        else:
            # Students can only see public profiles
            return User.objects.filter(
                Q(is_profile_public=True) | Q(id=user.id)
            )
    
    def get_serializer_class(self):
        """Use different serializers based on permissions."""
        if self.action == 'retrieve' and self.get_object() != self.request.user:
            # Use public serializer for other users
            return UserPublicSerializer
        return super().get_serializer_class()
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user information."""
        serializer = UserDetailsSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current user profile."""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = ProfileUpdateSerializer(
            profile, 
            data=request.data, 
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password."""
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Password changed successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify a user (admin only)."""
        if not request.user.is_institute_admin() and not request.user.is_superadmin():
            return Response(
                {'error': 'Permission denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        user = self.get_object()
        user.is_verified = True
        user.save()
        
        return Response({'message': f'User {user.email} verified successfully'})
    
    @action(detail=False, methods=['get'])
    def counsellors(self, request):
        """Get list of available counsellors."""
        counsellors = User.objects.filter(
            role=User.Role.COUNSELLOR,
            is_active=True,
            is_verified=True
        )
        
        # Filter by institute if user is a student
        if request.user.is_student() and request.user.institute_name:
            counsellors = counsellors.filter(
                institute_name=request.user.institute_name
            )
        
        serializer = UserPublicSerializer(counsellors, many=True)
        return Response(serializer.data)


class UserSessionViewSet(ModelViewSet):
    """
    ViewSet for managing user sessions.
    """
    serializer_class = UserSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return sessions for current user only."""
        return UserSession.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Create session for current user."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def logout_all(self, request):
        """Logout from all sessions."""
        UserSession.objects.filter(
            user=request.user, 
            is_active=True
        ).update(
            is_active=False,
            logout_time=timezone.now()
        )
        
        return Response({'message': 'Logged out from all sessions'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_last_active(request):
    """Update user's last active timestamp."""
    request.user.last_active = timezone.now()
    request.user.save(update_fields=['last_active'])
    
    return Response({'message': 'Last active time updated'})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """Get user statistics."""
    user = request.user
    
    stats = {
        'total_users': User.objects.count(),
        'students': User.objects.filter(role=User.Role.STUDENT).count(),
        'counsellors': User.objects.filter(role=User.Role.COUNSELLOR).count(),
        'peer_moderators': User.objects.filter(role=User.Role.PEER_MODERATOR).count(),
        'verified_users': User.objects.filter(is_verified=True).count(),
    }
    
    # Add institute-specific stats for admins
    if user.is_institute_admin() and user.institute_name:
        institute_stats = {
            'institute_total': User.objects.filter(
                institute_name=user.institute_name
            ).count(),
            'institute_students': User.objects.filter(
                institute_name=user.institute_name,
                role=User.Role.STUDENT
            ).count(),
            'institute_counsellors': User.objects.filter(
                institute_name=user.institute_name,
                role=User.Role.COUNSELLOR
            ).count(),
        }
        stats.update(institute_stats)
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_users(request):
    """Search users by name or email."""
    query = request.GET.get('q', '')
    role = request.GET.get('role', '')
    
    if not query:
        return Response({'users': []})
    
    users = User.objects.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query)
    )
    
    # Filter by role if specified
    if role and role in dict(User.Role.choices):
        users = users.filter(role=role)
    
    # Apply permission-based filtering
    if not request.user.is_institute_admin() and not request.user.is_superadmin():
        users = users.filter(is_profile_public=True)
    
    # Limit results
    users = users[:20]
    
    serializer = UserPublicSerializer(users, many=True)
    return Response({'users': serializer.data})
