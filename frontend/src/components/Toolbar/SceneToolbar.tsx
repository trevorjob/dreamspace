/**
 * Toolbar component for 3D scene operations.
 */
import { useSceneStore } from '../../store/useSceneStore'

interface SceneToolbarProps {
  projectId: number
  onImageUploaded: () => void
}

export default function SceneToolbar({ projectId, onImageUploaded }: SceneToolbarProps) {
  const {
    selectedItemId,
    deleteItem,
    selectItem,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useSceneStore()

  const handleDelete = () => {
    if (selectedItemId) {
      deleteItem(selectedItemId)
      selectItem(null)
    }
  }

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-2">
      {/* Scene Tools */}
      <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
        <span className="text-sm font-medium text-gray-700">Scene:</span>
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

      {/* Item Tools */}
      <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
        <span className="text-sm font-medium text-gray-700">Item:</span>
        <button
          onClick={handleDelete}
          disabled={!selectedItemId}
          className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Selected Item"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Camera Controls Info */}
      <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
        <span className="text-sm font-medium text-gray-700">Navigation:</span>
        <span className="text-xs text-gray-500">
          🖱️ Left drag: Look around • 🖱️ Right drag: Move view • 🔍 Scroll: Zoom
        </span>
      </div>

      {/* Item Controls Info */}
      <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
        <span className="text-sm font-medium text-gray-700">Move Items:</span>
        <span className="text-xs text-gray-500">
          Click item → Use arrow buttons in right panel
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Scene Info */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          Items: {useSceneStore.getState().items.length}
        </span>
        {selectedItemId && (
          <span className="text-sm text-primary-600">
            • Selected: {useSceneStore.getState().items.find(i => i.id === selectedItemId)?.name}
          </span>
        )}
      </div>
    </div>
  )
}
