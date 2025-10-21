/**
 * Zustand store for 3D scene state management.
 * Handles scene items, selection, and background image.
 */
import { create } from 'zustand'

export interface SceneItem {
  id: string
  name: string
  category: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
}

export interface SceneState {
  items: SceneItem[]
  selectedItemId: string | null
  backgroundImageUrl: string | null
  isTransforming: boolean // Track if we're currently transforming an item
  
  // Item operations
  addItem: (item: SceneItem) => void
  updateItem: (id: string, updates: Partial<SceneItem>) => void
  deleteItem: (id: string) => void
  selectItem: (id: string | null) => void
  
  // Background
  setBackgroundImage: (url: string | null) => void
  
  // Transform controls
  setTransforming: (isTransforming: boolean) => void
  
  // History (for undo/redo)
  history: SceneItem[][]
  historyIndex: number
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export const useSceneStore = create<SceneState>((set, get) => ({
  items: [],
  selectedItemId: null,
  backgroundImageUrl: null,
  isTransforming: false,
  history: [[]],
  historyIndex: 0,
  
  addItem: (item) => {
    set((state) => ({ items: [...state.items, item] }))
    get().saveToHistory()
  },
  
  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }))
    get().saveToHistory()
  },
  
  deleteItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    }))
    get().saveToHistory()
  },
  
  selectItem: (id) => set({ selectedItemId: id }),
  
  setBackgroundImage: (url) => set({ backgroundImageUrl: url }),
  
  setTransforming: (isTransforming) => set({ isTransforming }),
  
  saveToHistory: () => {
    const state = get()
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push([...state.items])
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },
  
  undo: () => {
    const state = get()
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1
      set({
        items: [...state.history[newIndex]],
        historyIndex: newIndex,
      })
    }
  },
  
  redo: () => {
    const state = get()
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1
      set({
        items: [...state.history[newIndex]],
        historyIndex: newIndex,
      })
    }
  },
  
  canUndo: () => get().historyIndex > 0,
  
  canRedo: () => get().historyIndex < get().history.length - 1,
}))

// Mock product catalog data
export const MOCK_PRODUCTS = [
  // Sofas
  { id: 'sofa-1', name: 'Modern Sectional', category: 'Sofas', color: '#8B7355' },
  { id: 'sofa-2', name: 'Classic Loveseat', category: 'Sofas', color: '#A0826D' },
  { id: 'sofa-3', name: 'Minimalist Couch', category: 'Sofas', color: '#C4A582' },
  
  // Chairs
  { id: 'chair-1', name: 'Accent Chair', category: 'Chairs', color: '#6B8E23' },
  { id: 'chair-2', name: 'Dining Chair', category: 'Chairs', color: '#8FBC8F' },
  { id: 'chair-3', name: 'Office Chair', category: 'Chairs', color: '#2F4F2F' },
  
  // Tables
  { id: 'table-1', name: 'Coffee Table', category: 'Tables', color: '#8B4513' },
  { id: 'table-2', name: 'Dining Table', category: 'Tables', color: '#A0522D' },
  { id: 'table-3', name: 'Side Table', category: 'Tables', color: '#D2691E' },
  
  // Lamps
  { id: 'lamp-1', name: 'Floor Lamp', category: 'Lamps', color: '#FFD700' },
  { id: 'lamp-2', name: 'Table Lamp', category: 'Lamps', color: '#FFA500' },
  { id: 'lamp-3', name: 'Pendant Light', category: 'Lamps', color: '#FF8C00' },
  
  // Rugs
  { id: 'rug-1', name: 'Persian Rug', category: 'Rugs', color: '#8B0000' },
  { id: 'rug-2', name: 'Modern Rug', category: 'Rugs', color: '#696969' },
  { id: 'rug-3', name: 'Shag Rug', category: 'Rugs', color: '#F5F5DC' },
]

export type Product = typeof MOCK_PRODUCTS[0]
