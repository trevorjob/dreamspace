/**
 * Right panel component showing item details and alternatives.
 */
import { useState } from 'react'
import { useCanvasStore, useVariantsStore } from '../../store/useStore'
import type { DesignVariant } from '../../types'

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState<'details' | 'variants'>('details')
  const { canvasItems, selectedItemId, updateCanvasItem } = useCanvasStore()
  const variants = useVariantsStore((state) => state.variants)

  const selectedItem = canvasItems.find((item) => item.id === selectedItemId)

  return (
    <div className="w-80 bg-white border-l border-gray-200">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'details'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Item Details
        </button>
        <button
          onClick={() => setActiveTab('variants')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'variants'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Variants ({variants.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'details' ? (
          <div>
            {selectedItem ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Selected Item</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                    {selectedItem.type}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="number"
                        value={Math.round(selectedItem.x)}
                        onChange={(e) =>
                          updateCanvasItem(selectedItem.id, { x: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="X"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={Math.round(selectedItem.y)}
                        onChange={(e) =>
                          updateCanvasItem(selectedItem.id, { y: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Y"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="number"
                        value={Math.round(selectedItem.width)}
                        onChange={(e) =>
                          updateCanvasItem(selectedItem.id, { width: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={Math.round(selectedItem.height)}
                        onChange={(e) =>
                          updateCanvasItem(selectedItem.id, { height: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Height"
                      />
                    </div>
                  </div>
                </div>

                {selectedItem.type === 'rect' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      value={selectedItem.fill || '#3b82f6'}
                      onChange={(e) =>
                        updateCanvasItem(selectedItem.id, { fill: e.target.value })
                      }
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">No item selected</p>
                <p className="text-xs mt-2">Click an item on the canvas to edit</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Design Variants</h3>
            
            {variants.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">No variants yet</p>
                <p className="text-xs mt-2">Generate variants using the toolbar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {variants.map((variant: DesignVariant) => (
                  <div
                    key={variant.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary-400 transition-colors cursor-pointer"
                  >
                    <img
                      src={variant.image_url}
                      alt="Variant"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-xs text-gray-600">
                        {new Date(variant.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

