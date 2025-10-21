/**
 * Upload panel component for uploading room photos.
 */
import { useRef, useState } from 'react'
import { projectsAPI } from '../../api/client'
import { useCanvasStore } from '../../store/useStore'

interface UploadPanelProps {
  projectId: number
  onImageUploaded: (imageUrl: string) => void
}

export default function UploadPanel({ projectId, onImageUploaded }: UploadPanelProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const setBackgroundImage = useCanvasStore((state) => state.setBackgroundImage)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const result = await projectsAPI.uploadImage(projectId, file, 'original')
      setBackgroundImage(result.image_url)
      onImageUploaded(result.image_url)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Upload</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
      >
        {uploading ? 'Uploading...' : '+ Upload Image'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Tips</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Upload a room photo as background</li>
          <li>• Add items from the toolbar</li>
          <li>• Drag and resize items on canvas</li>
          <li>• Generate AI variants</li>
        </ul>
      </div>
    </div>
  )
}

