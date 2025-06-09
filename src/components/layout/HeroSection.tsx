'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Rocket, Sparkles, Code, Globe, Brain } from 'lucide-react'
import { scrollUtils } from '@/lib/utils/constants'

// Pulsating Brain Icon Component
function PulsatingBrainIcon({ size = 200, intensity = 0.8 }: { size?: number, intensity?: number }) {
  const [pulsePhase, setPulsePhase] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 0.1) % (Math.PI * 2))
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  const pulseScale = 1 + Math.sin(pulsePhase) * 0.15 * intensity
  const glowIntensity = (Math.sin(pulsePhase) + 1) * 0.5 * intensity

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(59, 130, 246, ${glowIntensity * 0.3}) 0%, transparent 70%)`,
          transform: `scale(${1 + glowIntensity * 0.5})`,
          filter: 'blur(10px)'
        }}
      />
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(139, 92, 246, ${glowIntensity * 0.4}) 0%, transparent 60%)`,
          transform: `scale(${1 + glowIntensity * 0.3})`,
          filter: 'blur(5px)'
        }}
      />
      
      {/* Main brain icon */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          transform: `scale(${pulseScale})`,
          filter: `drop-shadow(0 0 ${glowIntensity * 20}px rgba(59, 130, 246, 0.8))`
        }}
      >
        <Brain 
          size={size} 
          className="text-transparent"
          style={{
            fill: `url(#brain-gradient-${Math.floor(pulsePhase * 10)})`,
            stroke: `rgba(59, 130, 246, ${0.8 + glowIntensity * 0.2})`,
            strokeWidth: 2
          }}
        />
        
        {/* SVG Gradients */}
        <svg width="0" height="0" className="absolute">
          <defs>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <linearGradient key={i} id={`brain-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={`hsl(${(i * 36 + pulsePhase * 50) % 360}, 70%, 60%)`} />
                <stop offset="50%" stopColor={`hsl(${(i * 36 + pulsePhase * 50 + 60) % 360}, 80%, 70%)`} />
                <stop offset="100%" stopColor={`hsl(${(i * 36 + pulsePhase * 50 + 120) % 360}, 70%, 60%)`} />
              </linearGradient>
            ))}
          </defs>
        </svg>
      </div>
      
      {/* Energy particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `hsl(${(i * 45 + pulsePhase * 100) % 360}, 70%, 60%)`,
            transform: `
              rotate(${i * 45 + pulsePhase * 30}deg) 
              translateX(${size * 0.6}px) 
              scale(${0.5 + Math.sin(pulsePhase + i) * 0.3})
            `,
            opacity: glowIntensity * 0.8,
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  )
}

interface HeroSectionProps {
  onExplore: () => void
}

export function HeroSection({ onExplore }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return <HeroSkeleton />
  
  return (
    <section id="home" className="page-section">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      
      <div className="relative z-10 max-w-6xl text-center content-wrapper">
        {/* Main Hero Content */}
        <div className="mb-16 space-y-8">
          {/* Animated Icons */}
          <div className="flex items-center justify-center mb-8 space-x-8">
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
          <h1 className="text-5xl font-bold leading-tight md:text-7xl lg:text-8xl heading-gradient">
            Webb3Fitty
          </h1>
          
          {/* Tagline */}
          <p className="max-w-4xl mx-auto text-2xl font-light leading-relaxed text-gray-300 md:text-3xl lg:text-4xl">
            Revolutionary Web3 & AI Developer
          </p>
          
          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-400 md:text-xl">
            Crafting legendary digital experiences that bridge cutting-edge technology 
            with human creativity. Explore the future of web development in a galaxy 
            of infinite possibilities.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-6 mb-16 sm:flex-row">
          <button
            onClick={onExplore}
            className="relative px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform rounded-full shadow-lg group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 hover:scale-105 hover:shadow-purple-500/25"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Explore the Galaxy
            </span>
            <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 smooth-transition" />
          </button>
          
          <button
            onClick={() => {
              const aboutSection = document.getElementById('about')
              if (aboutSection) {
                scrollUtils.refreshLenisHeight()
                setTimeout(() => {
                  aboutSection.scrollIntoView({ behavior: 'smooth' })
                }, 100)
              }
            }}
            className="px-8 py-4 text-lg font-semibold text-purple-300 transition-all duration-300 transform border-2 border-purple-500 rounded-full hover:bg-purple-500/10 hover:scale-105"
          >
            About Webb3Fitty
          </button>
        </div>
        
        {/* Tech Stack Preview */}
        <div className="max-w-4xl p-6 mx-auto mb-16 glass-effect">
          <h3 className="mb-4 text-xl font-semibold text-gray-300">Technologies & Expertise</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {techStack.map((tech, index) => (
              <div
                key={tech.name}
                className="p-3 text-center transition-all duration-300 cursor-pointer glass-effect hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-2 text-2xl">{tech.icon}</div>
                <div className="text-sm text-gray-400">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-gray-500">Scroll to navigate the galaxy</p>
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
      <div className="relative z-10 max-w-6xl text-center content-wrapper">
        {/* Pulsating Brain Icon with Energy */}
        <div className="flex justify-center mb-12">
          <PulsatingBrainIcon 
            size={280}
            intensity={0.9}
          />
        </div>
        
        {/* Neural Connection Text */}
        <div className="space-y-6">
          <div className="relative">
            <h2 className="text-4xl font-bold text-transparent md:text-6xl bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400 bg-clip-text">
              Neural Network Initializing...
            </h2>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-amber-400/20 blur-xl"></div>
          </div>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-300 md:text-xl">
            Connecting synapses and loading consciousness matrix
          </p>
          
          {/* Loading indicators */}
          <div className="flex justify-center mt-8 space-x-4">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </section>
  )
}
