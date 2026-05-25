from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssessmentViewSet, QuestionViewSet, AttemptViewSet, CertificateViewSet, AchievementViewSet

router = DefaultRouter()
router.register("quizzes", AssessmentViewSet, basename="assessment")
router.register("questions", QuestionViewSet, basename="question")
router.register("attempts", AttemptViewSet, basename="attempt")
router.register("certificates", CertificateViewSet, basename="certificate")
router.register("achievements", AchievementViewSet, basename="achievement")

urlpatterns = [path("", include(router.urls))]
