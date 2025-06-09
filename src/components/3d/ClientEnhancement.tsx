'use client'

import { useEffect, useState } from 'react'
import { BlogPost, Project } from '@/types'
import { HomeContent } from '@/components/layout/HomeContent'
import { useScrollProgress } from '@/lib/hooks/useScrollProgress'
import { useNavigationManager } from '@/lib/hooks/useNavigationManager'
import { FixedSpeedNeuralOverlay } from '@/components/3d/FixedSpeedNeuralOverlay'

interface BrainContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    content: string
    skills: string[]
  }
  blogs: BlogPost[]
  projects: Project[]
}

interface ClientEnhancementProps {
  content: BrainContent
}

export default function ClientEnhancement({ content }: ClientEnhancementProps) {
  const { scrollProgress } = useScrollProgress()
  const { currentRegion, navigationState } = useNavigationManager()
  const [brainActivity, setBrainActivity] = useState({ neural: 0.5, synaptic: 0.5, cognitive: 0.5 })

  // Update brain activity based on scroll and navigation
  useEffect(() => {
    const neural = Math.min(0.3 + scrollProgress * 0.7, 1)
    const synaptic = navigationState.isTransitioning ? 0.9 : 0.4 + scrollProgress * 0.4
    const cognitive = 0.3 + (scrollProgress * 0.5)
    
    setBrainActivity({ neural, synaptic, cognitive })
  }, [scrollProgress, navigationState.isTransitioning])

  return (
    <div className="relative w-full min-h-screen">
      {/* Enhanced 3D depth layers */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        {/* Neural overlay for enhanced depth */}
        <FixedSpeedNeuralOverlay
          brainActivity={brainActivity}
          currentRegion={currentRegion}
          scrollProgress={scrollProgress}
          isTransitioning={navigationState.isTransitioning}
        />
        
        {/* Depth gradient layers */}
        <div 
          className="absolute inset-0 bg-gradient-radial from-transparent via-slate-900/10 to-slate-900/30"
          style={{
            transform: `translateZ(${scrollProgress * 20}px) scale(${1 + scrollProgress * 0.1})`,
            opacity: 0.6 + scrollProgress * 0.4
          }}
        />
        
        {/* Dynamic lighting overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-cyan-600/5"
          style={{
            transform: `perspective(1000px) rotateX(${scrollProgress * 5}deg) translateZ(${scrollProgress * 10}px)`,
            opacity: brainActivity.neural * 0.7
          }}
        />
      </div>

      {/* Content overlay with enhanced depth */}
      <div 
        className="relative z-10 transform-gpu"
        style={{
          transform: `perspective(1200px) translateZ(${scrollProgress * 30}px)`,
          filter: `blur(${navigationState.isTransitioning ? 2 : 0}px)`
        }}
      >
        <HomeContent content={content} />
      </div>

      {/* Floating depth particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${10 + i * 8}%`,
              top: `${20 + (i * 13) % 60}%`,
              transform: `translateZ(${(i * 5) + scrollProgress * 40}px) translateY(${scrollProgress * -100}px)`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
