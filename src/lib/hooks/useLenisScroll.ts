'use client'

import { useEffect, useCallback } from 'react'

interface UseLenisScrollOptions {
  onSectionChange?: (section: string) => void
}

export function useLenisScroll({ onSectionChange }: UseLenisScrollOptions = {}) {
  // Scroll to section using Lenis
  const scrollToSection = useCallback((elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId)
    if (!element) return

    const lenis = window.lenis
    if (lenis) {
      lenis.scrollTo(element, {
        offset,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      })
    } else {
      // Fallback to native scrollIntoView
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [])

  // Scroll to top
  const scrollToTop = useCallback(() => {
    const lenis = window.lenis
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // Set up section intersection observer
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
        threshold: 0.5, // Section is considered active when 50% visible
        rootMargin: '-10% 0px -10% 0px', // Account for navigation
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [onSectionChange])

  // Listen to Lenis scroll events
  useEffect(() => {
    const lenis = window.lenis
    if (!lenis) return

    const handleScroll = () => {
      // You can add custom scroll behaviors here
      // For example, parallax effects or scroll-triggered animations
    }

    lenis.on('scroll', handleScroll)

    return () => {
      lenis.off('scroll', handleScroll)
    }
  }, [])

  return {
    scrollToSection,
    scrollToTop,
  }
}
