from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.users.models import User
from apps.users.permissions import IsTeacherOrAbove, IsAdminOrAbove
from .models import Subject, Topic, Lesson, Activity, Scenario, OVEPValue, Progress
from .serializers import (
    SubjectSerializer, SubjectDetailSerializer,
    TopicSerializer, LessonListSerializer, LessonDetailSerializer,
    ActivitySerializer, ScenarioSerializer, OVEPValueSerializer, ProgressSerializer,
)


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by("name")
    search_fields = ["name"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return SubjectDetailSerializer
        return SubjectSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminOrAbove()]
        return [IsAuthenticated()]


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.select_related("subject").order_by("subject__name", "order")
    serializer_class = TopicSerializer
    filterset_fields = ["subject"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsTeacherOrAbove()]
        return [IsAuthenticated()]


class LessonViewSet(viewsets.ModelViewSet):
    search_fields = ["title", "description"]
    filterset_fields = ["topic", "topic__subject", "is_published"]

    def get_queryset(self):
        qs = Lesson.objects.select_related("topic__subject").prefetch_related("activities").order_by("topic__order", "order")
        if self.request.user.role == User.STUDENT:
            return qs.filter(is_published=True)
        return qs

    def get_serializer_class(self):
        if self.action == "retrieve":
            return LessonDetailSerializer
        return LessonListSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsTeacherOrAbove()]
        return [IsAuthenticated()]

    @action(detail=True, methods=["post"])
    def mark_complete(self, request, pk=None):
        lesson = self.get_object()
        progress, _ = Progress.objects.get_or_create(
            student=request.user, lesson=lesson
        )
        progress.status = Progress.COMPLETED
        progress.completed_at = timezone.now()
        progress.save()
        return Response({"detail": "Lesson marked as complete."})

    @action(detail=True, methods=["post"])
    def mark_started(self, request, pk=None):
        lesson = self.get_object()
        Progress.objects.get_or_create(student=request.user, lesson=lesson)
        return Response({"detail": "Progress started."})


class OVEPValueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OVEPValue.objects.all().order_by("name")
    serializer_class = OVEPValueSerializer
    permission_classes = [IsAuthenticated]


class ScenarioViewSet(viewsets.ModelViewSet):
    queryset = Scenario.objects.select_related("linked_value").order_by("lesson", "id")
    serializer_class = ScenarioSerializer
    filterset_fields = ["linked_value", "lesson"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsTeacherOrAbove()]
        return [IsAuthenticated()]


class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in [User.TEACHER, User.COACH, User.ADMIN, User.SUPER_ADMIN]:
            student_id = self.request.query_params.get("student_id")
            if student_id:
                return Progress.objects.filter(student_id=student_id).order_by("lesson__topic__order", "lesson__order")
            return Progress.objects.all().order_by("student", "lesson")
        return Progress.objects.filter(student=user).order_by("lesson__topic__order", "lesson__order")

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
