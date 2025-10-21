"""
Celery tasks for async AI processing.

This is a STUB implementation for MVP.
In production, replace with actual AI model integration.
"""
import cloudinary.uploader
from celery import shared_task
from django.conf import settings
from .models import Project, ProjectImage, DesignVariant


@shared_task
def generate_variant(project_id, prompt=''):
    """
    STUB: Generate a design variant for a project.
    
    Current implementation: Duplicates the first project image
    and appends "_generated" to the filename.
    
    TODO: Replace with actual AI model integration:
    - Use Stable Diffusion / DALL-E for image generation
    - Apply style transfer or room redesign models
    - Perform object detection and segmentation
    """
    try:
        project = Project.objects.get(id=project_id)
        
        # Get the first original image as base
        base_image = project.images.filter(type='original').first()
        
        if not base_image:
            return {
                'status': 'error',
                'message': 'No original image found in project'
            }
        
        # STUB: In real implementation, this would:
        # 1. Download the base image
        # 2. Run it through AI model with the prompt
        # 3. Upload the generated result
        
        # For now, just duplicate the image with a different URL
        # (In production, this would be the AI-generated image)
        cloudinary_id = base_image.metadata.get('cloudinary_id', '')
        
        if cloudinary_id:
            # Create a transformed version (example: apply sepia effect as "generation")
            transformed_url = cloudinary.CloudinaryImage(cloudinary_id).build_url(
                transformation=[
                    {'effect': 'sepia:50'},
                    {'overlay': 'text:Arial_30:AI Generated'},
                ]
            )
        else:
            # Fallback: just use the same URL
            transformed_url = base_image.image_url
        
        # Create DesignVariant
        variant = DesignVariant.objects.create(
            project=project,
            image_url=transformed_url,
            metadata={
                'prompt': prompt,
                'base_image_id': base_image.id,
                'generation_type': 'stub',
                'note': 'This is a stub implementation. Replace with real AI model.'
            }
        )
        
        return {
            'status': 'success',
            'variant_id': variant.id,
            'image_url': variant.image_url,
            'message': 'Variant generated (stub implementation)'
        }
        
    except Project.DoesNotExist:
        return {
            'status': 'error',
            'message': f'Project {project_id} not found'
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

