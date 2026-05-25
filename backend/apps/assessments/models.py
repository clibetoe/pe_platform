import uuid
from django.db import models
from apps.users.models import User
from apps.curriculum.models import Lesson


class Assessment(models.Model):
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name="assessments", null=True, blank=True
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    pass_score = models.PositiveIntegerField(default=70)
    time_limit_minutes = models.PositiveIntegerField(null=True, blank=True)
    randomize_questions = models.BooleanField(default=False)
    max_attempts = models.PositiveIntegerField(default=3)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    MCQ = "mcq"
    TRUE_FALSE = "true_false"
    MATCHING = "matching"
    SCENARIO = "scenario"

    TYPE_CHOICES = [
        (MCQ, "Multiple Choice"),
        (TRUE_FALSE, "True / False"),
        (MATCHING, "Matching"),
        (SCENARIO, "Scenario"),
    ]

    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=MCQ)
    options = models.JSONField(default=list)
    correct_answer = models.CharField(max_length=500)
    explanation = models.TextField(blank=True)
    points = models.PositiveIntegerField(default=1)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Q{self.order}: {self.question_text[:60]}"


class Attempt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attempts")
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name="attempts")
    answers = models.JSONField(default=dict)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    passed = models.BooleanField(null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.full_name} — {self.assessment.title} ({self.score}%)"


class Certificate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="certificates")
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, null=True, blank=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=True, blank=True)
    certificate_number = models.CharField(max_length=50, unique=True)
    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cert {self.certificate_number} — {self.student.full_name}"

    def save(self, *args, **kwargs):
        if not self.certificate_number:
            self.certificate_number = f"PE-{str(self.id)[:8].upper()}"
        super().save(*args, **kwargs)


class Achievement(models.Model):
    FITNESS_CHAMPION = "fitness_champion"
    QUIZ_MASTER = "quiz_master"
    STREAK_7 = "streak_7"
    OVEP_EXPLORER = "ovep_explorer"
    FIRST_CERT = "first_cert"

    TYPE_CHOICES = [
        (FITNESS_CHAMPION, "Fitness Champion"),
        (QUIZ_MASTER, "Quiz Master"),
        (STREAK_7, "7-Day Streak"),
        (OVEP_EXPLORER, "OVEP Explorer"),
        (FIRST_CERT, "First Certificate"),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="achievements")
    achievement_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    earned_at = models.DateTimeField(auto_now_add=True)
    xp_awarded = models.PositiveIntegerField(default=50)

    class Meta:
        unique_together = ["student", "achievement_type"]

    def __str__(self):
        return f"{self.student.full_name} — {self.get_achievement_type_display()}"
