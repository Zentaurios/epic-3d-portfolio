'use client'

import { useState, useEffect, useRef } from 'react'
import { LayeredBrainSystem } from '@/components/3d/LayeredBrainSystem'

export default function BrainSystemDemo() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const sections = [
    {
      id: 'consciousness',
      title: 'Consciousness Layer',
      description: 'The brain background provides depth and atmosphere, creating an immersive environment where your content feels like it\'s floating in neural space.',
      bgColor: 'from-blue-900/20 to-purple-900/20'
    },
    {
      id: 'memory',
      title: 'Memory Processing',
      description: 'Neural pathways light up and respond to user interactions, creating a living, breathing brain that reacts to scroll velocity and navigation.',
      bgColor: 'from-purple-900/20 to-pink-900/20'
    },
    {
      id: 'creativity',
      title: 'Creative Synthesis',
      description: 'Foreground brain elements appear in front of content, creating the illusion that your content exists within the brain itself.',
      bgColor: 'from-cyan-900/20 to-blue-900/20'
    },
    {
      id: 'logic',
      title: 'Logical Framework',
      description: 'The system intelligently manages z-index layers: background brain → content → foreground brain → navigation, creating perfect depth.',
      bgColor: 'from-green-900/20 to-teal-900/20'
    }
  ]
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true)
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      const sectionIndex = Math.floor(scrollPercent * sections.length)
      setCurrentSection(Math.min(sectionIndex, sections.length - 1))
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [sections.length])
  
  return (
    <LayeredBrainSystem>
      {/* Demo Content with Enhanced Brain Interaction */}
      <div className="relative z-10 bg-transparent">
        {/* Header with brain activity indicator */}
        <div className="fixed top-4 left-4 z-50 p-4 rounded-lg glass-dark">
          <h3 className="mb-2 text-sm font-bold text-cyan-400">Brain Activity</h3>
          <div className="flex space-x-2">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${isScrolling ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-xs text-gray-400">Neural</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${currentSection !== 0 ? 'bg-purple-400 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-xs text-gray-400">Memory</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${isScrolling ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-xs text-gray-400">Creative</span>
            </div>
          </div>
        </div>
        
        {/* Brain region indicator */}
        <div className="fixed top-4 right-4 z-50 p-4 rounded-lg glass-dark">
          <div className="text-sm font-bold text-yellow-400">Current Region</div>
          <div className="text-lg font-mono text-white">{sections[currentSection]?.id || 'consciousness'}</div>
        </div>
        
        {/* Main content sections */}
        {sections.map((section, index) => (
          <section 
            key={section.id}
            className={`min-h-screen flex items-center justify-center p-8 brain-region-${section.id}`}
          >
            <div className="relative z-10 max-w-4xl mx-auto">
              {/* Content card with brain-aware styling */}
              <div className={`relative p-12 rounded-2xl bg-gradient-to-br ${section.bgColor} backdrop-blur-lg border border-white/10 shadow-2xl transform transition-all duration-1000 ${
                currentSection === index 
                  ? 'scale-105 shadow-cyan-500/20' 
                  : 'scale-95 opacity-70'
              }`}>
                {/* Neural activity background */}
                <div className="absolute inset-0 rounded-2xl opacity-20">
                  <div className={`absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full ${
                    currentSection === index ? 'animate-ping' : ''
                  }`} />
                  <div className={`absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full ${
                    currentSection === index ? 'animate-ping' : ''
                  }`} style={{ animationDelay: '0.5s' }} />
                  <div className={`absolute bottom-6 left-12 w-1.5 h-1.5 bg-green-400 rounded-full ${
                    currentSection === index ? 'animate-ping' : ''
                  }`} style={{ animationDelay: '1s' }} />
                </div>
                
                <div className="relative z-10 text-center">
                  <h2 className="mb-6 text-4xl font-bold md:text-6xl heading-gradient">
                    {section.title}
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-300 md:text-xl">
                    {section.description}
                  </p>
                  
                  {/* Interactive elements that trigger brain activity */}
                  <div className="mt-8 space-y-4">
                    <button 
                      className="px-8 py-3 mr-4 transition-all duration-300 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                      onClick={() => {
                        // This will trigger brain activity through the useNavigationManager hook
                        window.scrollTo({
                          top: (index + 1) * window.innerHeight,
                          behavior: 'smooth'
                        })
                      }}
                    >
                      Neural Pulse
                    </button>
                    
                    {index < sections.length - 1 && (
                      <button 
                        className="px-8 py-3 transition-all duration-300 border border-white/20 rounded-lg hover:bg-white/10 hover:scale-105"
                        onClick={() => {
                          window.scrollTo({
                            top: (index + 1) * window.innerHeight,
                            behavior: 'smooth'
                          })
                        }}
                      >
                        Next Region →
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Layer demonstration */}
              <div className="mt-8 text-center">
                <div className="inline-block p-4 rounded-lg glass-dark">
                  <div className="text-sm text-gray-400">Z-Index Layers:</div>
                  <div className="text-xs space-y-1">
                    <div className="text-blue-400">Background Brain (-1)</div>
                    <div className="text-green-400">→ Content (10) ←</div>
                    <div className="text-purple-400">Foreground Brain (50)</div>
                    <div className="text-yellow-400">Navigation (99999)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
        
        {/* Final demonstration section */}
        <section className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-slate-900 to-black">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="mb-8 text-5xl font-bold md:text-7xl heading-gradient">
              🧠 Layered Brain System
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Anatomical Accuracy",
                  description: "Real brain lobes and regions with proper spatial relationships",
                  icon: "🧠"
                },
                {
                  title: "Z-Index Layering",
                  description: "Content appears within the brain with parts in front and behind",
                  icon: "🎭"
                },
                {
                  title: "Interactive Neural Activity",
                  description: "Brain responds to scroll, navigation, and user interactions",
                  icon: "⚡"
                },
                {
                  title: "Smooth Transitions",
                  description: "Seamless navigation between brain regions and states",
                  icon: "🌊"
                },
                {
                  title: "Performance Optimized",
                  description: "Efficient rendering with fixed geometry and smart updates",
                  icon: "🚀"
                },
                {
                  title: "Accessibility Ready",
                  description: "Respects reduced motion and provides fallbacks",
                  icon: "♿"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 transition-all duration-300 rounded-lg glass-dark hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <div className="mb-4 text-3xl">{feature.icon}</div>
                  <h3 className="mb-3 text-xl font-bold text-cyan-400">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <div className="p-8 rounded-xl glass-dark">
                <h3 className="mb-4 text-2xl font-bold text-yellow-400">How it Works</h3>
                <div className="text-left max-w-3xl mx-auto space-y-4 text-gray-300">
                  <p><strong className="text-cyan-400">Layer 1:</strong> Background brain (z-index: -1) provides atmospheric depth behind all content</p>
                  <p><strong className="text-green-400">Layer 2:</strong> Your content (z-index: 10) appears to float within the brain</p>
                  <p><strong className="text-purple-400">Layer 3:</strong> Foreground brain parts (z-index: 50) create immersive overlap effects</p>
                  <p><strong className="text-yellow-400">Layer 4:</strong> Navigation (z-index: 99999) stays accessible on top</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LayeredBrainSystem>
  )
}
