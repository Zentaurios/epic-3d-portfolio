'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseScrollProgressOptions {
  smoothing?: number
  onProgress?: (progress: number) => void
}

export function useScrollProgress({ onProgress }: UseScrollProgressOptions = {}) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [isScrolling, setIsScrolling] = useState(false)
  
  // Use refs to prevent unnecessary re-renders and track previous values
  const onProgressRef = useRef(onProgress)
  const lastScrollYRef = useRef(0)
  const lastDirectionRef = useRef<'up' | 'down'>('down')
  const lastProgressRef = useRef(0)
  
  onProgressRef.current = onProgress
  
  useEffect(() => {
    let scrollTimeoutId: NodeJS.Timeout
    let targetProgress = 0
    
    const updateScrollProgress = () => {
      // Use Lenis scroll value if available, fallback to native scroll
      const lenis = (window as { lenis?: { 
        scroll: number; 
        on: (event: string, callback: () => void) => void; 
        off: (event: string, callback: () => void) => void 
      } }).lenis
      const scrollY = lenis ? lenis.scroll : window.scrollY
      
      // Get proper document height
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )
      
      const windowHeight = window.innerHeight
      const maxScroll = documentHeight - windowHeight
      
      // Calculate normalized scroll progress (0 to 1)
      targetProgress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0
      
      // Determine scroll direction with tolerance and only update if changed
      const scrollDiff = scrollY - lastScrollYRef.current
      if (Math.abs(scrollDiff) > 2) { // Increased tolerance to prevent excessive updates
        const newDirection = scrollDiff > 0 ? 'down' : 'up'
        if (newDirection !== lastDirectionRef.current) {
          setScrollDirection(newDirection)
          lastDirectionRef.current = newDirection
        }
        lastScrollYRef.current = scrollY
      }
      
      setIsScrolling(true)
      
      // Only update progress if it has changed significantly
      if (Math.abs(targetProgress - lastProgressRef.current) > 0.001) {
        setScrollProgress(targetProgress)
        lastProgressRef.current = targetProgress
        onProgressRef.current?.(targetProgress)
      }
      
      // Clear existing timeout
      clearTimeout(scrollTimeoutId)
      
      // Set timeout to detect when scrolling stops
      scrollTimeoutId = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }
    
    // Listen to both Lenis and native scroll events
    const lenis = (window as { lenis?: { 
      scroll: number; 
      on: (event: string, callback: () => void) => void; 
      off: (event: string, callback: () => void) => void 
    } }).lenis
    
    if (lenis) {
      // Use Lenis scroll events for smooth scrolling
      lenis.on('scroll', updateScrollProgress)
    } else {
      // Fallback to native scroll events
      window.addEventListener('scroll', updateScrollProgress, { passive: true })
    }
    
    // Initial calculation
    updateScrollProgress()
    
    return () => {
      if (lenis) {
        lenis.off('scroll', updateScrollProgress)
      } else {
        window.removeEventListener('scroll', updateScrollProgress)
      }
      clearTimeout(scrollTimeoutId)
    }
  }, []) // Empty dependency array - everything is handled via refs or is stable
  
  return {
    scrollProgress,
    scrollDirection,
    isScrolling,
  }
}

interface UseScrollSectionsOptions {
  sections: string[]
  threshold?: number
  rootMargin?: string
}

export function useScrollSections({ 
  sections, 
  threshold = 0.5, 
  rootMargin = '0px 0px -20% 0px' 
}: UseScrollSectionsOptions) {
  const [activeSection, setActiveSection] = useState(sections[0] || '')
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({})
  
  useEffect(() => {
    const sectionElements = sections
      .map(section => document.getElementById(section))
      .filter(Boolean) as HTMLElement[]
    
    if (sectionElements.length === 0) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id
          
          if (entry.isIntersecting) {
            setActiveSection(sectionId)
          }
          
          // Calculate section progress
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
        threshold,
        rootMargin
      }
    )
    
    sectionElements.forEach(element => observer.observe(element))
    
    return () => observer.disconnect()
  }, [sections, threshold, rootMargin])
  
  return {
    activeSection,
    sectionProgress,
  }
}

// Advanced scroll physics hook for enhanced scroll interactions
export function useScrollPhysics() {
  const [velocity, setVelocity] = useState(0)
  const [acceleration, setAcceleration] = useState(0)
  
  useEffect(() => {
    let lastScrollY = window.scrollY
    let lastTimestamp = Date.now()
    let lastVelocity = 0
    
    const updatePhysics = () => {
      const currentScrollY = window.scrollY
      const currentTimestamp = Date.now()
      
      const deltaY = currentScrollY - lastScrollY
      const deltaTime = currentTimestamp - lastTimestamp
      
      if (deltaTime > 0) {
        const currentVelocity = deltaY / deltaTime
        const currentAcceleration = (currentVelocity - lastVelocity) / deltaTime
        
        setVelocity(currentVelocity)
        setAcceleration(currentAcceleration)
        
        lastVelocity = currentVelocity
      }
      
      lastScrollY = currentScrollY
      lastTimestamp = currentTimestamp
    }
    
    let animationFrameId: number
    
    const tick = () => {
      updatePhysics()
      animationFrameId = requestAnimationFrame(tick)
    }
    
    tick()
    
    return () => cancelAnimationFrame(animationFrameId)
  }, [])
  
  return {
    velocity,
    acceleration,
    speed: Math.abs(velocity),
  }
}

// Hook for creating scroll-triggered animations
export function useScrollTrigger(threshold = 0.5) {
  const [isTriggered, setIsTriggered] = useState(false)
  
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTriggered(entry.isIntersecting)
      },
      { threshold }
    )
    
    observer.observe(node)
    
    return () => observer.disconnect()
  }, [threshold])
  
  return { ref, isTriggered }
}
