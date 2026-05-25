from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, RegisterView, MeView, ChangePasswordView,
    SchoolViewSet, ClassViewSet, UserViewSet,
)

router = DefaultRouter()
router.register("schools", SchoolViewSet, basename="school")
router.register("classes", ClassViewSet, basename="class")
router.register("users", UserViewSet, basename="user")

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("", include(router.urls)),
]
