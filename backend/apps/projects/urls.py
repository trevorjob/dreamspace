"""
URL patterns for project-related endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, VariantViewSet, ItemInstanceViewSet

app_name = 'projects'

router = DefaultRouter()
router.register(r'', ProjectViewSet, basename='project')
router.register(r'variants', VariantViewSet, basename='variant')
router.register(r'items', ItemInstanceViewSet, basename='item')

urlpatterns = [
    path('', include(router.urls)),
]

