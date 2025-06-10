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
    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     window.innerWidth <= 768 ||
                     'ontouchstart' in window

    // On mobile, skip Lenis and use native scrolling
    if (isMobile) {
      console.log('Mobile device detected - using native scrolling')
      setIsInitialized(true)
      return
    }

    // Prevent conflicts by disabling CSS smooth scrolling on desktop
    document.documentElement.style.scrollBehavior = 'auto'
    
    // Initialize Lenis with optimized settings for brain universe (desktop only)
    lenisRef.current = new Lenis({
      duration: 1.0, // Responsive feel
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
      syncTouch: false
    })

    setIsInitialized(true)

    // Single RAF loop - no conflicts
    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time)
      }
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    // Expose Lenis instance globally for navigation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).lenis = lenisRef.current

    const handleScroll = () => {
      // Brain activity can be triggered here if needed
    }
    
    lenisRef.current.on('scroll', handleScroll)

    // Cleanup function
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (lenisRef.current) {
        lenisRef.current.off('scroll', handleScroll)
        lenisRef.current.destroy()
      }
      // Restore CSS scroll behavior
      document.documentElement.style.scrollBehavior = ''
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).lenis
    }
  }, [])

  return (
    <>
      {children}
      {/* Debug indicator */}
      {process.env.NODE_ENV === 'development' && isInitialized && (
        <div className="fixed z-50 px-2 py-1 text-xs text-green-400 rounded top-4 left-4 bg-green-500/20">
          🟢 Smooth Scroll Active
        </div>
      )}
    </>
  )
}
