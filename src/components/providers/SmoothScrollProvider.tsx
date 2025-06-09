'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Prevent conflicts by disabling CSS smooth scrolling
    document.documentElement.style.scrollBehavior = 'auto'
    
    // Initialize Lenis with improved settings to prevent scroll cutoff
    lenisRef.current = new Lenis({
      duration: 1.2, // Slightly slower for better control
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
      syncTouch: false,
      syncTouchLerp: 0.1,
      touchInertiaMultiplier: 35,
      // Add wrapper and content elements for better height detection
      wrapper: window,
      content: document.documentElement,
      // Ensure we can scroll to the very bottom
      eventsTarget: window,
      wheelEventsTarget: window,
      // Improve responsiveness
      lerp: 0.1,
      // Enable experimental naive dimensions for better height calculation
      __experimental__naiveDimensions: false
    })

    setIsInitialized(true)

    // Enhanced RAF loop with height checks
    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time)
        
        // More frequent resize checks to prevent scroll cutoff
        if (time % 500 < 16) { // Check every ~0.5 seconds
          const documentHeight = document.documentElement.scrollHeight
          const viewportHeight = window.innerHeight
          const maxScroll = documentHeight - viewportHeight
          const { limit } = lenisRef.current
          
          // Force resize if limit doesn't match actual scrollable height
          if (Math.abs(limit - maxScroll) > 10) {
            lenisRef.current.resize()
          }
        }
      }
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    // Add resize observer to handle dynamic content changes
    const resizeObserver = new ResizeObserver(() => {
      if (lenisRef.current) {
        // Delay resize to ensure DOM has updated
        setTimeout(() => {
          lenisRef.current?.resize()
        }, 100)
        
        // Additional resize after a longer delay for complex layouts
        setTimeout(() => {
          lenisRef.current?.resize()
        }, 300)
      }
    })
    
    // Observe document body and html for height changes
    resizeObserver.observe(document.body)
    resizeObserver.observe(document.documentElement)
    
    // Also observe main content areas if they exist
    const mainElement = document.querySelector('main')
    if (mainElement) {
      resizeObserver.observe(mainElement)
    }

    // Expose Lenis instance globally for navigation
    ;(window as Window & { lenis?: Lenis }).lenis = lenisRef.current

    // Add global debug methods for scroll testing
    if (process.env.NODE_ENV === 'development') {
      ;(window as Window & { 
        lenis?: Lenis
        scrollToBottom?: () => void
        recalculateScroll?: () => void
      }).scrollToBottom = () => {
        if (lenisRef.current) {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          lenisRef.current.scrollTo(maxScroll, { immediate: false })
        }
      }
      
      ;(window as Window & { 
        lenis?: Lenis
        scrollToBottom?: () => void
        recalculateScroll?: () => void
      }).recalculateScroll = () => {
        if (lenisRef.current) {
          lenisRef.current.resize()
          console.log('Scroll recalculated. New limit:', lenisRef.current.limit)
        }
      }
    }

    const handleScroll = () => {
      // Brain activity can be triggered here if needed
    }
    
    // Enhanced scroll handling with height validation
    const handleScrollWithValidation = () => {
      if (lenisRef.current) {
        const { scroll, limit } = lenisRef.current
        const documentHeight = document.documentElement.scrollHeight
        const viewportHeight = window.innerHeight
        const maxScroll = documentHeight - viewportHeight
        
        // Check if Lenis limit is less than actual scrollable height
        if (limit < maxScroll - 10) {
          lenisRef.current.resize()
        }
        
        // Check if we're near the bottom but not quite there
        const nearBottom = scroll > limit - 50
        const atActualBottom = window.scrollY >= maxScroll - 5
        
        // Force recalculation if we're trying to scroll past limit
        if (nearBottom && !atActualBottom && limit < maxScroll) {
          setTimeout(() => {
            lenisRef.current?.resize()
          }, 16)
        }
      }
      
      handleScroll()
    }
    
    lenisRef.current.on('scroll', handleScrollWithValidation)

    // Add window resize listener for better height tracking
    const handleResize = () => {
      if (lenisRef.current) {
        // Multiple resize calls to ensure proper height calculation
        lenisRef.current.resize()
        setTimeout(() => lenisRef.current?.resize(), 100)
        setTimeout(() => lenisRef.current?.resize(), 300)
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    // Handle dynamic content loading (e.g., images, components)
    const handleLoad = () => {
      if (lenisRef.current) {
        setTimeout(() => lenisRef.current?.resize(), 500)
      }
    }
    
    window.addEventListener('load', handleLoad)

    // Cleanup function
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (lenisRef.current) {
        lenisRef.current.off('scroll', handleScrollWithValidation)
        lenisRef.current.destroy()
      }
      
      // Clean up event listeners
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('load', handleLoad)
      resizeObserver.disconnect()
      
      // Restore CSS scroll behavior
      document.documentElement.style.scrollBehavior = ''
      delete (window as Window & { lenis?: Lenis }).lenis
    }
  }, [])

  return (
    <>
      {children}
      {/* Debug indicator */}
      {process.env.NODE_ENV === 'development' && isInitialized && (
        <div className="fixed z-50 px-2 py-1 text-xs text-green-400 rounded top-4 left-4 bg-green-500/20">
          🟢 Smooth Scroll Active
          {lenisRef.current && (
            <div className="mt-1 text-xs text-gray-300">
              Limit: {Math.round(lenisRef.current.limit)} | 
              Max: {Math.round(document.documentElement.scrollHeight - window.innerHeight)}
            </div>
          )}
        </div>
      )}
    </>
  )
}
