from django.contrib.auth import update_session_auth_hash
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, School, Class
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    CustomTokenSerializer,
    SchoolSerializer,
    ClassSerializer,
    ClassDetailSerializer,
    ChangePasswordSerializer,
)
from .permissions import IsTeacherOrAbove, IsAdminOrAbove


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"detail": "Old password is incorrect."}, status=400)
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"detail": "Password changed successfully."})


class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminOrAbove()]
        return [IsAuthenticated()]


class ClassViewSet(viewsets.ModelViewSet):
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in [User.TEACHER, User.COACH]:
            return Class.objects.filter(teacher=user)
        if user.role == User.STUDENT:
            return user.enrolled_classes.all()
        return Class.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ClassDetailSerializer
        return ClassSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsTeacherOrAbove()]
        return [IsAuthenticated()]

    @action(detail=True, methods=["post"], permission_classes=[IsTeacherOrAbove])
    def add_student(self, request, pk=None):
        klass = self.get_object()
        student_id = request.data.get("student_id")
        try:
            student = User.objects.get(id=student_id, role=User.STUDENT)
            klass.students.add(student)
            return Response({"detail": "Student added."})
        except User.DoesNotExist:
            return Response({"detail": "Student not found."}, status=404)

    @action(detail=True, methods=["post"], permission_classes=[IsTeacherOrAbove])
    def remove_student(self, request, pk=None):
        klass = self.get_object()
        student_id = request.data.get("student_id")
        try:
            student = User.objects.get(id=student_id)
            klass.students.remove(student)
            return Response({"detail": "Student removed."})
        except User.DoesNotExist:
            return Response({"detail": "Student not found."}, status=404)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsTeacherOrAbove]
    filterset_fields = ["role", "school"]
    search_fields = ["first_name", "last_name", "email"]

    def get_queryset(self):
        user = self.request.user
        if user.role in [User.ADMIN, User.SUPER_ADMIN]:
            return User.objects.all()
        return User.objects.filter(school=user.school)
