/**
 * Zustand store for global state management.
 * Manages authentication, projects, canvas state, and history.
 */
import { create } from 'zustand'
import type { User, Project, DesignVariant, CanvasItem } from '../types'

// Auth Store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  
  setUser: (user) => set({ user }),
  
  login: (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    set({ isAuthenticated: true })
  },
  
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, isAuthenticated: false })
  },
}))

// Project Store
interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  setProjects: (projects: Project[]) => void
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateProject: (projectId: number, updates: Partial<Project>) => void
  removeProject: (projectId: number) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  
  setProjects: (projects) => set({ projects }),
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  addProject: (project) => 
    set((state) => ({ projects: [project, ...state.projects] })),
  
  updateProject: (projectId, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, ...updates } : p
      ),
      currentProject:
        state.currentProject?.id === projectId
          ? { ...state.currentProject, ...updates }
          : state.currentProject,
    })),
  
  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
      currentProject:
        state.currentProject?.id === projectId ? null : state.currentProject,
    })),
}))

// Canvas Store
interface CanvasState {
  canvasItems: CanvasItem[]
  selectedItemId: string | null
  backgroundImage: string | null
  history: CanvasItem[][]
  historyIndex: number
  
  setCanvasItems: (items: CanvasItem[]) => void
  addCanvasItem: (item: CanvasItem) => void
  updateCanvasItem: (id: string, updates: Partial<CanvasItem>) => void
  removeCanvasItem: (id: string) => void
  setSelectedItemId: (id: string | null) => void
  setBackgroundImage: (url: string | null) => void
  
  // History management
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvasItems: [],
  selectedItemId: null,
  backgroundImage: null,
  history: [[]],
  historyIndex: 0,
  
  setCanvasItems: (items) => set({ canvasItems: items }),
  
  addCanvasItem: (item) => {
    set((state) => ({ canvasItems: [...state.canvasItems, item] }))
    get().saveToHistory()
  },
  
  updateCanvasItem: (id, updates) => {
    set((state) => ({
      canvasItems: state.canvasItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }))
    get().saveToHistory()
  },
  
  removeCanvasItem: (id) => {
    set((state) => ({
      canvasItems: state.canvasItems.filter((item) => item.id !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    }))
    get().saveToHistory()
  },
  
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  
  setBackgroundImage: (url) => set({ backgroundImage: url }),
  
  saveToHistory: () => {
    const state = get()
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push([...state.canvasItems])
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
        canvasItems: [...state.history[newIndex]],
        historyIndex: newIndex,
      })
    }
  },
  
  redo: () => {
    const state = get()
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1
      set({
        canvasItems: [...state.history[newIndex]],
        historyIndex: newIndex,
      })
    }
  },
  
  canUndo: () => get().historyIndex > 0,
  
  canRedo: () => get().historyIndex < get().history.length - 1,
}))

// Variants Store
interface VariantsState {
  variants: DesignVariant[]
  setVariants: (variants: DesignVariant[]) => void
  addVariant: (variant: DesignVariant) => void
}

export const useVariantsStore = create<VariantsState>((set) => ({
  variants: [],
  
  setVariants: (variants) => set({ variants }),
  
  addVariant: (variant) =>
    set((state) => ({ variants: [...state.variants, variant] })),
}))

