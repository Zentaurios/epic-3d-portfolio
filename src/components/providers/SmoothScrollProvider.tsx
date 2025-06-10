'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

// Extended CSSStyleDeclaration to include webkit properties
interface ExtendedCSSStyleDeclaration extends CSSStyleDeclaration {
  webkitOverflowScrolling?: string
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Simple and reliable mobile detection
    const detectMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth <= 768
      
      // Consider it mobile if it has mobile user agent OR is a touch device with small screen
      return isMobileUserAgent || (isTouchDevice && isSmallScreen)
    }

    const detectedMobile = detectMobile()
    setIsMobile(detectedMobile)

    if (detectedMobile) {
      // MOBILE: Use native smooth scrolling - much more reliable
      console.log('🟢 Mobile detected: Using native smooth scroll')
      
      // Enable native smooth scrolling
      document.documentElement.style.scrollBehavior = 'smooth'
      document.documentElement.style.overflow = 'auto'
      document.documentElement.style.overflowX = 'hidden'
      document.body.style.overflow = 'auto'
      document.body.style.overflowX = 'hidden'
      
      // Add iOS momentum scrolling with proper TypeScript interfaces
      const htmlStyle = document.documentElement.style as ExtendedCSSStyleDeclaration
      const bodyStyle = document.body.style as ExtendedCSSStyleDeclaration
      htmlStyle.webkitOverflowScrolling = 'touch'
      bodyStyle.webkitOverflowScrolling = 'touch'
      
      // No Lenis on mobile - just native scrolling
      lenisRef.current = null
      setIsInitialized(true)
      
    } else {
      // DESKTOP: Use Lenis with simplified configuration
      console.log('🟢 Desktop detected: Using Lenis smooth scroll')
      
      // Disable native smooth scrolling for Lenis to take over
      document.documentElement.style.scrollBehavior = 'auto'
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      
      // Initialize Lenis with proper options
      lenisRef.current = new Lenis({
        // Core settings
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        
        // Wheel and touch settings
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        
        // Disable syncTouch to avoid iOS issues
        syncTouch: false,
        
        // Performance settings
        infinite: false,
        autoResize: true,
        lerp: 0.1,
        
        // Container settings
        wrapper: window,
        content: document.documentElement,
        eventsTarget: window,
        wheelEventsTarget: window,
      })

      // Manual RAF loop (since autoRaf doesn't exist in current version)
      function raf(time: number) {
        if (lenisRef.current) {
          lenisRef.current.raf(time)
        }
        rafRef.current = requestAnimationFrame(raf)
      }
      rafRef.current = requestAnimationFrame(raf)

      // Expose Lenis globally for navigation with proper typing
      interface WindowWithLenis extends Window {
        lenis?: Lenis
      }
      ;(window as WindowWithLenis).lenis = lenisRef.current

      // Add scroll event listener for additional effects if needed
      lenisRef.current.on('scroll', () => {
        // Add any scroll-based effects here
      })

      setIsInitialized(true)
    }

    // Cleanup function
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      
      // Clean up global reference with proper typing
      interface WindowWithLenis extends Window {
        lenis?: Lenis
      }
      delete (window as WindowWithLenis).lenis
      
      // Reset CSS
      document.documentElement.style.scrollBehavior = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.overflowX = ''
      document.body.style.overflow = ''
      document.body.style.overflowX = ''
      
      // Reset webkit properties with proper interfaces
      const htmlStyle = document.documentElement.style as ExtendedCSSStyleDeclaration
      const bodyStyle = document.body.style as ExtendedCSSStyleDeclaration
      htmlStyle.webkitOverflowScrolling = ''
      bodyStyle.webkitOverflowScrolling = ''
    }
  }, [])

  return (
    <>
      {children}
      {/* Debug indicator - only show in development */}
      {process.env.NODE_ENV === 'development' && isInitialized && (
        <div className="fixed z-50 px-2 py-1 text-xs text-green-400 rounded top-4 left-4 bg-green-500/20">
          🟢 Scroll Active: {isMobile ? 'Native Mobile' : 'Lenis Desktop'}
        </div>
      )}
    </>
  )
}
