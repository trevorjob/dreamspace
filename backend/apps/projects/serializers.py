"""
Serializers for project-related models.
"""
from rest_framework import serializers
from .models import Project, ProjectImage, DesignVariant, ItemInstance, Version


class ProjectImageSerializer(serializers.ModelSerializer):
    """Serializer for project images."""
    
    class Meta:
        model = ProjectImage
        fields = ('id', 'project', 'type', 'image_url', 'metadata', 'created_at')
        read_only_fields = ('id', 'created_at')


class ItemInstanceSerializer(serializers.ModelSerializer):
    """Serializer for item instances within a variant."""
    
    class Meta:
        model = ItemInstance
        fields = ('id', 'variant', 'name', 'category', 'bbox', 'mask_url', 'transform', 'created_at')
        read_only_fields = ('id', 'created_at')


class DesignVariantSerializer(serializers.ModelSerializer):
    """Serializer for design variants with nested items."""
    items = ItemInstanceSerializer(many=True, read_only=True)
    
    class Meta:
        model = DesignVariant
        fields = ('id', 'project', 'image_url', 'metadata', 'items', 'created_at')
        read_only_fields = ('id', 'created_at')


class VersionSerializer(serializers.ModelSerializer):
    """Serializer for project versions."""
    
    class Meta:
        model = Version
        fields = ('id', 'project', 'snapshot', 'prompt', 'created_at')
        read_only_fields = ('id', 'created_at')


class ProjectSerializer(serializers.ModelSerializer):
    """
    Main project serializer.
    Includes nested images, variants, and versions.
    """
    images = ProjectImageSerializer(many=True, read_only=True)
    variants = DesignVariantSerializer(many=True, read_only=True)
    versions = VersionSerializer(many=True, read_only=True)
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    
    class Meta:
        model = Project
        fields = (
            'id', 'name', 'owner', 'owner_username', 'images', 
            'variants', 'versions', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')

    def create(self, validated_data):
        """Create project with current user as owner."""
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for project list view."""
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    image_count = serializers.IntegerField(source='images.count', read_only=True)
    variant_count = serializers.IntegerField(source='variants.count', read_only=True)
    
    class Meta:
        model = Project
        fields = (
            'id', 'name', 'owner_username', 'image_count', 
            'variant_count', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

