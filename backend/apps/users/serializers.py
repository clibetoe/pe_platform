from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, School, Class


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ["id", "name", "location"]


class UserSerializer(serializers.ModelSerializer):
    school_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "email", "first_name", "last_name", "full_name",
            "role", "school", "school_name", "avatar", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_school_name(self, obj):
        return obj.school.name if obj.school else None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "password", "first_name", "last_name", "role", "school"]

    def validate_role(self, value):
        if value not in [User.STUDENT, User.TEACHER, User.COACH]:
            raise serializers.ValidationError(
                "Self-registration is only available for students, teachers, and coaches."
            )
        return value

    def validate(self, attrs):
        role = attrs.get("role")
        school = attrs.get("school")
        if role in [User.STUDENT, User.TEACHER, User.COACH] and not school:
            raise serializers.ValidationError({"school": "A school must be selected for students, teachers, and coaches."})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)


class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["full_name"] = user.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data


class ClassSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.full_name", read_only=True)
    student_count = serializers.IntegerField(source="students.count", read_only=True)
    teacher = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role__in=[User.TEACHER, User.COACH]),
        required=False,
    )

    class Meta:
        model = Class
        fields = ["id", "name", "teacher", "teacher_name", "school", "student_count", "created_at"]
        read_only_fields = ["id", "created_at"]


class ClassDetailSerializer(ClassSerializer):
    students = UserSerializer(many=True, read_only=True)

    class Meta(ClassSerializer.Meta):
        fields = ClassSerializer.Meta.fields + ["students"]
