/**
 * Properties panel for editing selected scene items.
 */
import { useState } from 'react'
import { useSceneStore, MOCK_PRODUCTS, type Product } from '../../store/useSceneStore'

interface PropertiesPanelProps {
  onItemSwap?: () => void
}

export default function PropertiesPanel({ onItemSwap }: PropertiesPanelProps) {
  const { items, selectedItemId, updateItem, deleteItem, selectItem } = useSceneStore()
  const [showSwapCatalog, setShowSwapCatalog] = useState(false)

  const selectedItem = items.find(item => item.id === selectedItemId)

  // Handle item property updates
  const handlePropertyUpdate = (field: string, value: any) => {
    if (!selectedItem) return
    updateItem(selectedItem.id, { [field]: value })
  }

  // Handle position updates specifically
  const handlePositionUpdate = (newPosition: [number, number, number]) => {
    if (!selectedItem) return
    updateItem(selectedItem.id, { position: newPosition })
  }

  // Handle item swap
  const handleSwapItem = (product: Product) => {
    if (!selectedItem) return
    
    updateItem(selectedItem.id, {
      name: product.name,
      category: product.category,
      color: product.color,
    })
    
    setShowSwapCatalog(false)
    onItemSwap?.()
  }

  // Get products in the same category for swapping
  const swapProducts = selectedItem 
    ? MOCK_PRODUCTS.filter(p => p.category === selectedItem.category)
    : []

  if (!selectedItem) {
    return (
      <div className="w-80 bg-white border-l border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Item Properties</h2>
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No item selected</p>
            <p className="text-xs mt-2">Click an item in the scene to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Item Properties</h2>

        {!showSwapCatalog ? (
          <div className="space-y-4">
            {/* Item name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={selectedItem.name}
                onChange={(e) => handlePropertyUpdate('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedItem.category}
                onChange={(e) => handlePropertyUpdate('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Sofas">Sofas</option>
                <option value="Chairs">Chairs</option>
                <option value="Tables">Tables</option>
                <option value="Lamps">Lamps</option>
                <option value="Rugs">Rugs</option>
                <option value="Decor">Decor</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedItem.color}
                  onChange={(e) => handlePropertyUpdate('color', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedItem.color}
                  onChange={(e) => handlePropertyUpdate('color', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Position with movement controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500">X</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handlePositionUpdate([selectedItem.position[0] - 0.5, selectedItem.position[1], selectedItem.position[2]])}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                    >
                      ←
                    </button>
                    <input
                      type="number"
                      value={selectedItem.position[0].toFixed(1)}
                      readOnly
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50 text-center"
                    />
                    <button
                      onClick={() => handlePositionUpdate([selectedItem.position[0] + 0.5, selectedItem.position[1], selectedItem.position[2]])}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                    >
                      →
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Y</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handlePositionUpdate([selectedItem.position[0], selectedItem.position[1] - 0.5, selectedItem.position[2]])}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                    >
                      ↓
                    </button>
                    <input
                      type="number"
                      value={selectedItem.position[1].toFixed(1)}
                      readOnly
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50 text-center"
                    />
                    <button
                      onClick={() => handlePositionUpdate([selectedItem.position[0], selectedItem.position[1] + 0.5, selectedItem.position[2]])}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                    >
                      ↑
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Z</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handlePositionUpdate([selectedItem.position[0], selectedItem.position[1], selectedItem.position[2] - 0.5])}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                    >
                      ←
                    </button>
                    <input
                      type="number"
                      value={selectedItem.position[2].toFixed(1)}
                      readOnly
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50 text-center"
                    />
                    <button
                      onClick={() => handlePositionUpdate([selectedItem.position[0], selectedItem.position[1], selectedItem.position[2] + 0.5])}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Rotation (read-only for now) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rotation
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500">X</label>
                  <input
                    type="number"
                    value={(selectedItem.rotation[0] * 180 / Math.PI).toFixed(1)}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Y</label>
                  <input
                    type="number"
                    value={(selectedItem.rotation[1] * 180 / Math.PI).toFixed(1)}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Z</label>
                  <input
                    type="number"
                    value={(selectedItem.rotation[2] * 180 / Math.PI).toFixed(1)}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Scale (read-only for now) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scale
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500">X</label>
                  <input
                    type="number"
                    value={selectedItem.scale[0].toFixed(2)}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Y</label>
                  <input
                    type="number"
                    value={selectedItem.scale[1].toFixed(2)}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Z</label>
                  <input
                    type="number"
                    value={selectedItem.scale[2].toFixed(2)}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowSwapCatalog(true)}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Swap Item
              </button>
              <button
                onClick={() => {
                  deleteItem(selectedItem.id)
                  selectItem(null)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Swap with {selectedItem.category}</h3>
              <button
                onClick={() => setShowSwapCatalog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {swapProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-primary-400 transition-colors cursor-pointer"
                  onClick={() => handleSwapItem(product)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: product.color }}
                    />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
