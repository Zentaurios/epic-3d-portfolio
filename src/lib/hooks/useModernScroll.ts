'use client'

import { useEffect, useCallback } from 'react'

interface UseModernScrollOptions {
  onSectionChange?: (section: string) => void
}

export function useModernScrollHook({ onSectionChange }: UseModernScrollOptions = {}) {
  // Enhanced scroll to section with better mobile handling
  const scrollToSection = useCallback((elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId)
    if (!element) return

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                    ('ontouchstart' in window && window.innerWidth <= 768)
    
    if (isMobile) {
      // Use native scrollIntoView for mobile - most reliable
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    } else {
      // Use custom animation for desktop
      const elementTop = element.offsetTop + offset
      const startPos = window.pageYOffset
      const distance = elementTop - startPos
      const duration = Math.min(Math.abs(distance) * 0.5, 1000)
      
      const startTime = performance.now()
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutCubic(progress)
        
        const currentPos = startPos + (distance * easedProgress)
        window.scrollTo(0, currentPos)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [])

  // Scroll to top
  const scrollToTop = useCallback(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                    ('ontouchstart' in window && window.innerWidth <= 768)
    
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Custom animation for desktop
      const startPos = window.pageYOffset
      const duration = 800
      const startTime = performance.now()
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutCubic(progress)
        
        const currentPos = startPos * (1 - easedProgress)
        window.scrollTo(0, currentPos)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [])

  // Set up section intersection observer for navigation
  useEffect(() => {
    if (!onSectionChange) return

    const sections = document.querySelectorAll('.page-section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            onSectionChange(sectionId)
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px',
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [onSectionChange])

  return {
    scrollToSection,
    scrollToTop,
  }
}