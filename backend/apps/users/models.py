"""
User models for DreamSpace.
Using Django's built-in User model with potential for future extensions.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


# For now, we use Django's default User model
# If you need to extend it later, uncomment below:
#
# class User(AbstractUser):
#     """Extended User model for future customization."""
#     bio = models.TextField(blank=True, null=True)
#     avatar = models.URLField(blank=True, null=True)
#     
#     class Meta:
#         db_table = 'users'

