/**
 * TypeScript type definitions for DreamSpace.
 */

export interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
}

export interface Project {
  id: number
  name: string
  owner: number
  owner_username: string
  images: ProjectImage[]
  variants: DesignVariant[]
  versions: Version[]
  created_at: string
  updated_at: string
}

export interface ProjectImage {
  id: number
  project: number
  type: 'original' | 'inspo' | 'generated'
  image_url: string
  metadata: Record<string, any>
  created_at: string
}

export interface DesignVariant {
  id: number
  project: number
  image_url: string
  metadata: Record<string, any>
  items: ItemInstance[]
  created_at: string
}

export interface ItemInstance {
  id: number
  variant: number
  name: string
  category: string
  bbox: {
    x: number
    y: number
    width: number
    height: number
  }
  mask_url?: string
  transform: {
    x?: number
    y?: number
    rotation?: number
    scaleX?: number
    scaleY?: number
  }
  created_at: string
}

export interface Version {
  id: number
  project: number
  snapshot: Record<string, any>
  prompt: string
  created_at: string
}

export interface CanvasItem {
  id: string
  type: 'image' | 'rect' | 'text'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
  url?: string
  fill?: string
  text?: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password2: string
  first_name?: string
  last_name?: string
}

