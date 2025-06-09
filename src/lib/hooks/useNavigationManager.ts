'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useScrollProgress } from './useScrollProgress'

export interface NavigationState {
  currentRoute: string
  previousRoute: string
  isTransitioning: boolean
  transitionProgress: number
  brainRegion: 'consciousness' | 'memory' | 'creativity' | 'logic'
}

interface UseNavigationManagerOptions {
  transitionDuration?: number
  onRegionChange?: (region: string) => void
}

export function useNavigationManager({ 
  transitionDuration = 1500,
  onRegionChange 
}: UseNavigationManagerOptions = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const { scrollProgress } = useScrollProgress()
  
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentRoute: pathname,
    previousRoute: '',
    isTransitioning: false,
    transitionProgress: 0,
    brainRegion: 'consciousness'
  })
  
  // Determine brain region from route
  const getBrainRegion = useCallback((route: string): NavigationState['brainRegion'] => {
    if (route === '/') return 'consciousness'
    if (route === '/blog') return 'memory'
    if (route.startsWith('/blog/')) return 'logic' // Individual blog posts
    if (route === '/explore') return 'creativity'
    if (route.startsWith('/explore/')) return 'logic' // Individual projects
    return 'consciousness'
  }, [])
  
  // Handle route changes
  useEffect(() => {
    const newRegion = getBrainRegion(pathname)
    const oldRegion = navigationState.brainRegion
    
    if (pathname !== navigationState.currentRoute) {
      // Start transition
      setNavigationState(prev => ({
        ...prev,
        previousRoute: prev.currentRoute,
        currentRoute: pathname,
        isTransitioning: true,
        transitionProgress: 0,
        brainRegion: newRegion
      }))
      
      // Notify region change
      if (newRegion !== oldRegion) {
        onRegionChange?.(newRegion)
      }
      
      // Animate transition
      let startTime: number
      
      const animateTransition = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / transitionDuration, 1)
        
        setNavigationState(prev => ({
          ...prev,
          transitionProgress: progress
        }))
        
        if (progress < 1) {
          requestAnimationFrame(animateTransition)
        } else {
          // End transition
          setNavigationState(prev => ({
            ...prev,
            isTransitioning: false,
            transitionProgress: 1,
            previousRoute: ''
          }))
        }
      }
      
      requestAnimationFrame(animateTransition)
    }
  }, [pathname, navigationState.currentRoute, navigationState.brainRegion, getBrainRegion, onRegionChange, transitionDuration])
  
  // Enhanced navigation function with brain transition effects
  const navigateWithTransition = useCallback((route: string, options?: {
    transitionType?: 'neural-pulse' | 'synaptic-fire' | 'thought-flow' | 'memory-dive'
    intensity?: number
  }) => {
    const { transitionType = 'neural-pulse', intensity = 1 } = options || {}
    
    // Pre-transition effects based on type
    setNavigationState(prev => ({
      ...prev,
      isTransitioning: true,
      transitionProgress: 0
    }))
    
    // Apply transition effects based on type and intensity
    const transitionDelay = transitionType === 'memory-dive' ? 300 : 
                           transitionType === 'thought-flow' ? 250 :
                           transitionType === 'synaptic-fire' ? 150 : 200
    
    // Scale delay by intensity
    const adjustedDelay = transitionDelay * intensity
    
    // Delay actual navigation to allow for effect buildup
    setTimeout(() => {
      router.push(route)
    }, adjustedDelay)
    
  }, [router])
  
  // Get transition properties for 3D effects
  const getTransitionProps = useCallback(() => {
    const { isTransitioning, transitionProgress, brainRegion, currentRoute } = navigationState
    
    return {
      isTransitioning,
      progress: transitionProgress,
      region: brainRegion,
      route: currentRoute,
      scrollProgress,
      // Easing function for smooth transitions
      easedProgress: isTransitioning 
        ? 1 - Math.pow(1 - transitionProgress, 3) // Cubic ease-out
        : 1
    }
  }, [navigationState, scrollProgress])
  
  return {
    navigationState,
    navigateWithTransition,
    getTransitionProps,
    currentRegion: navigationState.brainRegion,
    isTransitioning: navigationState.isTransitioning
  }
}

// Hook for section-based navigation within pages
export function useSectionNavigation() {
  const [activeSection, setActiveSection] = useState('hero')
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({})
  
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]')
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section') || ''
          
          if (entry.isIntersecting) {
            setActiveSection(sectionId)
          }
          
          // Calculate section progress for 3D effects
          const rect = entry.boundingClientRect
          const progress = Math.max(0, Math.min(1, 
            (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
          ))
          
          setSectionProgress(prev => ({
            ...prev,
            [sectionId]: progress
          }))
        })
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -10% 0px'
      }
    )
    
    sections.forEach(section => observer.observe(section))
    
    return () => observer.disconnect()
  }, [])
  
  return {
    activeSection,
    sectionProgress,
    getSectionProgress: (sectionId: string) => sectionProgress[sectionId] || 0
  }
}

// Brain activity intensity based on user interaction
export function useBrainActivity() {
  const [activity, setActivity] = useState({
    neural: 0.5,
    synaptic: 0.3,
    cognitive: 0.4
  })
  
  useEffect(() => {
    let mouseMovements = 0
    let keyPresses = 0
    let scrollEvents = 0
    
    const resetCounts = () => {
      mouseMovements = 0
      keyPresses = 0
      scrollEvents = 0
    }
    
    const updateActivity = () => {
      // Calculate activity based on recent interactions
      const neuralActivity = Math.min(1, (mouseMovements + keyPresses) / 20)
      const synapticActivity = Math.min(1, scrollEvents / 10)
      const cognitiveActivity = Math.min(1, (neuralActivity + synapticActivity) / 2)
      
      setActivity({
        neural: neuralActivity * 0.7 + 0.3, // Base activity + interaction
        synaptic: synapticActivity * 0.8 + 0.2,
        cognitive: cognitiveActivity * 0.6 + 0.4
      })
      
      resetCounts()
    }
    
    const handleMouseMove = () => {
      mouseMovements++
    }
    
    const handleKeyPress = () => {
      keyPresses++
    }
    
    const handleScroll = () => {
      scrollEvents++
    }
    
    // Update activity every 2 seconds
    const activityInterval = setInterval(updateActivity, 2000)
    
    // Listen to interactions
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      clearInterval(activityInterval)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  return activity
}