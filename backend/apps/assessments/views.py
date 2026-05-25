from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.users.models import User
from apps.users.permissions import IsTeacherOrAbove, IsAdminOrAbove
from .models import Assessment, Question, Attempt, Certificate, Achievement
from .serializers import (
    AssessmentListSerializer, AssessmentDetailSerializer,
    QuestionSerializer, QuestionWithAnswerSerializer,
    SubmitAttemptSerializer, AttemptSerializer, AttemptResultSerializer,
    CertificateSerializer, AchievementSerializer,
)


class AssessmentViewSet(viewsets.ModelViewSet):
    filterset_fields = ["lesson", "is_published"]

    def get_queryset(self):
        qs = Assessment.objects.prefetch_related("questions").order_by("lesson", "title")
        if self.request.user.role == User.STUDENT:
            return qs.filter(is_published=True)
        return qs

    def get_serializer_class(self):
        if self.action == "retrieve":
            return AssessmentDetailSerializer
        return AssessmentListSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsTeacherOrAbove()]
        return [IsAuthenticated()]

    @action(detail=True, methods=["post"])
    def start(self, request, pk=None):
        assessment = self.get_object()
        prior_attempts = Attempt.objects.filter(
            student=request.user, assessment=assessment, submitted_at__isnull=False
        ).count()
        if prior_attempts >= assessment.max_attempts:
            return Response(
                {"detail": f"Maximum attempts ({assessment.max_attempts}) reached."},
                status=400,
            )
        attempt = Attempt.objects.create(student=request.user, assessment=assessment)
        return Response(AttemptSerializer(attempt).data, status=201)

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        assessment = self.get_object()
        serializer = SubmitAttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        attempt = Attempt.objects.filter(
            student=request.user, assessment=assessment, submitted_at__isnull=True
        ).last()
        if not attempt:
            return Response({"detail": "No active attempt found."}, status=400)

        answers = serializer.validated_data["answers"]
        attempt.answers = answers

        questions = list(assessment.questions.all())
        total_points = sum(q.points for q in questions)
        earned_points = 0
        for q in questions:
            given = answers.get(str(q.id), "")
            if given.strip().lower() == q.correct_answer.strip().lower():
                earned_points += q.points

        score = (earned_points / total_points * 100) if total_points else 0
        attempt.score = round(score, 2)
        attempt.passed = score >= assessment.pass_score
        attempt.submitted_at = timezone.now()
        attempt.save()

        if attempt.passed:
            self._maybe_issue_certificate(request.user, assessment)

        return Response(AttemptResultSerializer(attempt).data)

    def _maybe_issue_certificate(self, student, assessment):
        if not Certificate.objects.filter(student=student, assessment=assessment).exists():
            Certificate.objects.create(student=student, assessment=assessment)


class QuestionViewSet(viewsets.ModelViewSet):
    filterset_fields = ["assessment"]

    def get_queryset(self):
        return Question.objects.filter(assessment__in=Assessment.objects.all()).order_by("assessment", "order")

    def get_serializer_class(self):
        if self.request.user.role != User.STUDENT:
            return QuestionWithAnswerSerializer
        return QuestionSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsTeacherOrAbove()]
        return [IsAuthenticated()]


class AttemptViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in [User.TEACHER, User.COACH, User.ADMIN, User.SUPER_ADMIN]:
            student_id = self.request.query_params.get("student_id")
            if student_id:
                return Attempt.objects.filter(student_id=student_id, submitted_at__isnull=False).order_by("-submitted_at")
            return Attempt.objects.filter(submitted_at__isnull=False).order_by("-submitted_at")
        return Attempt.objects.filter(student=user, submitted_at__isnull=False).order_by("-submitted_at")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return AttemptResultSerializer
        return AttemptSerializer


class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in [User.ADMIN, User.SUPER_ADMIN]:
            return Certificate.objects.all().order_by("-issued_at")
        return Certificate.objects.filter(student=user).order_by("-issued_at")


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Achievement.objects.filter(student=self.request.user).order_by("-earned_at")
