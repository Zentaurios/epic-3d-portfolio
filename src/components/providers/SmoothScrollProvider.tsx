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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Enhanced mobile detection that matches actual mobile devices
    const detectMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth <= 768 || window.screen.width <= 768
      const isIOS = /ipad|iphone|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      
      // Enhanced mobile detection for more device types
      const isAndroid = /android/i.test(userAgent)
      const isMobileOS = /mobile|android|iphone|ipad|ipod|blackberry|webos|windows phone/i.test(userAgent)
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
      const hasNoHover = window.matchMedia('(hover: none)').matches
      
      // Only consider it mobile if it's actually a mobile device (not just small screen)
      return isMobileUserAgent || isIOS || isAndroid || isMobileOS || 
             (isTouchDevice && isSmallScreen) || 
             (hasCoarsePointer && hasNoHover)
    }

    const detectedMobile = detectMobile()
    setIsMobile(detectedMobile)

    // For mobile devices, enable native scrolling with minimal Lenis interference
    if (detectedMobile) {
      // Enable native scrolling on mobile
      document.documentElement.style.overflow = 'auto'
      document.body.style.overflow = 'auto'
      document.documentElement.style.scrollBehavior = 'smooth'
      
      // Initialize Lenis with mobile-optimized settings
      lenisRef.current = new Lenis({
        duration: 0.8, // Faster for mobile
        easing: (t) => 1 - Math.pow(1 - t, 2), // Simpler easing for mobile
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: false, // Disable smooth wheel on mobile
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0, // Higher touch sensitivity
        infinite: false,
        autoResize: true,
        syncTouch: true, // CRITICAL: Enable touch sync for mobile
        syncTouchLerp: 0.075, // Faster lerp for more responsive touch
        touchInertiaMultiplier: 15, // Reduced inertia for better control
        wrapper: window,
        content: document.documentElement,
        eventsTarget: window,
        wheelEventsTarget: window,
        lerp: 0.05, // Faster lerp for mobile responsiveness
        __experimental__naiveDimensions: false
      })

      // Mobile fallback: if Lenis fails to work properly on mobile, ensure native scrolling works
      if (detectedMobile) {
        // Test if Lenis is working properly on mobile
        setTimeout(() => {
          if (lenisRef.current) {
            const testScroll = window.scrollY
            
            // Try a small scroll to test Lenis responsiveness
            lenisRef.current.scrollTo(10, { immediate: true })
            
            setTimeout(() => {
              const newScroll = window.scrollY
              
              // If Lenis isn't responsive enough, disable it and use native scrolling
              if (Math.abs(newScroll - 10) > 5) {
                
                // Destroy Lenis and enable full native scrolling
                if (lenisRef.current) {
                  lenisRef.current.destroy()
                  lenisRef.current = null
                }
                
                // Force native scrolling
                document.documentElement.style.overflow = 'auto'
                document.body.style.overflow = 'auto'
                document.documentElement.style.scrollBehavior = 'smooth'
                
                // Update initialization state
                setIsInitialized(true)
              } else {
                // Lenis is working, scroll back to original position
                lenisRef.current?.scrollTo(testScroll, { immediate: true })
              }
            }, 100)
          }
        }, 500)
      }

      setIsInitialized(true)
    } else {
      // Desktop configuration - keep original smooth scrolling
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
        syncTouch: false, // Keep disabled for desktop
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
    }

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
        }
      }
    }

    // Production: Add scroll monitoring for mobile issues
    if (process.env.NODE_ENV === 'production' && detectedMobile) {
      // Monitor for scroll issues in production
      let scrollIssueDetected = false
      const monitorScrollHealth = () => {
        if (!scrollIssueDetected) {
          const documentHeight = document.documentElement.scrollHeight
          const viewportHeight = window.innerHeight
          const maxScroll = documentHeight - viewportHeight
          
          // Check if scrolling is completely broken
          if (maxScroll > 100 && window.scrollY === 0) {
            // Try to scroll a small amount to test
            window.scrollTo({ top: 50, behavior: 'smooth' })
            
            setTimeout(() => {
              if (window.scrollY < 10) {
                scrollIssueDetected = true
                console.warn('🚨 Mobile scroll issue detected in production. Visit /scroll-test to debug.')
                
                // Try to enable native scrolling as emergency fallback
                document.documentElement.style.overflow = 'auto'
                document.body.style.overflow = 'auto'
                document.documentElement.style.scrollBehavior = 'smooth'
              } else {
                // Scroll back to top
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }, 1000)
          }
        }
      }
      
      // Run scroll health check after page loads
      setTimeout(monitorScrollHealth, 2000)
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
          🟢 Smooth Scroll Active {isMobile ? '(Mobile Mode)' : '(Desktop Mode)'}
          {lenisRef.current && (
            <div className="mt-1 text-xs text-gray-300">
              Limit: {Math.round(lenisRef.current.limit)} | 
              Max: {Math.round(document.documentElement.scrollHeight - window.innerHeight)}
              {isMobile && <div className="text-yellow-300">Touch Enabled</div>}
            </div>
          )}
        </div>
      )}
    </>
  )
}
