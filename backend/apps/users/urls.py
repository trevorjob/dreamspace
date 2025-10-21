"""
URL patterns for user authentication.
"""
from django.urls import path
from .views import RegisterView, UserProfileView

app_name = 'users'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
]

