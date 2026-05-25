from django.contrib import admin
from .models import Subject, Topic, Lesson, Activity, OVEPValue, Scenario, Progress


class TopicInline(admin.TabularInline):
    model = Topic
    extra = 1


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ["title", "order", "is_published"]


class ActivityInline(admin.TabularInline):
    model = Activity
    extra = 1


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    inlines = [TopicInline]


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ["title", "subject", "order"]
    list_filter = ["subject"]
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ["title", "topic", "duration_minutes", "is_published", "order"]
    list_filter = ["is_published", "topic__subject"]
    search_fields = ["title"]
    inlines = [ActivityInline]


@admin.register(OVEPValue)
class OVEPValueAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]


@admin.register(Scenario)
class ScenarioAdmin(admin.ModelAdmin):
    list_display = ["title", "linked_value"]


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ["student", "lesson", "status", "completed_at"]
    list_filter = ["status"]
