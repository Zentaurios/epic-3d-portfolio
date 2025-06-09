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
    
    // Initialize Lenis with optimized settings for brain universe
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

    console.log('✅ Lenis initialized successfully')
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
    ;(window as any).lenis = lenisRef.current

    // Reduced debug logging - only log significant scroll changes
    let lastLoggedScroll = 0
    const handleScroll = () => {
      if (lenisRef.current && process.env.NODE_ENV === 'development') {
        const currentScroll = lenisRef.current.scroll
        // Only log every 100px of scroll to reduce noise
        if (Math.abs(currentScroll - lastLoggedScroll) > 100) {
          console.log('🧠 Brain scroll progress:', (currentScroll / (document.documentElement.scrollHeight - window.innerHeight)).toFixed(3))
          lastLoggedScroll = currentScroll
        }
      }
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
