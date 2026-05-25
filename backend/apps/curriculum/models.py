import uuid
from django.db import models
from apps.users.models import User


class Subject(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Topic(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="topics")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.subject.name} / {self.title}"


class Lesson(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    content = models.TextField(blank=True)
    video_url = models.URLField(blank=True)
    pdf = models.FileField(upload_to="lessons/pdfs/", null=True, blank=True)
    thumbnail = models.ImageField(upload_to="lessons/thumbs/", null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


class Activity(models.Model):
    WATCH = "watch"
    READ = "read"
    PRACTICE = "practice"
    REFLECT = "reflect"

    TYPE_CHOICES = [
        (WATCH, "Watch"),
        (READ, "Read"),
        (PRACTICE, "Practice"),
        (REFLECT, "Reflect"),
    ]

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="activities")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    activity_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=READ)
    content = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name_plural = "activities"

    def __str__(self):
        return f"{self.lesson.title} / {self.title}"


class OVEPValue(models.Model):
    EXCELLENCE = "excellence"
    RESPECT = "respect"
    FRIENDSHIP = "friendship"
    INCLUSION = "inclusion"
    FAIR_PLAY = "fair_play"
    LEADERSHIP = "leadership"
    DIVERSITY = "diversity"

    VALUE_CHOICES = [
        (EXCELLENCE, "Excellence"),
        (RESPECT, "Respect"),
        (FRIENDSHIP, "Friendship"),
        (INCLUSION, "Inclusion"),
        (FAIR_PLAY, "Fair Play"),
        (LEADERSHIP, "Leadership"),
        (DIVERSITY, "Diversity"),
    ]

    name = models.CharField(max_length=50, choices=VALUE_CHOICES, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.get_name_display()


class Scenario(models.Model):
    title = models.CharField(max_length=200)
    scenario_text = models.TextField()
    question = models.TextField()
    options = models.JSONField()
    correct_answer = models.CharField(max_length=200)
    linked_value = models.ForeignKey(OVEPValue, on_delete=models.SET_NULL, null=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Progress(models.Model):
    STARTED = "started"
    COMPLETED = "completed"

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[(STARTED, "Started"), (COMPLETED, "Completed")],
        default=STARTED,
    )
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["student", "lesson"]

    def __str__(self):
        return f"{self.student.full_name} — {self.lesson.title} ({self.status})"
