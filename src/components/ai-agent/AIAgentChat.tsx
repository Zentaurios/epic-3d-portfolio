'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Brain, Navigation, Loader2, Search } from 'lucide-react'
import { useAIAgent } from './AIAgentProvider'
import { useNavigationManager } from '@/lib/hooks/useNavigationManager'
import { searchPosts, searchProjects, getAllPosts, getAllProjects, searchByTechnology, getRecentContent, findByExactTitle, intelligentSearch } from '@/lib/sanity/search'
import { AIMessage, BlogPost, Project } from '@/types'

interface SearchResult {
  type: 'post' | 'project'
  item: BlogPost | Project
}

interface IntelligentSearchResult {
  title: string
  slug: { current: string }
  type: 'post' | 'project'
  category?: string
}

interface ConversationState {
  isWaitingForSelection: boolean
  isWaitingForContactConfirmation: boolean
  searchResults: SearchResult[]
  intelligentResults: IntelligentSearchResult[]
  lastQuery: string
}

export const AIAgentChat: React.FC = () => {
  const { isOpen, closeChat, contextInfo } = useAIAgent()
  const { navigateWithTransition } = useNavigationManager()
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [conversationState, setConversationState] = useState<ConversationState>({
    isWaitingForSelection: false,
    isWaitingForContactConfirmation: false,
    searchResults: [],
    intelligentResults: [],
    lastQuery: ''
  })
  
  const isContactQuery = (input: string): boolean => {
    const contactKeywords = ['contact', 'reach out', 'get in touch', 'email', 'message', 'communicate', 'talk to', 'speak with', 'connect']
    return contactKeywords.some(keyword => input.includes(keyword))
  }

  const handleIntelligentSearch = async (input: string) => {
    setIsSearching(true)
    
    try {
      const { posts, projects, categories } = await intelligentSearch(input)
      
      const allResults: IntelligentSearchResult[] = [
        ...posts,
        ...projects
      ]

      if (allResults.length > 0) {
        let response = `🚀 Found ${allResults.length} results for "**${input}**":\n\n`
        
        allResults.slice(0, 10).forEach((result, index) => {
          const icon = result.type === 'post' ? '📝' : '🎨'
          const categoryText = result.category ? ` (${result.category})` : ''
          response += `${index + 1}. ${icon} ${result.title}${categoryText}\n`
        })
        
        if (categories.length > 0) {
          response += `\n📚 **Related Categories:** ${categories.map(cat => cat.title).join(', ')}\n`
        }
        
        if (allResults.length > 10) {
          response += `\n...and ${allResults.length - 10} more results\n`
        }
        
        response += '\n**Which one interests you?** Reply with the number!'
        
        addMessage(response, 'agent')
        setConversationState({
          isWaitingForSelection: true,
          isWaitingForContactConfirmation: false,
          searchResults: [],
          intelligentResults: allResults.slice(0, 10),
          lastQuery: input
        })
      } else {
        addMessage(`🔍 No results found for "**${input}**". Try different keywords like 'frontend', 'ai', or 'design'!`, 'agent')
      }
    } catch (error) {
      addMessage("😕 Search error! Please try again with different keywords.", 'agent')
    } finally {
      setIsSearching(false)
    }
  }
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasGreeted, setHasGreeted] = useState(false)

  // Initial greeting
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      const greeting: AIMessage = {
        id: Date.now().toString(),
        role: 'agent',
        content: "Hello! I'm Agent NotAnAgent 🧠✨\n\nHow can I help you understand the developer's brain?",
        timestamp: new Date()
      }
      setMessages([greeting])
      setHasGreeted(true)
    }
  }, [isOpen, hasGreeted])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const addMessage = (content: string, role: 'user' | 'agent', isNavigating = false) => {
    const message: AIMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      isNavigating
    }
    setMessages(prev => [...prev, message])
    return message
  }

  const navigateToIntelligentResult = (result: IntelligentSearchResult) => {
    const path = result.type === 'post' ? `/blog/${result.slug.current}` : `/explore/${result.slug.current}`
    const transitionType = result.type === 'post' ? 'memory-dive' : 'synaptic-fire'
    
    addMessage(`🚀 Taking you to "${result.title}"...`, 'agent', true)
    setIsNavigating(true)
    
    setTimeout(() => {
      navigateWithTransition(path, { transitionType, intensity: 0.8 })
    }, 500)
    
    setTimeout(() => {
      setIsNavigating(false)
      setTimeout(() => closeChat(), 1000)
    }, 2000)
  }

  const navigateToContent = (item: BlogPost | Project, type: 'post' | 'project') => {
    const path = type === 'post' ? `/blog/${item.slug.current}` : `/explore/${item.slug.current}`
    const transitionType = type === 'post' ? 'memory-dive' : 'synaptic-fire'
    
    addMessage(`🚀 Taking you to "${item.title}"...`, 'agent', true)
    setIsNavigating(true)
    
    setTimeout(() => {
      navigateWithTransition(path, { transitionType, intensity: 0.8 })
    }, 500)
    
    setTimeout(() => {
      setIsNavigating(false)
      setTimeout(() => closeChat(), 1000)
    }, 2000)
  }

  const navigateToContact = () => {
    addMessage('📞 Taking you to the contact page...', 'agent', true)
    setIsNavigating(true)
    
    setTimeout(() => {
      navigateWithTransition('/contact', { transitionType: 'memory-dive', intensity: 0.8 })
    }, 500)
    
    setTimeout(() => {
      setIsNavigating(false)
      setTimeout(() => closeChat(), 1000)
    }, 2000)
  }

  const navigateToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      addMessage(`🧭 Navigating to ${sectionId} section...`, 'agent', true)
      setIsNavigating(true)
      
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 500)
      
      setTimeout(() => {
        setIsNavigating(false)
        setTimeout(() => closeChat(), 1000)
      }, 2000)
      
      return true
    }
    return false
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isThinking || isSearching) return

    const userInput = inputValue.trim()
    addMessage(userInput, 'user')
    setInputValue('')
    setIsThinking(true)

    setTimeout(async () => {
      await processUserInput(userInput)
      setIsThinking(false)
    }, 500 + Math.random() * 1000)
  }
  
  const processUserInput = async (input: string) => {
    const lowerInput = input.toLowerCase()

    // Handle selection from previous search results
    if (conversationState.isWaitingForSelection) {
      const selectedIndex = parseInt(input) - 1
      
      if (conversationState.intelligentResults.length > 0) {
        // Handle intelligent search results
        if (selectedIndex >= 0 && selectedIndex < conversationState.intelligentResults.length) {
          const selected = conversationState.intelligentResults[selectedIndex]
          navigateToIntelligentResult(selected)
          setConversationState({ 
            isWaitingForSelection: false, 
            isWaitingForContactConfirmation: false,
            searchResults: [], 
            intelligentResults: [],
            lastQuery: '' 
          })
          return
        }
      } else if (conversationState.searchResults.length > 0) {
        // Handle regular search results
        if (selectedIndex >= 0 && selectedIndex < conversationState.searchResults.length) {
          const selected = conversationState.searchResults[selectedIndex]
          navigateToContent(selected.item, selected.type)
          setConversationState({ 
            isWaitingForSelection: false, 
            isWaitingForContactConfirmation: false,
            searchResults: [], 
            intelligentResults: [],
            lastQuery: '' 
          })
          return
        }
      }
      
      addMessage("I didn't understand that selection. Please enter a number from the list above, or ask me something else!", 'agent')
      setConversationState({ 
        isWaitingForSelection: false, 
        isWaitingForContactConfirmation: false,
        searchResults: [], 
        intelligentResults: [],
        lastQuery: '' 
      })
      return
    }

    // Handle contact confirmation
    if (conversationState.isWaitingForContactConfirmation) {
      if (lowerInput.includes('yes') || lowerInput.includes('confirm') || lowerInput.includes('sure') || lowerInput.includes('ok')) {
        navigateToContact()
        setConversationState({ 
          isWaitingForSelection: false, 
          isWaitingForContactConfirmation: false,
          searchResults: [], 
          intelligentResults: [],
          lastQuery: '' 
        })
        return
      } else {
        addMessage("No problem! Is there anything else I can help you find?", 'agent')
        setConversationState({ 
          isWaitingForSelection: false, 
          isWaitingForContactConfirmation: false,
          searchResults: [], 
          intelligentResults: [],
          lastQuery: '' 
        })
        return
      }
    }

    // Contact navigation detection
    if (isContactQuery(lowerInput)) {
      addMessage(
        "📞 I can take you to the contact page where you can reach out directly!\n\n" +
        "Would you like me to navigate there now? (Reply 'yes' to confirm)",
        'agent'
      )
      setConversationState({ 
        isWaitingForSelection: false, 
        isWaitingForContactConfirmation: true,
        searchResults: [], 
        intelligentResults: [],
        lastQuery: input 
      })
      return
    }

    // Technology search (handle "next.js", "react", etc.)
    if (isTechnologyQuery(lowerInput)) {
      await handleTechnologySearch(input)
      return
    }

    // Use intelligent search for most queries
    if (lowerInput.length > 2 && !lowerInput.includes('recent') && !lowerInput.includes('help') && !lowerInput.includes('where am i')) {
      await handleIntelligentSearch(input)
      return
    }

    // Recent content
    if (lowerInput.includes('recent') || lowerInput.includes('latest') || lowerInput.includes('new')) {
      await handleRecentContent()
      return
    }

    // Navigation requests
    if (lowerInput.includes('navigate') || lowerInput.includes('take me') || lowerInput.includes('go to')) {
      handleNavigation(lowerInput)
      return
    }

    // Help
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      addMessage(
        "🤖 I'm your guide through this neural network! Here's what I can do:\n\n" +
        "🔍 **Smart Search:**\n" +
        "• Just type any keyword (e.g., 'frontend', 'ai', 'design')\n" +
        "• 'next.js' or 'react' → Find related projects & blogs\n" +
        "• 'recent work' → Latest content\n\n" +
        "🧭 **Navigate:**\n" +
        "• 'contact' → Go to contact page\n" +
        "• 'take me to blog' → Go to blog section\n" +
        "• 'show projects' → Go to projects\n\n" +
        "💡 **Try asking:**\n" +
        "• 'frontend development'\n" +
        "• 'machine learning projects'\n" +
        "• 'where am I?' → Current location",
        'agent'
      )
      return
    }

    // Context questions
    if (lowerInput.includes('where am i') || lowerInput.includes('current')) {
      const sectionExplanations: Record<string, string> = {
        hero: "🎆 You're in the **Consciousness Region** - the main entry point where the developer's vision comes to life!",
        about: "🧠 You're in the **Logic Region** - where analytical thinking and technical skills are processed!",
        explore: "🎨 You're in the **Creativity Region** - where innovative projects are born and showcased!",
        blog: "📝 You're in the **Memory Region** - where knowledge and experiences are stored and shared!"
      }
      
      const explanation = sectionExplanations[contextInfo.currentSection] || "🧭 You're exploring the neural pathways of this digital brain!"
      addMessage(explanation, 'agent')
      return
    }

    // Default response
    addMessage(
      "🤔 I can help you find content or navigate the portfolio. Try:\n\n" +
      "• Type any keyword (e.g., 'AI', 'frontend', 'design')\n" +
      "• 'contact' to reach out\n" +
      "• 'help' for more options",
      'agent'
    )
  }
  
  const isTechnologyQuery = (input: string): boolean => {
    const techKeywords = ['next.js', 'nextjs', 'next', 'react', 'typescript', 'javascript', 'node.js', 'nodejs', 'three.js', 'threejs', 'python', 'tailwind', 'sanity']
    return techKeywords.some(tech => input.includes(tech))
  }

  const handleTechnologySearch = async (input: string) => {
    const lowerInput = input.toLowerCase()
    let tech = ''
    
    if (lowerInput.includes('next')) tech = 'Next.js'
    else if (lowerInput.includes('react')) tech = 'React'
    else if (lowerInput.includes('typescript')) tech = 'TypeScript'
    else if (lowerInput.includes('javascript')) tech = 'JavaScript'
    else if (lowerInput.includes('node')) tech = 'Node.js'
    else if (lowerInput.includes('three')) tech = 'Three.js'
    else if (lowerInput.includes('python')) tech = 'Python'
    else if (lowerInput.includes('tailwind')) tech = 'TailwindCSS'
    else if (lowerInput.includes('sanity')) tech = 'Sanity'

    if (tech) {
      setIsSearching(true)
      try {
        const { posts, projects } = await searchByTechnology(tech)
        const allResults: SearchResult[] = [
          ...posts.map(post => ({ type: 'post' as const, item: post })),
          ...projects.map(project => ({ type: 'project' as const, item: project }))
        ]

        if (allResults.length > 0) {
          let response = `🚀 Found ${allResults.length} items using **${tech}**:\n\n`
          
          allResults.forEach((result, index) => {
            const icon = result.type === 'post' ? '📝' : '🎨'
            response += `${index + 1}. ${icon} ${result.item.title}\n`
          })
          
          response += '\n**Which one would you like to explore?** Just reply with the number!'
          
          addMessage(response, 'agent')
          setConversationState({
            isWaitingForSelection: true,
            isWaitingForContactConfirmation: false,
            searchResults: allResults,
            intelligentResults: [],
            lastQuery: tech
          })
        } else {
          addMessage(`🔍 No content found for **${tech}**. Try searching for 'recent projects' or ask for help!`, 'agent')
        }
      } catch (error) {
        addMessage("😕 Sorry, I encountered an error while searching. Please try again!", 'agent')
      } finally {
        setIsSearching(false)
      }
    }
  }
  
  const handleSearch = async (input: string) => {
    setIsSearching(true)
    
    try {
      const query = extractSearchQuery(input)
      
      if (!query) {
        addMessage("🔍 What would you like me to search for? Try 'search AI projects' or 'find React blogs'!", 'agent')
        setIsSearching(false)
        return
      }

      const [posts, projects] = await Promise.all([
        searchPosts(query),
        searchProjects(query)
      ])

      const allResults: SearchResult[] = [
        ...posts.map(post => ({ type: 'post' as const, item: post })),
        ...projects.map(project => ({ type: 'project' as const, item: project }))
      ]

      if (allResults.length > 0) {
        let response = `🔍 Found ${allResults.length} results for "**${query}**":\n\n`
        
        allResults.slice(0, 10).forEach((result, index) => {
          const icon = result.type === 'post' ? '📝' : '🎨'
          response += `${index + 1}. ${icon} ${result.item.title}\n`
        })
        
        if (allResults.length > 10) {
          response += `\n...and ${allResults.length - 10} more results\n`
        }
        
        response += '\n**Which one interests you?** Reply with the number!'
        
        addMessage(response, 'agent')
        setConversationState({
          isWaitingForSelection: true,
          isWaitingForContactConfirmation: false,
          searchResults: allResults.slice(0, 10),
          intelligentResults: [],
          lastQuery: query
        })
      } else {
        addMessage(`🔍 No results found for "**${query}**". Try different keywords or ask for 'recent content'!`, 'agent')
      }
    } catch (error) {
      addMessage("😕 Search error! Please try again with different keywords.", 'agent')
    } finally {
      setIsSearching(false)
    }
  }
  
  const handleRecentContent = async () => {
    setIsSearching(true)
    
    try {
      const { recentPosts, recentProjects } = await getRecentContent()
      const allResults: SearchResult[] = [
        ...recentPosts.map(post => ({ type: 'post' as const, item: post })),
        ...recentProjects.map(project => ({ type: 'project' as const, item: project }))
      ]

      if (allResults.length > 0) {
        let response = "🎆 Here's the latest from the neural networks:\n\n"
        
        allResults.forEach((result, index) => {
          const icon = result.type === 'post' ? '📝' : '🎨'
          response += `${index + 1}. ${icon} ${result.item.title}\n`
        })
        
        response += '\n**Which catches your interest?** Just reply with the number!'
        
        addMessage(response, 'agent')
        setConversationState({
          isWaitingForSelection: true,
          isWaitingForContactConfirmation: false,
          searchResults: allResults,
          intelligentResults: [],
          lastQuery: 'recent'
        })
      } else {
        addMessage("🔍 No recent content found. That's strange!", 'agent')
      }
    } catch (error) {
      addMessage("😕 Error fetching recent content. Please try again!", 'agent')
    } finally {
      setIsSearching(false)
    }
  }
  
  const handleNavigation = (input: string) => {
    if (input.includes('blog') || input.includes('post')) {
      if (contextInfo.currentPage === 'home') {
        navigateToSection('blog')
      } else {
        addMessage('🚀 Taking you to the blog page...', 'agent', true)
        setIsNavigating(true)
        setTimeout(() => {
          navigateWithTransition('/blog', { transitionType: 'memory-dive', intensity: 0.8 })
          setIsNavigating(false)
          setTimeout(() => closeChat(), 1000)
        }, 1000)
      }
    } else if (input.includes('project') || input.includes('explore') || input.includes('work')) {
      if (contextInfo.currentPage === 'home') {
        navigateToSection('explore')
      } else {
        addMessage('🎨 Taking you to the projects page...', 'agent', true)
        setIsNavigating(true)
        setTimeout(() => {
          navigateWithTransition('/explore', { transitionType: 'synaptic-fire', intensity: 0.9 })
          setIsNavigating(false)
          setTimeout(() => closeChat(), 1000)
        }, 1000)
      }
    } else if (input.includes('about') || input.includes('skills')) {
      navigateToSection('about')
    } else if (input.includes('home') || input.includes('hero') || input.includes('top')) {
      navigateToSection('hero')
    } else {
      addMessage("🧭 Where would you like to go? Try 'take me to blog' or 'show me projects'!", 'agent')
    }
  }

  const extractSearchQuery = (input: string): string => {
    // Remove common words but keep important terms
    const commonWords = ['search', 'find', 'look', 'for', 'show', 'me', 'about', 'the', 'a', 'an', 'and', 'or']
    const words = input.toLowerCase().split(' ')
    const meaningfulWords = words.filter(word => 
      word.length > 2 && !commonWords.includes(word)
    )
    return meaningfulWords.join(' ')
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-[50vh] bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-t-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain size={24} className="text-purple-400" />
              {(isThinking || isNavigating || isSearching) && (
                <div className="absolute w-3 h-3 rounded-full -top-1 -right-1 bg-cyan-400 animate-pulse"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">Agent NotAnAgent</h3>
              <p className="text-xs text-gray-400">
                {isNavigating ? 'Navigating...' : isSearching ? 'Searching...' : isThinking ? 'Thinking...' : 'A simulated agent not actually connected to an LLM'}
              </p>
            </div>
          </div>
          <button
            onClick={closeChat}
            className="p-1 text-gray-400 transition-colors rounded-lg hover:text-white hover:bg-slate-800"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-2 rounded-2xl
                  ${message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-slate-800 text-gray-100 border border-slate-700'
                  }
                `}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'agent' && message.isNavigating && (
                    <Navigation size={16} className="mt-1 text-cyan-400 animate-bounce" />
                  )}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
                <p className="mt-1 text-xs opacity-60">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Status indicators */}
          {(isThinking || isSearching) && (
            <div className="flex justify-start">
              <div className="px-4 py-2 border bg-slate-800 border-slate-700 rounded-2xl">
                <div className="flex items-center space-x-2">
                  {isSearching ? (
                    <Search size={16} className="text-cyan-400 animate-spin" />
                  ) : (
                    <Loader2 size={16} className="text-purple-400 animate-spin" />
                  )}
                  <p className="text-sm text-gray-300">
                    {isSearching ? 'Searching the neural networks...' : 'Processing...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-purple-500/20">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={conversationState.isWaitingForSelection ? "Enter a number from the list above..." : conversationState.isWaitingForContactConfirmation ? "Reply 'yes' to confirm or ask something else..." : "Ask me anything about the developer's brain..."}
              className="flex-1 px-4 py-2 text-white placeholder-gray-400 border rounded-lg bg-slate-800 border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isThinking || isSearching}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isThinking || isSearching}
              className="p-2 text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}