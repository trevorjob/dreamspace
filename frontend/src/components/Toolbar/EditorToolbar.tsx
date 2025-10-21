/**
 * Toolbar component for the design editor.
 * Provides tools for adding items, undo/redo, and export.
 */
import { useState } from 'react'
import { useCanvasStore } from '../../store/useStore'
import { projectsAPI } from '../../api/client'
import type { CanvasItem } from '../../types'

interface EditorToolbarProps {
  projectId: number
  onVariantGenerated: () => void
}

export default function EditorToolbar({ projectId, onVariantGenerated }: EditorToolbarProps) {
  const [generating, setGenerating] = useState(false)
  const {
    addCanvasItem,
    removeCanvasItem,
    selectedItemId,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvasStore()

  const handleAddRect = () => {
    const newItem: CanvasItem = {
      id: `rect-${Date.now()}`,
      type: 'rect',
      x: 100,
      y: 100,
      width: 150,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      fill: '#3b82f6',
    }
    addCanvasItem(newItem)
  }

  const handleDelete = () => {
    if (selectedItemId) {
      removeCanvasItem(selectedItemId)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await projectsAPI.generateVariant(projectId, 'Generate a new design variant')
      onVariantGenerated()
    } catch (error) {
      console.error('Failed to generate variant:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-2">
      {/* Add Items */}
      <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
        <button
          onClick={handleAddRect}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
          title="Add Rectangle"
        >
          ➕ Add Item
        </button>
      </div>

      {/* Edit Tools */}
      <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
        <button
          onClick={handleDelete}
          disabled={!selectedItemId}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Selected"
        >
          🗑️ Delete
        </button>
      </div>

      {/* History */}
      <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
        <button
          onClick={undo}
          disabled={!canUndo()}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          ↶ Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          ↷ Redo
        </button>
      </div>

      {/* AI Generation */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {generating ? '✨ Generating...' : '✨ Generate Variant'}
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Export */}
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
          title="Export (Coming Soon)"
        >
          💾 Export
        </button>
      </div>
    </div>
  )
}

