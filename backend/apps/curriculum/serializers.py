from rest_framework import serializers
from .models import Subject, Topic, Lesson, Activity, Scenario, OVEPValue, Progress


class OVEPValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = OVEPValue
        fields = ["id", "name", "description", "icon"]


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["id", "title", "description", "activity_type", "content", "order"]


class ScenarioSerializer(serializers.ModelSerializer):
    linked_value_name = serializers.CharField(source="linked_value.get_name_display", read_only=True)

    class Meta:
        model = Scenario
        fields = ["id", "title", "scenario_text", "question", "options",
                  "correct_answer", "linked_value", "linked_value_name"]


class LessonListSerializer(serializers.ModelSerializer):
    topic_title = serializers.CharField(source="topic.title", read_only=True)
    subject_name = serializers.CharField(source="topic.subject.name", read_only=True)
    activity_count = serializers.IntegerField(source="activities.count", read_only=True)

    class Meta:
        model = Lesson
        fields = [
            "id", "title", "description", "video_url", "thumbnail",
            "duration_minutes", "order", "is_published",
            "topic_title", "subject_name", "activity_count",
        ]


class LessonDetailSerializer(LessonListSerializer):
    activities = ActivitySerializer(many=True, read_only=True)
    scenarios = ScenarioSerializer(many=True, read_only=True)

    class Meta(LessonListSerializer.Meta):
        fields = LessonListSerializer.Meta.fields + ["content", "pdf", "activities", "scenarios"]


class TopicSerializer(serializers.ModelSerializer):
    lessons = LessonListSerializer(many=True, read_only=True)
    lesson_count = serializers.IntegerField(source="lessons.count", read_only=True)

    class Meta:
        model = Topic
        fields = ["id", "title", "description", "order", "lesson_count", "lessons"]


class SubjectSerializer(serializers.ModelSerializer):
    topic_count = serializers.IntegerField(source="topics.count", read_only=True)

    class Meta:
        model = Subject
        fields = ["id", "name", "description", "icon", "topic_count"]


class SubjectDetailSerializer(SubjectSerializer):
    topics = TopicSerializer(many=True, read_only=True)

    class Meta(SubjectSerializer.Meta):
        fields = SubjectSerializer.Meta.fields + ["topics"]


class ProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source="lesson.title", read_only=True)

    class Meta:
        model = Progress
        fields = ["id", "lesson", "lesson_title", "status", "completed_at", "created_at"]
        read_only_fields = ["id", "created_at"]
