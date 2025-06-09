'use client'

import { useState, useCallback, useEffect } from 'react'
import { useLenisScroll } from './useLenisScroll'
import { useNavigationManager } from './useNavigationManager'
import type { SceneState } from '@/types'
import { CAMERA_CONFIGS } from '@/lib/utils/constants'

export function use3DScene() {
  
  // Use the new navigation manager for brain regions
  const { navigationState, navigateWithTransition, getTransitionProps } = useNavigationManager({
    onRegionChange: () => {
      // Handle region change
    }
  })
  
  const [sceneState, setSceneState] = useState<SceneState>({
    currentSection: 'home',
    isTransitioning: navigationState.isTransitioning,
    targetCamera: {
      position: CAMERA_CONFIGS.HOME.position,
      target: CAMERA_CONFIGS.HOME.target,
    },
  })

  // Initialize Lenis scroll integration
  const { scrollToSection } = useLenisScroll({
    onSectionChange: (section) => {
      // Update active section when scrolling
      setSceneState(prev => ({
        ...prev,
        currentSection: section as SceneState['currentSection'],
      }))
    }
  })
  
  // Update scene state based on navigation manager
  useEffect(() => {
    const transitionProps = getTransitionProps()
    
    setSceneState(prev => ({
      ...prev,
      isTransitioning: transitionProps.isTransitioning,
      currentSection: transitionProps.region as SceneState['currentSection'],
    }))
  }, [navigationState, getTransitionProps])
  
  // Navigate to a section with brain transition
  const navigateToSection = useCallback((section: string) => {
    // Route mapping
    const routeMap: Record<string, string> = {
      home: '/',
      blog: '/blog',
      explore: '/explore',
      projects: '/explore',
      about: '/#about',
    }
    
    const route = routeMap[section] || '/'
    
    // Use brain-aware navigation
    navigateWithTransition(route, {
      transitionType: 'neural-pulse',
      intensity: 1.2
    })
  }, [navigateWithTransition])

  return {
    sceneState,
    navigateToSection,
    scrollToSection,
    navigationState,
    getTransitionProps,
    setIsTransitioning: (isTransitioning: boolean) => {
      setSceneState(prev => ({ ...prev, isTransitioning }))
    },
  }
}// Hook for managing performance settings based on device capabilities
export function usePerformanceSettings() {
  const [settings, setSettings] = useState({
    enableParticles: true,
    particleCount: 2000,
    enablePostProcessing: true,
    shadowQuality: 'medium' as 'high' | 'medium' | 'low',
    antialias: true,
  })
  
  useEffect(() => {
    // Detect device capabilities and adjust settings
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    
    if (gl) {
      const renderer = gl.getParameter(gl.RENDERER)
      const isLowEnd = /Intel|PowerVR|Mali|Adreno/.test(renderer)
      
      if (isLowEnd) {
        setSettings({
          enableParticles: true,
          particleCount: 1000,
          enablePostProcessing: false,
          shadowQuality: 'low',
          antialias: false,
        })
      }
    }
    
    // Adjust based on memory and CPU
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      setSettings(prev => ({
        ...prev,
        particleCount: Math.min(prev.particleCount, 800),
        enablePostProcessing: false,
      }))
    }
  }, [])
  
  return { settings, updateSettings: setSettings }
}// Hook for viewport and scroll position tracking
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    scrollY: 0,
    isScrolling: false,
  })
  
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    
    const handleResize = () => {
      setViewport(prev => ({
        ...prev,
        width: window.innerWidth,
        height: window.innerHeight,
      }))
    }
    
    const handleScroll = () => {
      setViewport(prev => ({
        ...prev,
        scrollY: window.scrollY,
        isScrolling: true,
      }))
      
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setViewport(prev => ({
          ...prev,
          isScrolling: false,
        }))
      }, 150)
    }
    
    // Initial values
    handleResize()
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])
  
  return viewport
}