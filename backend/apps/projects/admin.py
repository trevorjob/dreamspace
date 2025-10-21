"""
Admin interface for project models.
"""
from django.contrib import admin
from .models import Project, ProjectImage, DesignVariant, ItemInstance, Version


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'owner', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('name', 'owner__username')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'type', 'created_at')
    list_filter = ('type', 'created_at')
    search_fields = ('project__name',)


@admin.register(DesignVariant)
class DesignVariantAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('project__name',)


@admin.register(ItemInstance)
class ItemInstanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'variant', 'name', 'category', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'category')


@admin.register(Version)
class VersionAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('project__name',)

