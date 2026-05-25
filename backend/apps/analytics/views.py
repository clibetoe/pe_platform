from django.db.models import Count, Avg, Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import User, Class
from apps.users.permissions import IsTeacherOrAbove
from apps.curriculum.models import Progress, Lesson
from apps.assessments.models import Attempt, Certificate


class TeacherDashboardView(APIView):
    permission_classes = [IsTeacherOrAbove]

    def get(self, request):
        teacher = request.user
        classes = Class.objects.filter(teacher=teacher)
        student_ids = User.objects.filter(enrolled_classes__in=classes).values_list("id", flat=True)

        total_students = len(set(student_ids))
        completed_lessons = Progress.objects.filter(
            student_id__in=student_ids, status=Progress.COMPLETED
        ).count()
        attempts = Attempt.objects.filter(student_id__in=student_ids, submitted_at__isnull=False)
        avg_score = attempts.aggregate(avg=Avg("score"))["avg"] or 0
        pass_rate = (
            attempts.filter(passed=True).count() / attempts.count() * 100
            if attempts.count() else 0
        )

        class_data = []
        for klass in classes:
            k_students = klass.students.values_list("id", flat=True)
            k_attempts = Attempt.objects.filter(student_id__in=k_students, submitted_at__isnull=False)
            class_data.append({
                "id": klass.id,
                "name": klass.name,
                "student_count": klass.students.count(),
                "avg_score": round(
                    k_attempts.aggregate(avg=Avg("score"))["avg"] or 0, 1
                ),
                "completed_lessons": Progress.objects.filter(
                    student_id__in=k_students, status=Progress.COMPLETED
                ).count(),
            })

        return Response({
            "total_students": total_students,
            "total_classes": classes.count(),
            "completed_lessons": completed_lessons,
            "avg_score": round(avg_score, 1),
            "pass_rate": round(pass_rate, 1),
            "classes": class_data,
        })


class StudentProgressView(APIView):
    permission_classes = [IsTeacherOrAbove]

    def get(self, request, student_id):
        try:
            student = User.objects.get(id=student_id, role=User.STUDENT)
        except User.DoesNotExist:
            return Response({"detail": "Student not found."}, status=404)

        progress = Progress.objects.filter(student=student).select_related("lesson__topic__subject")
        attempts = Attempt.objects.filter(student=student, submitted_at__isnull=False).select_related("assessment")
        certs = Certificate.objects.filter(student=student)

        return Response({
            "student": {
                "id": str(student.id),
                "name": student.full_name,
                "email": student.email,
            },
            "lessons_completed": progress.filter(status=Progress.COMPLETED).count(),
            "lessons_started": progress.count(),
            "quiz_attempts": attempts.count(),
            "quizzes_passed": attempts.filter(passed=True).count(),
            "avg_score": round(attempts.aggregate(avg=Avg("score"))["avg"] or 0, 1),
            "certificates": certs.count(),
            "recent_activity": [
                {
                    "type": "lesson",
                    "title": p.lesson.title,
                    "status": p.status,
                    "date": p.completed_at or p.created_at,
                }
                for p in progress.order_by("-created_at")[:5]
            ],
        })


class MyStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = request.user
        progress = Progress.objects.filter(student=student)
        attempts = Attempt.objects.filter(student=student, submitted_at__isnull=False)
        certs = Certificate.objects.filter(student=student)
        total_lessons = Lesson.objects.filter(is_published=True).count()

        return Response({
            "lessons_completed": progress.filter(status=Progress.COMPLETED).count(),
            "lessons_started": progress.count(),
            "total_lessons": total_lessons,
            "quizzes_passed": attempts.filter(passed=True).count(),
            "avg_score": round(attempts.aggregate(avg=Avg("score"))["avg"] or 0, 1),
            "certificates": certs.count(),
            "xp_total": sum(a.xp_awarded for a in request.user.achievements.all()),
        })
