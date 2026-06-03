from rest_framework import serializers
from .models import Assessment, Question, Attempt, Certificate, Achievement
from apps.users.models import User


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "question_text", "question_type", "options", "points", "order"]


class QuestionWithAnswerSerializer(QuestionSerializer):
    class Meta(QuestionSerializer.Meta):
        fields = QuestionSerializer.Meta.fields + ["correct_answer", "explanation"]


class AssessmentListSerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(source="questions.count", read_only=True)
    lesson_title = serializers.CharField(source="lesson.title", read_only=True)

    class Meta:
        model = Assessment
        fields = [
            "id", "title", "description", "pass_score", "time_limit_minutes",
            "max_attempts", "is_published", "lesson_title", "question_count",
        ]


class AssessmentDetailSerializer(AssessmentListSerializer):
    questions = serializers.SerializerMethodField()

    class Meta(AssessmentListSerializer.Meta):
        fields = AssessmentListSerializer.Meta.fields + ["questions", "randomize_questions"]

    def get_questions(self, obj):
        request = self.context.get("request")
        is_student = request and request.user.role == User.STUDENT
        serializer_class = QuestionSerializer if is_student else QuestionWithAnswerSerializer
        return serializer_class(obj.questions.all(), many=True).data


class SubmitAttemptSerializer(serializers.Serializer):
    answers = serializers.DictField(
        child=serializers.CharField(),
        help_text="Map of question_id (str) to selected answer (str)",
    )


class AttemptSerializer(serializers.ModelSerializer):
    assessment_title = serializers.CharField(source="assessment.title", read_only=True)
    student_name = serializers.CharField(source="student.full_name", read_only=True)

    class Meta:
        model = Attempt
        fields = [
            "id", "assessment", "assessment_title", "student", "student_name",
            "score", "passed", "started_at", "submitted_at",
        ]
        read_only_fields = ["id", "score", "passed", "started_at", "submitted_at"]


class AttemptResultSerializer(AttemptSerializer):
    answers = serializers.JSONField(read_only=True)
    question_results = serializers.SerializerMethodField()

    class Meta(AttemptSerializer.Meta):
        fields = AttemptSerializer.Meta.fields + ["answers", "question_results"]

    def get_question_results(self, obj):
        results = []
        for question in obj.assessment.questions.all():
            qid = str(question.id)
            given = obj.answers.get(qid, "")
            correct = question.correct_answer
            results.append({
                "question_id": qid,
                "question_text": question.question_text,
                "given_answer": given,
                "correct_answer": correct,
                "is_correct": given.strip().lower() == correct.strip().lower(),
                "explanation": question.explanation,
                "points": question.points,
            })
        return results


class CertificateSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    school_name = serializers.CharField(source="student.school.name", read_only=True)
    assessment_title = serializers.CharField(source="assessment.title", read_only=True)

    class Meta:
        model = Certificate
        fields = [
            "id", "certificate_number", "student_name", "school_name",
            "assessment_title", "issued_at",
        ]


class AchievementSerializer(serializers.ModelSerializer):
    achievement_label = serializers.CharField(source="get_achievement_type_display", read_only=True)

    class Meta:
        model = Achievement
        fields = ["id", "achievement_type", "achievement_label", "earned_at", "xp_awarded"]
