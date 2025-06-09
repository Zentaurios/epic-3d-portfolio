'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseScrollProgressOptions {
  smoothing?: number
  onProgress?: (progress: number) => void
}

export function useScrollProgress({ smoothing = 0.1, onProgress }: UseScrollProgressOptions = {}) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [isScrolling, setIsScrolling] = useState(false)
  
  useEffect(() => {
    let lastScrollY = 0
    let scrollTimeoutId: NodeJS.Timeout
    let targetProgress = 0
    
    const updateScrollProgress = () => {
      // Use Lenis scroll value if available, fallback to native scroll
      const lenis = (window as any).lenis
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
      
      // Determine scroll direction
      if (scrollY > lastScrollY) {
        setScrollDirection('down')
      } else if (scrollY < lastScrollY) {
        setScrollDirection('up')
      }
      
      lastScrollY = scrollY
      setIsScrolling(true)
      
      // Update progress immediately for better responsiveness
      setScrollProgress(targetProgress)
      onProgress?.(targetProgress)
      
      // Clear existing timeout
      clearTimeout(scrollTimeoutId)
      
      // Set timeout to detect when scrolling stops
      scrollTimeoutId = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }
    
    // Listen to both Lenis and native scroll events
    const lenis = (window as any).lenis
    
    if (lenis) {
      // Use Lenis scroll events for smooth scrolling
      lenis.on('scroll', updateScrollProgress)
      console.log('🧠 Using Lenis scroll events for brain activity')
    } else {
      // Fallback to native scroll events
      window.addEventListener('scroll', updateScrollProgress, { passive: true })
      console.log('🧠 Using native scroll events for brain activity')
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
  }, [smoothing, onProgress])
  
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
