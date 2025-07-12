'use client'

import { useEffect, useRef, useState, createContext, useContext } from 'react'

interface ScrollContextType {
  scrollToSection: (elementId: string, offset?: number) => void
  scrollToTop: () => void
  isScrolling: boolean
  isMobile: boolean
}

const ScrollContext = createContext<ScrollContextType | null>(null)

interface UnifiedScrollProviderProps {
  children: React.ReactNode
}

export function UnifiedScrollProvider({ children }: UnifiedScrollProviderProps) {
  const [isScrolling, setIsScrolling] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Reliable mobile detection
    const detectMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth <= 768
      
      return isMobileUserAgent || (isTouchDevice && isSmallScreen)
    }

    const mobile = detectMobile()
    setIsMobile(mobile)

    // Setup scrolling - MUCH simpler approach
    const setupScrolling = () => {
      // Reset any previous styling
      document.documentElement.style.scrollBehavior = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.overflowX = ''
      document.body.style.overflow = ''
      document.body.style.overflowX = ''

      if (mobile) {
        console.log('🟢 Mobile: Using native smooth scroll')
        
        // Mobile: Use native smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth'
        document.documentElement.style.overflow = 'auto'
        document.documentElement.style.overflowX = 'hidden'
        document.body.style.overflow = 'auto'
        document.body.style.overflowX = 'hidden'
        
        // iOS momentum scrolling
        document.documentElement.style.webkitOverflowScrolling = 'touch'
        document.body.style.webkitOverflowScrolling = 'touch'
        
        // Better touch handling
        document.body.style.touchAction = 'pan-y pinch-zoom'
        document.documentElement.style.overscrollBehavior = 'contain'
        document.body.style.overscrollBehavior = 'contain'
        
      } else {
        console.log('🟢 Desktop: Using CSS smooth scroll')
        
        // Desktop: Use CSS smooth scroll (much lighter than Lenis)
        document.documentElement.style.scrollBehavior = 'smooth'
        document.documentElement.style.overflow = 'auto'
        document.documentElement.style.overflowX = 'hidden'
        document.body.style.overflow = 'auto'
        document.body.style.overflowX = 'hidden'
      }
    }

    // Track scroll state
    const handleScroll = () => {
      setIsScrolling(true)
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    // Initialize
    setupScrolling()
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      window.removeEventListener('scroll', handleScroll)
      
      // Reset styles
      document.documentElement.style.scrollBehavior = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.overflowX = ''
      document.documentElement.style.webkitOverflowScrolling = ''
      document.documentElement.style.overscrollBehavior = ''
      document.body.style.overflow = ''
      document.body.style.overflowX = ''
      document.body.style.webkitOverflowScrolling = ''
      document.body.style.touchAction = ''
      document.body.style.overscrollBehavior = ''
    }
  }, [])

  // Cross-device scroll to section
  const scrollToSection = (elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId)
    if (!element) return

    if (isMobile) {
      // Mobile: Use scrollIntoView for maximum compatibility
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    } else {
      // Desktop: Use smooth scroll with offset support
      const elementTop = element.offsetTop + offset
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      })
    }
  }

  // Cross-device scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const contextValue: ScrollContextType = {
    scrollToSection,
    scrollToTop,
    isScrolling,
    isMobile,
  }

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
      {/* Development indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed z-50 px-2 py-1 text-xs text-green-400 rounded top-4 left-4 bg-green-500/20">
          🟢 Unified Scroll: {isMobile ? 'Mobile' : 'Desktop'} {isScrolling ? '(Active)' : '(Idle)'}
        </div>
      )}
    </ScrollContext.Provider>
  )
}

// Hook to use scroll context
export function useUnifiedScroll() {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useUnifiedScroll must be used within UnifiedScrollProvider')
  }
  return context
}
