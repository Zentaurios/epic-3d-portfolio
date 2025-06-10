'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'
import { useMobileDetection } from './MobileDetectionProvider'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)
  const [isDesktopInitialized, setIsDesktopInitialized] = useState(false)

  // Use shared mobile detection
  const { isMobile, isLoading: mobileDetectionLoading, detectionMethod } = useMobileDetection()
  
  useEffect(() => {
    // Wait for mobile detection to complete
    if (mobileDetectionLoading) {
      return
    }
    
    // MOBILE PATH - NO Lenis initialization
    if (isMobile) {
      
      // Ensure NO Lenis exists
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      
      // Clear any existing RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      
      // Remove global Lenis reference
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).lenis
      
      // AGGRESSIVE mobile scrolling setup
      const enableNativeScrolling = () => {
        // Document root
        document.documentElement.style.setProperty('overflow', 'auto', 'important')
        document.documentElement.style.setProperty('overflow-y', 'auto', 'important')
        document.documentElement.style.setProperty('height', 'auto', 'important')
        document.documentElement.style.setProperty('max-height', 'none', 'important')
        document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important')
        
        // Body
        document.body.style.setProperty('overflow', 'auto', 'important')
        document.body.style.setProperty('overflow-y', 'auto', 'important')
        document.body.style.setProperty('height', 'auto', 'important')
        document.body.style.setProperty('max-height', 'none', 'important')
        document.body.style.setProperty('min-height', '100vh', 'important')
        document.body.style.setProperty('position', 'static', 'important')
        
        // Mobile touch scrolling
        document.body.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important')
        document.body.style.setProperty('touch-action', 'pan-y pinch-zoom', 'important')
        document.body.style.setProperty('overscroll-behavior-y', 'auto', 'important')
        
        // Force main to be scrollable
        const mainElement = document.querySelector('main')
        if (mainElement) {
          const main = mainElement as HTMLElement
          main.style.setProperty('height', 'auto', 'important')
          main.style.setProperty('max-height', 'none', 'important')
          main.style.setProperty('overflow', 'visible', 'important')
          main.style.setProperty('position', 'static', 'important')
        }
        
        // Remove problematic classes
        document.body.classList.remove('overflow-hidden', 'h-screen', 'max-h-screen')
        document.documentElement.classList.remove('overflow-hidden', 'h-screen', 'max-h-screen')
      }
      
      // Apply immediately
      enableNativeScrolling()
      
      // Apply again after DOM settles
      setTimeout(enableNativeScrolling, 50)
      setTimeout(enableNativeScrolling, 200)
      
      // Monitor for any interference
      const mobileSafetyInterval = setInterval(() => {
        if (document.body.style.overflow !== 'auto' || document.documentElement.style.overflow !== 'auto') {
          enableNativeScrolling()
        }
      }, 1000)
      
      // Resize handler for mobile
      const handleMobileResize = () => {
        if (window.innerWidth <= 768) {
          enableNativeScrolling()
          // Destroy any Lenis that might have snuck in
          if (lenisRef.current) {
            lenisRef.current.destroy()
            lenisRef.current = null
          }
        }
      }
      window.addEventListener('resize', handleMobileResize)
      
      // Mobile cleanup
      return () => {
        clearInterval(mobileSafetyInterval)
        window.removeEventListener('resize', handleMobileResize)
      }
    }

    // DESKTOP PATH - Initialize Lenis ONLY for true desktop
    
    // Double-check we're truly on desktop
    if (window.innerWidth <= 768) {
      return
    }

    // Desktop Lenis initialization
    document.documentElement.style.scrollBehavior = 'auto'
    
    lenisRef.current = new Lenis({
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
      syncTouch: false
    })

    setIsDesktopInitialized(true)

    // RAF loop for desktop only
    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time)
      }
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    // Global Lenis for desktop
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).lenis = lenisRef.current

    const handleScroll = () => {
      // Desktop scroll handling
    }
    
    lenisRef.current.on('scroll', handleScroll)

    // Desktop cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (lenisRef.current) {
        lenisRef.current.off('scroll', handleScroll)
        lenisRef.current.destroy()
      }
      document.documentElement.style.scrollBehavior = ''
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).lenis
    }
  }, [isMobile, mobileDetectionLoading, detectionMethod]) // Dependencies include mobile detection state

  return (
    <>
      {children}
      {/* Debug indicator - only show when mobile detection is complete */}
      {process.env.NODE_ENV === 'development' && !mobileDetectionLoading && (
        <div className="fixed z-50 px-2 py-1 text-xs rounded top-4 left-4">
          {isMobile ? (
            <span className="px-2 py-1 text-blue-400 rounded bg-blue-500/20">
              📱 Native Mobile Scroll ({detectionMethod})
            </span>
          ) : isDesktopInitialized ? (
            <span className="px-2 py-1 text-green-400 rounded bg-green-500/20">
              🖥️ Desktop Smooth Scroll
            </span>
          ) : (
            <span className="px-2 py-1 text-yellow-400 rounded bg-yellow-500/20">
              ⏳ Initializing Desktop Scroll...
            </span>
          )}
        </div>
      )}
    </>
  )
}
