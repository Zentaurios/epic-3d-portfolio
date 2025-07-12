'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useUnifiedScrollHook } from '@/lib/hooks/useLenisScroll'

interface SectionNavigationProps {
  activeSection?: string
}

// Define sections for each page
const pageSections = {
  home: [
    { id: 'hero', label: 'Hero' },
    { id: 'explore', label: 'Explore' },
    { id: 'blog', label: 'Blog' },
    { id: 'about', label: 'About' },
  ],
  explore: [
    { id: 'explore-header', label: 'Header' },
    { id: 'tech-stack', label: 'Tech Stack' },
    { id: 'project-grid', label: 'Projects' },
    { id: 'cta', label: 'CTA' },
  ],
  blog: [
    { id: 'blog-header', label: 'Header' },
    { id: 'blog-grid', label: 'Posts' },
  ],
}

export function SectionNavigation({ activeSection: propActiveSection }: SectionNavigationProps) {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState(propActiveSection || '')

  // Use the scroll hook with section change detection
  const { scrollToSection } = useUnifiedScrollHook({
    onSectionChange: (section) => {
      setActiveSection(section)
    }
  })

  // Determine the current page based on pathname
  const getCurrentPage = (): keyof typeof pageSections => {
    if (pathname === '/') return 'home'
    if (pathname.startsWith('/blog') && !pathname.includes('/blog/')) return 'blog'
    if (pathname.startsWith('/explore') && !pathname.includes('/explore/')) return 'explore'
    return 'home'
  }

  const currentPage = getCurrentPage()
  const sections = pageSections[currentPage] || []

  // Sync activeSection with prop when it changes
  useEffect(() => {
    if (propActiveSection) {
      setActiveSection(propActiveSection)
    }
  }, [propActiveSection])

  // Handle section scrolling (stays on current page)
  const handleSectionScroll = (sectionId: string) => {
    scrollToSection(sectionId)
    // Note: activeSection will be updated by the useLenisScroll hook's onSectionChange
  }

  // Only show navigation if we have sections for this page
  if (sections.length === 0) {
    return null
  }

  return (
    <div className="fixed z-[98000] hidden transform -translate-y-1/2 right-6 top-1/2 lg:block" style={{ zIndex: 98000 }}>
      <div className="space-y-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionScroll(section.id)}
            className={`block w-3 h-3 rounded-full smooth-transition ${
              activeSection === section.id 
                ? 'bg-purple-500 glow-purple scale-125' 
                : 'bg-white/20 hover:bg-white/40'
            }`}
            title={section.label}
          />
        ))}
      </div>
    </div>
  )
}
