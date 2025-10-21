/**
 * Product catalog panel for selecting and adding items to the 3D scene.
 */
import { useState } from 'react'
import { useSceneStore, MOCK_PRODUCTS, type Product } from '../../store/useSceneStore'

interface CatalogPanelProps {
  onItemAdd?: () => void
}

export default function CatalogPanel({ onItemAdd }: CatalogPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const { addItem } = useSceneStore()

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))]

  // Filter products by category
  const filteredProducts = selectedCategory === 'All' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === selectedCategory)

  // Handle adding item to scene with better default positioning
  const handleAddItem = (product: Product) => {
    // Get existing items to avoid overlap
    const existingItems = useSceneStore.getState().items
    const itemCount = existingItems.length
    
    // Place items in a grid pattern to avoid overlap
    const gridSize = Math.ceil(Math.sqrt(itemCount + 1))
    const x = (itemCount % gridSize) * 2 - (gridSize - 1)
    const z = Math.floor(itemCount / gridSize) * 2 - (gridSize - 1)
    
    const newItem = {
      id: `${product.id}-${Date.now()}`,
      name: product.name,
      category: product.category,
      position: [x, 0, z] as [number, number, number], // Better default position
      rotation: [0, 0, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
      color: product.color,
    }
    
    addItem(newItem)
    onItemAdd?.()
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Product Catalog</h2>

      {/* Category filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Products list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="p-3 border border-gray-200 rounded-lg hover:border-primary-400 transition-colors cursor-pointer"
            onClick={() => handleAddItem(product)}
          >
            <div className="flex items-center gap-3">
              {/* Color preview */}
              <div
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: product.color }}
              />
              
              {/* Product info */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
              
              {/* Add button */}
              <button className="text-primary-600 hover:text-primary-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">💡 Quick Tips</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Click any item above to add it to your room</li>
          <li>• Click on items in the scene to select them</li>
          <li>• Drag the blue arrows to move selected items</li>
          <li>• Use mouse to look around the room</li>
          <li>• Right panel shows item details when selected</li>
        </ul>
      </div>
    </div>
  )
}
