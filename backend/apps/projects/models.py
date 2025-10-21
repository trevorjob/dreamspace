"""
Models for DreamSpace projects and design variants.

Architecture:
- Project: Top-level container for a design project
- ProjectImage: Uploaded images (original, inspiration, generated)
- DesignVariant: AI-generated design variants
- ItemInstance: Individual furniture/decor items in a variant
- Version: Version history with snapshots for undo/redo
"""
from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    """
    Main project container.
    Each project can have multiple images, variants, and versions.
    """
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects'
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.name} - {self.owner.username}"


class ProjectImage(models.Model):
    """
    Uploaded images for a project.
    Types: original (user upload), inspo (inspiration), generated (AI output)
    """
    IMAGE_TYPES = [
        ('original', 'Original'),
        ('inspo', 'Inspiration'),
        ('generated', 'Generated'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    type = models.CharField(max_length=20, choices=IMAGE_TYPES, default='original')
    image_url = models.URLField(max_length=500)  # Cloudinary URL
    metadata = models.JSONField(default=dict, blank=True)  # Store dimensions, etc.
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'project_images'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.project.name} - {self.type} - {self.id}"


class DesignVariant(models.Model):
    """
    AI-generated design variants for a project.
    Each variant represents a different design option.
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='variants')
    image_url = models.URLField(max_length=500)  # Cloudinary URL
    metadata = models.JSONField(default=dict, blank=True)  # AI params, generation info
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'design_variants'
        ordering = ['-created_at']

    def __str__(self):
        return f"Variant {self.id} - {self.project.name}"


class ItemInstance(models.Model):
    """
    Individual furniture/decor items within a design variant.
    Stores bounding box, segmentation mask, and transform data.
    """
    variant = models.ForeignKey(DesignVariant, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)  # e.g., 'sofa', 'table', 'lamp'
    bbox = models.JSONField(default=dict)  # {x, y, width, height}
    mask_url = models.URLField(max_length=500, blank=True, null=True)  # Segmentation mask
    transform = models.JSONField(default=dict)  # {rotation, scale, position} for canvas
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'item_instances'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.name} ({self.category}) - Variant {self.variant.id}"


class Version(models.Model):
    """
    Version history for projects.
    Stores snapshots of project state for undo/redo functionality.
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='versions')
    snapshot = models.JSONField(default=dict)  # Complete state snapshot
    prompt = models.TextField(blank=True)  # AI generation prompt if applicable
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'versions'
        ordering = ['-created_at']

    def __str__(self):
        return f"Version {self.id} - {self.project.name} - {self.created_at}"

