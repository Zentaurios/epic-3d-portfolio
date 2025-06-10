import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// Animation constants for 3D scene
export const CAMERA_CONFIGS = {
  HOME: {
    position: [0, 0, 10] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
  BLOG: {
    position: [15, 5, 8] as [number, number, number],
    target: [10, 0, 0] as [number, number, number],
  },
  EXPLORE: {
    position: [-10, 8, 12] as [number, number, number],
    target: [-5, 0, 0] as [number, number, number],
  },
  PROJECT: {
    position: [5, -8, 15] as [number, number, number],
    target: [0, -5, 0] as [number, number, number],
  },
} as const

// Brain Universe Camera Configurations
export const BRAIN_CAMERA_CONFIGS = {
  consciousness: {
    basePosition: [0, 5, 25] as [number, number, number],
    movement: { x: 0.3, y: 0.2, z: 0.1 },
    lookAt: [0, 0, 0] as [number, number, number],
    fov: 75
  },
  memory: {
    basePosition: [15, 8, 20] as [number, number, number],
    movement: { x: 0.2, y: 0.4, z: 0.2 },
    lookAt: [5, 2, 0] as [number, number, number],
    fov: 70
  },
  creativity: {
    basePosition: [-12, 10, 22] as [number, number, number],
    movement: { x: 0.5, y: 0.3, z: 0.3 },
    lookAt: [-3, 3, 0] as [number, number, number],
    fov: 80
  },
  logic: {
    basePosition: [8, -5, 18] as [number, number, number],
    movement: { x: 0.1, y: 0.1, z: 0.1 },
    lookAt: [0, -2, 0] as [number, number, number],
    fov: 65
  }
} as const

// Modern theme colors - muted and sophisticated
export const MODERN_COLORS = {
  primary: '#475569', // Slate 600
  secondary: '#64748b', // Slate 500
  accent: '#334155', // Slate 700
  highlight: '#0f172a', // Slate 900
  dark: '#0f172a', // Slate 900
  darker: '#020617', // Slate 950
  subtle: '#1e293b', // Slate 800
  muted: '#374151', // Gray 700
} as const

// Brain Region Colors
export const BRAIN_COLORS = {
  consciousness: {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#93c5fd'
  },
  memory: {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#c4b5fd'
  },
  creativity: {
    primary: '#06b6d4',
    secondary: '#22d3ee',
    accent: '#67e8f9'
  },
  logic: {
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#6ee7b7'
  }
} as const

// Legacy colors for backwards compatibility
export const GALAXY_COLORS = MODERN_COLORS

// Performance settings
export const PERFORMANCE = {
  maxParticles: 2000,
  particleSize: 0.02,
  animationSpeed: 0.01,
  lod: {
    high: 50,
    medium: 25,
    low: 10,
  },
} as const

// Smooth scrolling configuration
export const SCROLL_CONFIG = {
  duration: 1.2,
  easing: [0.25, 0.46, 0.45, 0.94],
} as const

// Type definition for the global lenis instance we use
interface GlobalLenis {
  scrollTo: (target: number | string | HTMLElement, options?: { 
    immediate?: boolean
    duration?: number
    easing?: (t: number) => number
    offset?: number
  }) => void
  resize: () => void
  scroll: number
  limit: number
}

// Helper function to get the lenis instance with proper typing
const getLenis = (): GlobalLenis | null => {
  return (window as Window & { lenis?: GlobalLenis }).lenis || null
}

// Universal scroll utilities that work with both Lenis (desktop) and native (mobile)
export const scrollUtils = {
  // Universal scroll to any target - works on both mobile and desktop
  scrollTo: (target: string | HTMLElement | number, options?: {
    offset?: number
    duration?: number
    immediate?: boolean
  }) => {
    const { offset = 0, duration = 1.2, immediate = false } = options || {}
    const lenis = getLenis()

    if (lenis && typeof lenis.scrollTo === 'function') {
      // Use Lenis for desktop smooth scrolling
      lenis.scrollTo(target, {
        offset: -offset,
        duration: immediate ? 0 : duration,
        immediate
      })
    } else {
      // Use native scrolling for mobile or fallback
      let targetElement: HTMLElement | null = null
      let scrollPosition = 0

      if (typeof target === 'string') {
        // Handle anchor links (#id) or query selectors
        targetElement = target.startsWith('#') 
          ? document.getElementById(target.slice(1))
          : document.querySelector(target)
      } else if (target instanceof HTMLElement) {
        targetElement = target
      } else if (typeof target === 'number') {
        scrollPosition = target
      }

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        scrollPosition = window.scrollY + rect.top - offset
      }

      // Use native smooth scrolling
      window.scrollTo({
        top: scrollPosition,
        behavior: immediate ? 'auto' : 'smooth'
      })
    }
  },

  // Scroll to top - universal
  scrollToTop: (immediate = false) => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate })
    } else {
      window.scrollTo({
        top: 0,
        behavior: immediate ? 'auto' : 'smooth'
      })
    }
  },

  // Force Lenis to recalculate scroll height
  refreshLenisHeight: () => {
    const lenis = getLenis()
    if (lenis) {
      // Multiple resize calls to ensure proper height calculation
      lenis.resize()
      setTimeout(() => lenis.resize(), 100)
      setTimeout(() => lenis.resize(), 300)
      setTimeout(() => lenis.resize(), 500)
    }
  },

  // Scroll to bottom with proper height calculation - works on both mobile and desktop
  scrollToBottom: (immediate = false) => {
    const lenis = getLenis()
    if (lenis) {
      // First refresh height
      lenis.resize()
      
      setTimeout(() => {
        const actualHeight = document.documentElement.scrollHeight
        const viewportHeight = window.innerHeight
        const maxScroll = actualHeight - viewportHeight
        
        lenis.scrollTo(maxScroll, { 
          immediate,
          duration: immediate ? 0 : 1.5,
          easing: (t: number) => 1 - Math.pow(1 - t, 3)
        })
      }, 100)
    } else {
      // Fallback to native scroll (mobile)
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({
        top: maxScroll,
        behavior: immediate ? 'auto' : 'smooth'
      })
    }
  },

  // Check if we can scroll further down
  canScrollDown: () => {
    const lenis = getLenis()
    if (lenis) {
      const { scroll, limit } = lenis
      return scroll < limit - 10 // 10px tolerance
    }
    
    // Fallback check for native scroll
    return window.scrollY < document.documentElement.scrollHeight - window.innerHeight - 10
  },

  // Get actual scroll progress (0 to 1)
  getScrollProgress: () => {
    const lenis = getLenis()
    if (lenis) {
      const { scroll, limit } = lenis
      return limit > 0 ? Math.min(scroll / limit, 1) : 0
    }
    
    // Fallback calculation for native scroll
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    return maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0
  },

  // React hook for components
  useScrollUtils: () => {
    return {
      scrollTo: scrollUtils.scrollTo,
      scrollToTop: scrollUtils.scrollToTop,
      scrollToBottom: scrollUtils.scrollToBottom,
      refreshHeight: scrollUtils.refreshLenisHeight,
      canScrollDown: scrollUtils.canScrollDown,
      getProgress: scrollUtils.getScrollProgress,
    }
  }
}
