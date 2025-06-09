'use client'

import { useState, useEffect } from 'react'
import { Home, Search, User, MessageSquare, Menu, X, Twitter, Send } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLenisScroll } from '@/lib/hooks/useLenisScroll'

interface FloatingNavigationProps {
  onNavigate: (section: string) => void
  currentRegion?: 'consciousness' | 'memory' | 'creativity' | 'logic'
  activeSection?: string
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'explore', label: 'Explore', icon: Search, href: '/explore' },
  { id: 'blog', label: 'Blog', icon: MessageSquare, href: '/blog' },
  { id: 'about', label: 'About', icon: User, href: '/#about' },
]

// Sections that exist on the homepage for the circle indicators
const homeSections = [
  { id: 'home', label: 'Home' },
  { id: 'explore', label: 'Explore' },
  { id: 'blog', label: 'Blog' },
  { id: 'about', label: 'About' },
]

export function FloatingNavigation({ 
  onNavigate, 
  currentRegion = 'consciousness', 
  activeSection: propActiveSection 
}: FloatingNavigationProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(propActiveSection || 'home') // Use prop or fallback
  const [scrolled, setScrolled] = useState(false)
  
  // Use the scroll hook with section change detection
  const { scrollToSection } = useLenisScroll({
    onSectionChange: (section) => {
      setActiveSection(section)
    }
  })

  // Determine the current page based on pathname
  const getCurrentPage = () => {
    if (pathname === '/') return 'home'
    if (pathname.startsWith('/blog')) return 'blog'
    if (pathname.startsWith('/explore')) return 'explore'
    if (pathname.includes('#about') || pathname === '/#about') return 'about'
    return 'home'
  }

  const currentPage = getCurrentPage()

  // Sync activeSection with prop when it changes
  useEffect(() => {
    if (propActiveSection) {
      setActiveSection(propActiveSection)
    }
  }, [propActiveSection])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle section scrolling (stays on current page)
  const handleSectionScroll = (sectionId: string) => {
    scrollToSection(sectionId)
    // Note: activeSection will be updated by the useLenisScroll hook's onSectionChange
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark' : 'glass'
      } rounded-full p-2 hidden md:block`}>
        <div className="flex items-center justify-end space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative px-4 py-2 rounded-full smooth-transition flex items-center space-x-2 ${
                  isActive 
                    ? 'bg-purple-600 text-white glow-purple' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
                
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 opacity-20 animate-pulse" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Navigation Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full smooth-transition md:hidden ${
          scrolled ? 'glass-dark' : 'glass'
        } ${isOpen ? 'glow-purple' : 'hover:glow-cyan'}`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Content */}
        <div className={`absolute top-20 right-6 glass-dark rounded-2xl p-6 transform transition-all duration-300 ${
          isOpen ? 'translate-y-0 scale-100' : '-translate-y-4 scale-95'
        }`}>
          <div className="space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl smooth-transition text-left ${
                    isActive 
                      ? 'bg-purple-600 text-white glow-purple' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
          
          {/* Social Links */}
          <div className="pt-6 mt-6 border-t border-white/10">
            <div className="mb-3 text-xs text-center text-gray-400">Connect</div>
            <div className="flex justify-center space-x-4">
              <Link 
                href="https://x.com/Webb3Fitty" 
                className="p-2 rounded-lg hover:bg-white/10 smooth-transition group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 smooth-transition" />
              </Link>
              <Link 
                href="https://t.me/Treefitty" 
                className="p-2 rounded-lg hover:bg-white/10 smooth-transition group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send className="w-5 h-5 text-gray-400 group-hover:text-blue-400 smooth-transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section Indicator - Only show on homepage for scrolling within current page */}
      {currentPage === 'home' && (
        <div className="fixed z-40 hidden transform -translate-y-1/2 right-6 top-1/2 lg:block">
          <div className="space-y-3">
            {homeSections.map((section) => (
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
      )}
    </>
  )
}
