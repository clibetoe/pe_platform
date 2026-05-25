from rest_framework.permissions import BasePermission
from .models import User


class IsTeacherOrAbove(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            User.TEACHER, User.COACH, User.ADMIN, User.SUPER_ADMIN
        ]


class IsAdminOrAbove(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            User.ADMIN, User.SUPER_ADMIN
        ]


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.SUPER_ADMIN
