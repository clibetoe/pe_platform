from django.contrib import admin
from .models import Assessment, Question, Attempt, Certificate, Achievement


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    fields = ["question_text", "question_type", "correct_answer", "points", "order"]


@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ["title", "lesson", "pass_score", "is_published"]
    list_filter = ["is_published"]
    inlines = [QuestionInline]


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ["student", "assessment", "score", "passed", "submitted_at"]
    list_filter = ["passed"]
    readonly_fields = ["answers"]


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ["certificate_number", "student", "assessment", "issued_at"]
    readonly_fields = ["certificate_number"]


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ["student", "achievement_type", "earned_at", "xp_awarded"]
