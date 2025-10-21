"""
Views for project management and AI generation.
"""
import cloudinary.uploader
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.shortcuts import get_object_or_404

from .models import Project, ProjectImage, DesignVariant, ItemInstance, Version
from .serializers import (
    ProjectSerializer, ProjectListSerializer, ProjectImageSerializer,
    DesignVariantSerializer, ItemInstanceSerializer, VersionSerializer
)
from .tasks import generate_variant


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Project CRUD operations.
    
    Endpoints:
    - GET /api/projects/ - list all user's projects
    - POST /api/projects/ - create new project
    - GET /api/projects/{id}/ - retrieve project details
    - PUT/PATCH /api/projects/{id}/ - update project
    - DELETE /api/projects/{id}/ - delete project
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return projects owned by current user."""
        return Project.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        """Use lightweight serializer for list view."""
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    @action(detail=True, methods=['post'])
    def upload(self, request, pk=None):
        """
        POST /api/projects/{id}/upload/
        Upload images to Cloudinary and associate with project.
        
        Expected: multipart/form-data with 'image' file and optional 'type' field
        """
        project = self.get_object()
        image_file = request.FILES.get('image')
        image_type = request.data.get('type', 'original')
        
        if not image_file:
            return Response(
                {'error': 'No image file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Upload to Cloudinary
        try:
            upload_result = cloudinary.uploader.upload(
                image_file,
                folder=f'dreamspace/projects/{project.id}/',
                **settings.CLOUDINARY_CONFIG
            )
            
            # Create ProjectImage record
            project_image = ProjectImage.objects.create(
                project=project,
                type=image_type,
                image_url=upload_result['secure_url'],
                metadata={
                    'width': upload_result.get('width'),
                    'height': upload_result.get('height'),
                    'format': upload_result.get('format'),
                    'cloudinary_id': upload_result.get('public_id'),
                }
            )
            
            serializer = ProjectImageSerializer(project_image)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': f'Upload failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """
        POST /api/projects/{id}/generate/
        Trigger async AI generation task (stub implementation).
        
        In production, this would call a real AI model.
        For MVP, it duplicates an image with "_generated" suffix.
        """
        project = self.get_object()
        prompt = request.data.get('prompt', '')
        
        # Trigger Celery task
        task = generate_variant.delay(project.id, prompt)
        
        return Response({
            'message': 'Generation started',
            'task_id': task.id,
            'project_id': project.id
        }, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=['get'])
    def variants(self, request, pk=None):
        """
        GET /api/projects/{id}/variants/
        Fetch all design variants for a project.
        """
        project = self.get_object()
        variants = project.variants.all()
        serializer = DesignVariantSerializer(variants, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def versions(self, request, pk=None):
        """
        GET /api/projects/{id}/versions/
        Fetch version history for a project.
        """
        project = self.get_object()
        versions = project.versions.all()
        serializer = VersionSerializer(versions, many=True)
        return Response(serializer.data)


class VariantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for DesignVariant operations.
    """
    serializer_class = DesignVariantSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return variants for user's projects only."""
        user_projects = Project.objects.filter(owner=self.request.user)
        return DesignVariant.objects.filter(project__in=user_projects)

    @action(detail=True, methods=['post'])
    def items(self, request, pk=None):
        """
        POST /api/variants/{id}/items/
        Add or update item instances in a variant.
        """
        variant = self.get_object()
        serializer = ItemInstanceSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(variant=variant)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ItemInstanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ItemInstance operations.
    """
    serializer_class = ItemInstanceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return items for user's variants only."""
        user_projects = Project.objects.filter(owner=self.request.user)
        user_variants = DesignVariant.objects.filter(project__in=user_projects)
        return ItemInstance.objects.filter(variant__in=user_variants)

