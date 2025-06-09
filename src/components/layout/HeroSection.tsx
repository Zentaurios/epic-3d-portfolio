'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Rocket, Sparkles, Code, Globe } from 'lucide-react'

interface HeroSectionProps {
  onExplore: () => void
  brainActivity?: number
}

export function HeroSection({ onExplore, brainActivity = 0 }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false)
  
  // Brain activity affects visual intensity
  const activityIntensity = Math.min(Math.max(brainActivity, 0.3), 1)
  const glowIntensity = brainActivity * 0.5
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return <HeroSkeleton />
  
  return (
    <section id="home" className="page-section">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none" />
      
      <div className="content-wrapper text-center max-w-6xl relative z-10">
        {/* Main Hero Content */}
        <div className="space-y-8 mb-16">
          {/* Animated Icons */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="p-4 rounded-full glass-effect neural-pulse">
              <Rocket className="w-8 h-8 text-purple-300" />
            </div>
            <div className="p-4 rounded-full glass-effect neural-pulse" style={{ animationDelay: '0.5s' }}>
              <Code className="w-8 h-8 text-cyan-300" />
            </div>
            <div className="p-4 rounded-full glass-effect neural-pulse" style={{ animationDelay: '1s' }}>
              <Globe className="w-8 h-8 text-amber-300" />
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold heading-gradient leading-tight">
            Webb3Fitty
          </h1>
          
          {/* Tagline */}
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Revolutionary Web3 & AI Developer
          </p>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Crafting legendary digital experiences that bridge cutting-edge technology 
            with human creativity. Explore the future of web development in a galaxy 
            of infinite possibilities.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button
            onClick={onExplore}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white font-semibold text-lg hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-purple-500/25"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Explore the Galaxy
            </span>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 smooth-transition" />
          </button>
          
          <button
            onClick={() => {
              const aboutSection = document.getElementById('about')
              if (aboutSection) {
                const lenis = (window as any).lenis
                if (lenis) {
                  lenis.scrollTo(aboutSection, {
                    offset: 0,
                    duration: 1.2,
                  })
                } else {
                  aboutSection.scrollIntoView({ behavior: 'smooth' })
                }
              }
            }}
            className="px-8 py-4 border-2 border-purple-500 rounded-full text-purple-300 font-semibold text-lg hover:bg-purple-500/10 transition-all duration-300 hover:scale-105 transform"
          >
            About Webb3Fitty
          </button>
        </div>
        
        {/* Tech Stack Preview */}
        <div className="glass-effect p-6 max-w-4xl mx-auto mb-16">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Technologies & Expertise</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {techStack.map((tech, index) => (
              <div
                key={tech.name}
                className="glass-effect p-3 text-center hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-2xl mb-2">{tech.icon}</div>
                <div className="text-sm text-gray-400">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="flex flex-col items-center space-y-4">
          <p className="text-gray-500 text-sm">Scroll to navigate the galaxy</p>
          <ChevronDown className="w-6 h-6 text-gray-500 animate-bounce" />
        </div>
      </div>
    </section>
  )
}

const techStack = [
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '🔗' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'Web3', icon: '🌐' },
  { name: 'Solidity', icon: '💎' },
  { name: 'Three.js', icon: '🎯' },
  { name: 'AI/ML', icon: '🤖' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Python', icon: '🐍' },
  { name: 'GraphQL', icon: '📊' },
  { name: 'AWS', icon: '☁️' },
  { name: 'Docker', icon: '🐳' },
]

function HeroSkeleton() {
  return (
    <section className="page-section">
      <div className="content-wrapper text-center max-w-6xl space-y-8">
        <div className="h-16 bg-purple-500/20 rounded-lg pulse-glow"></div>
        <div className="h-8 bg-gray-500/20 rounded-lg pulse-glow"></div>
        <div className="h-6 bg-gray-500/20 rounded-lg pulse-glow"></div>
        <div className="flex gap-4 justify-center">
          <div className="h-12 w-32 bg-purple-500/20 rounded-full pulse-glow"></div>
          <div className="h-12 w-32 bg-cyan-500/20 rounded-full pulse-glow"></div>
        </div>
      </div>
    </section>
  )
}
