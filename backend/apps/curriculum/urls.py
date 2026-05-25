from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubjectViewSet, TopicViewSet, LessonViewSet, OVEPValueViewSet, ScenarioViewSet, ProgressViewSet

router = DefaultRouter()
router.register("subjects", SubjectViewSet, basename="subject")
router.register("topics", TopicViewSet, basename="topic")
router.register("lessons", LessonViewSet, basename="lesson")
router.register("ovep-values", OVEPValueViewSet, basename="ovep-value")
router.register("scenarios", ScenarioViewSet, basename="scenario")
router.register("progress", ProgressViewSet, basename="progress")

urlpatterns = [path("", include(router.urls))]
