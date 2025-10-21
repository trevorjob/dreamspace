/**
 * Project Editor page - main design workspace.
 */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectsAPI } from '../api/client'
import { useProjectStore, useVariantsStore } from '../store/useStore'
import { useSceneStore } from '../store/useSceneStore'
import ThreeCanvas from '../components/Scene/ThreeCanvas'
import UploadPanel from '../components/Panels/UploadPanel'
import CatalogPanel from '../components/Panels/CatalogPanel'
import PropertiesPanel from '../components/Panels/PropertiesPanel'
import SceneToolbar from '../components/Toolbar/SceneToolbar'

export default function ProjectEditor() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const { currentProject, setCurrentProject } = useProjectStore()
  const { setVariants } = useVariantsStore()
  const { setBackgroundImage } = useSceneStore()

  useEffect(() => {
    if (projectId) {
      loadProject(Number(projectId))
    }
  }, [projectId])

  const loadProject = async (id: number) => {
    try {
      const project = await projectsAPI.get(id)
      setCurrentProject(project)
      
      // Load variants
      const variants = await projectsAPI.getVariants(id)
      setVariants(variants)
    } catch (error) {
      console.error('Failed to load project:', error)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUploaded = (imageUrl: string) => {
    setBackgroundImage(imageUrl)
    if (projectId) {
      loadProject(Number(projectId))
    }
  }

  const handleVariantGenerated = async () => {
    if (projectId) {
      // Reload variants after generation
      setTimeout(async () => {
        const variants = await projectsAPI.getVariants(Number(projectId))
        setVariants(variants)
      }, 2000) // Give Celery time to process
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            {currentProject?.name || 'Project Editor'}
          </h1>
        </div>
      </header>

      {/* Toolbar */}
      {projectId && (
        <SceneToolbar
          projectId={Number(projectId)}
          onImageUploaded={handleVariantGenerated}
        />
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Upload & Catalog */}
        <div className="flex">
          {projectId && (
            <UploadPanel
              projectId={Number(projectId)}
              onImageUploaded={handleImageUploaded}
            />
          )}
          <CatalogPanel />
        </div>

        {/* Center 3D Canvas */}
        <div className="flex-1 overflow-hidden">
          <ThreeCanvas />
        </div>

        {/* Right Panel - Properties */}
        <PropertiesPanel />
      </div>
    </div>
  )
}

