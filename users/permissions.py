"""
Custom permissions for role-based access control.
"""

from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner of the object.
        return obj == request.user


class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow admins or owners to access.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin users have full access
        if request.user.is_institute_admin() or request.user.is_superadmin():
            return True
        
        # Owners can access their own objects
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return obj == request.user


class IsStudentOrCounsellor(permissions.BasePermission):
    """
    Permission for students and counsellors only.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_student() or request.user.is_counsellor())
        )


class IsCounsellorOrAdmin(permissions.BasePermission):
    """
    Permission for counsellors and admins only.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (
                request.user.is_counsellor() or 
                request.user.is_institute_admin() or 
                request.user.is_superadmin()
            )
        )


class IsPeerModeratorOrAdmin(permissions.BasePermission):
    """
    Permission for peer moderators and admins only.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (
                request.user.is_peer_moderator() or 
                request.user.is_institute_admin() or 
                request.user.is_superadmin()
            )
        )


class IsInstituteAdminOrSuperAdmin(permissions.BasePermission):
    """
    Permission for institute admins and super admins only.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_institute_admin() or request.user.is_superadmin())
        )


class IsSameInstitute(permissions.BasePermission):
    """
    Permission to check if users are from the same institute.
    """
    
    def has_object_permission(self, request, view, obj):
        if not request.user.institute_name:
            return False
        
        # Get the institute from the object
        if hasattr(obj, 'user'):
            return obj.user.institute_name == request.user.institute_name
        elif hasattr(obj, 'institute_name'):
            return obj.institute_name == request.user.institute_name
        
        return False


class CanViewProfile(permissions.BasePermission):
    """
    Permission to view user profiles based on privacy settings.
    """
    
    def has_object_permission(self, request, view, obj):
        # Owner can always view their own profile
        if obj == request.user:
            return True
        
        # Admins can view any profile
        if request.user.is_institute_admin() or request.user.is_superadmin():
            return True
        
        # Counsellors can view profiles from their institute
        if (request.user.is_counsellor() and 
            request.user.institute_name and 
            obj.institute_name == request.user.institute_name):
            return True
        
        # Public profiles can be viewed by anyone
        return obj.is_profile_public