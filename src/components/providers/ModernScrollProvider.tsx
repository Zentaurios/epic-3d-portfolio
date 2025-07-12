'use client'

import { useEffect, useRef, useState, createContext, useContext } from 'react'

interface ScrollContextType {
  scrollToSection: (elementId: string, offset?: number) => void
  scrollToTop: () => void
  isScrolling: boolean
}

const ScrollContext = createContext<ScrollContextType | null>(null)

interface ModernScrollProviderProps {
  children: React.ReactNode
}

export function ModernScrollProvider({ children }: ModernScrollProviderProps) {
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Enhanced CSS-based smooth scrolling for all devices
    const setupScrolling = () => {
      // Enable smooth scrolling with CSS
      document.documentElement.style.scrollBehavior = 'smooth'
      document.documentElement.style.overflow = 'auto'
      document.documentElement.style.overflowX = 'hidden'
      document.body.style.overflow = 'auto'
      document.body.style.overflowX = 'hidden'
      
      // Enhanced mobile scrolling
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                      ('ontouchstart' in window && window.innerWidth <= 768)
      
      if (isMobile) {
        // Enable momentum scrolling on iOS
        document.documentElement.style.webkitOverflowScrolling = 'touch'
        document.body.style.webkitOverflowScrolling = 'touch'
        
        // Improve touch handling
        document.body.style.touchAction = 'pan-y pinch-zoom'
        
        // Prevent overscroll bounce that can break layouts
        document.documentElement.style.overscrollBehavior = 'none'
        document.body.style.overscrollBehavior = 'none'
      }
    }

    // Track scroll state for UI feedback
    const handleScroll = () => {
      setIsScrolling(true)
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    // Add scroll listener with passive for better performance
    const addScrollListener = () => {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    // Initialize
    setupScrolling()
    addScrollListener()

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

  // Enhanced scroll to section with better easing
  const scrollToSection = (elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId)
    if (!element) return

    const elementTop = element.offsetTop + offset
    const startTime = performance.now()
    const startPos = window.pageYOffset
    const distance = elementTop - startPos
    const duration = Math.min(Math.abs(distance) * 0.5, 1200) // Dynamic duration

    // Custom easing function for smooth feel
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      
      const currentPos = startPos + (distance * easedProgress)
      window.scrollTo(0, currentPos)
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateScroll)
      }
    }

    // Cancel any ongoing animation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(animateScroll)
  }

  // Scroll to top with animation
  const scrollToTop = () => {
    scrollToSection('top', 0) // This will scroll to position 0
  }

  const contextValue: ScrollContextType = {
    scrollToSection,
    scrollToTop,
    isScrolling,
  }

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
      {/* Development indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed z-50 px-2 py-1 text-xs text-green-400 rounded top-4 left-4 bg-green-500/20">
          🟢 Modern Scroll Active {isScrolling ? '(Scrolling)' : '(Idle)'}
        </div>
      )}
    </ScrollContext.Provider>
  )
}

// Hook to use scroll context
export function useModernScroll() {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useModernScroll must be used within ModernScrollProvider')
  }
  return context
}