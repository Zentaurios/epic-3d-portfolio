'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AIContextInfo, AIAgentContextType } from '@/types'
import { useNavigationManager, useSectionNavigation } from '@/lib/hooks/useNavigationManager'

const AIAgentContext = createContext<AIAgentContextType | undefined>(undefined)

interface AIAgentProviderProps {
  children: ReactNode
}

export const AIAgentProvider: React.FC<AIAgentProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { navigationState, currentRegion } = useNavigationManager()
  const { activeSection } = useSectionNavigation()
  
  const [contextInfo, setContextInfo] = useState<AIContextInfo>({
    currentSection: activeSection || 'hero',
    currentPage: 'home',
    scrollPosition: 0,
    availableSections: ['hero', 'about', 'explore', 'blog']
  })

  // Update context info from navigation hooks
  useEffect(() => {
    setContextInfo(prev => ({
      ...prev,
      currentSection: activeSection || 'hero'
    }))
  }, [activeSection])
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setContextInfo(prev => ({ ...prev, scrollPosition: scrollY }))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track current page from navigation state
  useEffect(() => {
    let currentPage = 'home'
    const route = navigationState.currentRoute
    
    if (route.includes('/blog')) {
      currentPage = 'blog'
    } else if (route.includes('/explore')) {
      currentPage = 'explore'
    } else if (route.includes('/brain-')) {
      currentPage = 'brain-demo'
    }

    setContextInfo(prev => ({ ...prev, currentPage }))
  }, [navigationState.currentRoute])

  const openChat = () => setIsOpen(true)
  const closeChat = () => setIsOpen(false)
  const toggleChat = () => setIsOpen(prev => !prev)

  const updateContext = (info: Partial<AIContextInfo>) => {
    setContextInfo(prev => ({ ...prev, ...info }))
  }

  // Close chat on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const value: AIAgentContextType = {
    isOpen,
    contextInfo,
    openChat,
    closeChat,
    toggleChat,
    updateContext
  }

  return (
    <AIAgentContext.Provider value={value}>
      {children}
    </AIAgentContext.Provider>
  )
}

export const useAIAgent = () => {
  const context = useContext(AIAgentContext)
  if (context === undefined) {
    throw new Error('useAIAgent must be used within an AIAgentProvider')
  }
  return context
}
