from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, School, Class


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "full_name", "role", "school", "is_active"]
    list_filter = ["role", "school", "is_active"]
    search_fields = ["email", "first_name", "last_name"]
    ordering = ["email"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal", {"fields": ("first_name", "last_name", "avatar")}),
        ("Role & School", {"fields": ("role", "school")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2", "first_name", "last_name", "role")}),
    )


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ["name", "location"]
    search_fields = ["name"]


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ["name", "teacher", "school"]
    filter_horizontal = ["students"]
