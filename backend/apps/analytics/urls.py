from django.urls import path
from .views import TeacherDashboardView, StudentProgressView, MyStatsView

urlpatterns = [
    path("teacher/dashboard/", TeacherDashboardView.as_view(), name="teacher-dashboard"),
    path("teacher/students/<uuid:student_id>/", StudentProgressView.as_view(), name="student-progress"),
    path("me/stats/", MyStatsView.as_view(), name="my-stats"),
]
