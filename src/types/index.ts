import React from 'react'

// 3D Scene Types
export interface SceneState {
  currentSection: 'home' | 'blog' | 'explore' | 'project' | 'consciousness' | 'memory' | 'creativity' | 'logic'
  isTransitioning: boolean
  targetCamera: {
    position: [number, number, number]
    target: [number, number, number]
  }
}

// Brain Universe Types
export interface BrainRegion {
  name: 'consciousness' | 'memory' | 'creativity' | 'logic'
  routes: string[]
  primaryColor: string
  secondaryColor: string
  accentColor: string
  neuronDensity: number
  synapticActivity: number
  thoughtFlow: 'vertical' | 'spiral' | 'radial' | 'waves'
}

export interface NavigationState {
  currentRoute: string
  previousRoute: string
  isTransitioning: boolean
  transitionProgress: number
  brainRegion: 'consciousness' | 'memory' | 'creativity' | 'logic'
}

export interface BrainActivity {
  neural: number
  synaptic: number
  cognitive: number
}

// Sanity Block Content Type
export interface SanityBlock {
  _type: string
  _key: string
  children?: Array<{
    _type: string
    _key: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: string
    _key: string
    href?: string
  }>
  style?: string
  level?: number
}

// Sanity Image Types
export interface SanityImage {
  asset: {
    _id: string
    url: string
  }
  alt?: string
  caption?: string
}

// Author Types
export interface Author {
  _id: string
  name: string
  slug: {
    current: string
  }
  image?: SanityImage
  bio?: SanityBlock[] // Block content
  email?: string
  website?: string
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
    discord?: string
  }
  expertise?: string[]
}

// Category Types
export interface Category {
  _id: string
  title: string
  slug: {
    current: string
  }
  description?: string
  color: string
  icon?: string
}

// Blog Post Types
export interface BlogPost {
  _id: string
  _updatedAt?: string
  title: string
  slug: {
    current: string
  }
  excerpt: string
  publishedAt: string
  estimatedReadTime: number
  featured: boolean
  body?: SanityBlock[] // Block content
  author: Author
  categories: Category[]
  mainImage?: SanityImage
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

// Project Types
export interface Project {
  _id: string
  title: string
  slug: {
    current: string
  }
  description: string
  longDescription?: SanityBlock[] // Block content
  category: Category
  technologies: string[]
  status: 'live' | 'beta' | 'development' | 'archived'
  featured: boolean
  priority: number
  links?: {
    github?: string
    live?: string
    demo?: string
    docs?: string
  }
  metrics?: {
    users?: string
    performance?: string
    value?: string
  }
  highlights?: string[]
  challenges?: Array<{
    challenge: string
    solution: string
  }>
  mainImage?: SanityImage
  gallery?: SanityImage[]
  completedAt?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

// Site Settings Types
export interface SiteSettings {
  title: string
  description: string
  keywords?: string[]
  logo?: SanityImage
  socialImage?: SanityImage
  author?: Author
  contact?: {
    email?: string
    phone?: string
    address?: string
  }
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
    discord?: string
    youtube?: string
  }
  analytics?: {
    googleAnalyticsId?: string
    gtmId?: string
  }
  features?: {
    enableBlog?: boolean
    enableProjects?: boolean
    enableNewsletter?: boolean
    enableComments?: boolean
  }
}

// Component Props Types
export interface NavigationProps {
  onNavigate: (section: string) => void
}

export interface BlogGridProps {
  posts?: BlogPost[]
  categories?: Category[]
}

export interface ProjectGridProps {
  projects?: Project[]
  categories?: Category[]
}

// Form Types
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface NewsletterForm {
  email: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

// Search and Filter Types
export interface SearchFilters {
  query: string
  category: string
  sortBy: 'newest' | 'oldest' | 'longest' | 'shortest'
}

export interface ProjectFilters {
  category: string
  status: string
  technology: string
}

// Tech Stack Types
export interface Technology {
  name: string
  level: number
  experience: string
}

export interface TechCategory {
  id: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> // Lucide icon component
  color: string
  technologies: Technology[]
}

// Animation Types
export interface AnimationConfig {
  duration: number
  ease: string
  delay?: number
}

// Theme Types
export interface ThemeColors {
  purple: string
  cyan: string
  amber: string
  emerald: string
  blue: string
  red: string
}

// AI Agent Types
export interface AIMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
  isThinking?: boolean
  isNavigating?: boolean
}

export interface AIContextInfo {
  currentSection: string
  currentPage: string
  scrollPosition: number
  availableSections: string[]
}

export interface AIAgentResponse {
  content: string
  isNavigating?: boolean
  action?: () => void
}

export interface AIAgentContextType {
  isOpen: boolean
  contextInfo: AIContextInfo
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  updateContext: (info: Partial<AIContextInfo>) => void
}

// Search Result Types for AI Agent
export interface SearchResult {
  type: 'post' | 'project'
  item: BlogPost | Project
}

export interface ConversationState {
  isWaitingForSelection: boolean
  searchResults: SearchResult[]
  lastQuery: string
}

// Global type extensions
declare global {
  interface Navigator {
    deviceMemory?: number
  }
  
  interface Window {
    lenis?: {
      scrollTo: (target: number | string | HTMLElement, options?: {
        duration?: number
        easing?: (t: number) => number
        offset?: number
        immediate?: boolean
      }) => void
      on: (event: string, callback: (...args: unknown[]) => void) => void
      off: (event: string, callback: (...args: unknown[]) => void) => void
      destroy: () => void
    }
  }
}
