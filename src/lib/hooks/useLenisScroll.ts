'use client'

import { useEffect, useCallback } from 'react'
import { useUnifiedScroll } from '@/components/providers/UnifiedScrollProvider'

interface UseUnifiedScrollOptions {
  onSectionChange?: (section: string) => void
}

export function useUnifiedScrollHook({ onSectionChange }: UseUnifiedScrollOptions = {}) {
  const { scrollToSection, scrollToTop } = useUnifiedScroll()

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

  return {
    scrollToSection,
    scrollToTop,
  }
}
