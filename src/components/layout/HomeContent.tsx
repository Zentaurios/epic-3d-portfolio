'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { BlogPost, Project } from '@/types'
import { HeroSection } from '@/components/layout/HeroSection'
import { ExploreSection } from '@/components/layout/ExploreSection'
import { LatestBlogs } from '@/components/blog/LatestBlogs'
import { useNavigationManager, useSectionNavigation } from '@/lib/hooks/useNavigationManager'

interface HomeContentData {
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

interface HomeContentProps {
  content: HomeContentData
}

export function HomeContent({ content }: HomeContentProps) {
  const { navigateWithTransition } = useNavigationManager()
  const { getSectionProgress } = useSectionNavigation()
  
  const navigateToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  return (
    <>
      {/* Scrollable Content with Brain Region Markers */}
      <div className="relative z-10 w-full">
        <main className="relative z-10">
          {/* Hero Section - Consciousness Region */}
          <section 
            id="hero" 
            data-section="hero"
            className="flex items-center justify-center min-h-screen py-16 brain-region-consciousness"
          >
            <div className="relative z-10">
              <HeroSection 
                onExplore={() => navigateToSection('explore')}
              />
            </div>
          </section>
          
          {/* Explore Section - Creativity Region */}
          <section 
            id="explore" 
            data-section="explore"
            className="flex items-center min-h-screen py-16 brain-region-creativity"
          >
            <div className="relative z-10">
              <ExploreSection 
                onNavigate={navigateToSection}
                projects={content.projects}
                brainActivity={getSectionProgress('explore')}
              />
            </div>
          </section>
          
          {/* Blog Section - Memory Region */}
          <section 
            id="blog" 
            data-section="blog"
            className="flex items-center min-h-screen py-16 brain-region-memory"
          >
            <div className="relative z-10">
              <Suspense fallback={<BlogsSkeleton />}>
                <LatestBlogs 
                  blogs={content.blogs}
                  onNavigate={(route) => navigateWithTransition(route, { 
                    transitionType: 'memory-dive', 
                    intensity: 0.8 
                  })}
                />
              </Suspense>
            </div>
          </section>
          
          {/* About Section - Logic Region */}
          <section 
            id="about" 
            data-section="about"
            className="flex items-center min-h-screen py-16 brain-region-logic mb-[75vh]"
          >
            <div className="relative z-10">
              <AboutSection 
                content={content.about} 
                brainActivity={getSectionProgress('about')}
              />
            </div>
          </section>

          {/* Footer Section - Neural Network Base */}
          <footer className="relative z-10 px-4 py-12 overflow-hidden border-t border-slate-800/30 brain-region-base">
            {/* Neural network background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-black/50" />
              {/* Neural connection lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="neuralGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="1" fill="#8b5cf6" opacity="0.4">
                      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </pattern>
                  <linearGradient id="neuralGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#neuralGrid)" />
                {/* Animated neural pathways */}
                <path d="M0,30 Q150,15 300,30 T600,30" stroke="url(#neuralGlow)" strokeWidth="0.5" fill="none" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
                </path>
                <path d="M100,60 Q250,45 400,60 T700,60" stroke="url(#neuralGlow)" strokeWidth="0.5" fill="none" opacity="0.4">
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur="5s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>

            {/* Floating neural particles - Fixed positions to prevent hydration mismatch */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[
                { left: 12, top: 15, delay: 0.5, duration: 3.2 },
                { left: 78, top: 25, delay: 1.2, duration: 2.8 },
                { left: 35, top: 65, delay: 0.8, duration: 3.5 },
                { left: 89, top: 45, delay: 2.1, duration: 2.5 },
                { left: 25, top: 80, delay: 1.6, duration: 4.1 },
                { left: 67, top: 10, delay: 0.3, duration: 3.8 },
                { left: 8, top: 55, delay: 2.4, duration: 2.9 },
                { left: 92, top: 75, delay: 1.1, duration: 3.3 }
              ].map((particle, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-cyan-400 opacity-60 animate-pulse"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    animationDelay: `${particle.delay}s`,
                    animationDuration: `${particle.duration}s`
                  }}
                />
              ))}
            </div>

            {/* Glass effect container */}
            <div className="relative z-10 max-w-6xl mx-auto">
              <div className="relative p-8 overflow-hidden text-center glass-effect">
                {/* Neural pulse background */}
                <div className="absolute inset-0 transition-opacity duration-1000 bg-gradient-to-r from-purple-500/5 via-cyan-500/10 to-amber-500/5 animate-pulse" />
                
                <div className="relative z-10 space-y-6">
                  {/* Brand hashtags with enhanced styling */}
                  <div className="relative">
                    <p className="text-xl font-bold text-transparent md:text-2xl bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400 bg-clip-text">
                      #TreeFitty | #Webb3Fitty | #Web3
                    </p>
                    {/* Glow effect under text */}
                    <div className="absolute inset-0 blur-sm bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-amber-400/20" />
                  </div>
                  
                  {/* Copyright with neural styling */}
                  <div className="relative">
                    <p className="text-gray-300 md:text-lg">
                      © 2025 Webb3Fitty. Crafting legendary digital experiences.
                    </p>
                    {/* Subtle neural connection lines */}
                    <div className="absolute w-32 h-px transform -translate-x-1/2 left-1/2 -bottom-2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                  </div>

                  {/* Neural status indicator */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Neural Network: Active</span>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  )
}

function AboutSection({ 
  content, 
  brainActivity 
}: { 
  content: { title: string; content: string; skills: string[] }
  brainActivity: number
}) {
  return (
    <div className="page-section">
      <div className="content-wrapper">
        <div className="relative p-8 overflow-hidden text-center glass-effect">
          {/* Neural activity indicator */}
          <div 
            className="absolute inset-0 transition-opacity duration-1000 bg-gradient-to-r from-green-500/5 to-cyan-500/5"
            style={{ opacity: brainActivity * 0.3 }}
          />
          
          <h2 className="mb-8 text-4xl font-bold md:text-6xl heading-gradient">
            Webb3Fitty
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-gray-300 md:text-xl">
            <p>{content.content}</p>
          </div>
          
          {/* Skills Grid with Neural Enhancement */}
          <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
            {content.skills.map((skill, index) => (
              <div 
                key={index}
                className="relative p-4 transition-all duration-300 border rounded-lg glass-effect hover:scale-105 border-slate-600/20 hover:border-green-500/30 group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  transform: `translateY(${Math.max(0, (1 - brainActivity) * 10)}px)`,
                  opacity: Math.max(0.6, brainActivity * 0.8 + 0.2)
                }}
              >
                {/* Neural connection effect */}
                <div className="absolute inset-0 transition-opacity rounded-lg opacity-0 bg-gradient-to-r from-green-400/0 to-green-400/10 group-hover:opacity-100" />
                <span className="relative z-10 font-medium text-slate-300">{skill}</span>
              </div>
            ))}
          </div>

          {/* Neural Contact Button */}
          <div className="mt-12">
            <Link 
              href="/contact"
              className="relative inline-flex items-center px-8 overflow-hidden font-bold transition-all duration-300 border rounded-lg group glass-effect hover:scale-105 border-green-500/30 hover:border-green-400/50"
              style={{
                transform: `translateY(${Math.max(0, (1 - brainActivity) * 5)}px)`,
                opacity: Math.max(0.8, brainActivity * 0.6 + 0.4)
              }}
            >
              {/* Neural pulse background */}
              <div 
                className="absolute inset-0 transition-all duration-500 bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-green-500/10 group-hover:from-green-400/20 group-hover:via-cyan-400/20 group-hover:to-green-400/20"
                style={{ opacity: brainActivity * 0.5 + 0.3 }}
              />
              
              {/* Brain synapse effect */}
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 group-hover:opacity-100" />
              
              {/* Button content */}
              <div className="relative z-10 flex items-center h-10 space-x-2">
                <span className="text-lg heading-gradient">Connect Neural Pathways</span>
                <div className="w-2 h-2 transition-all duration-300 bg-green-400 rounded-full group-hover:w-3 group-hover:h-3 animate-pulse" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogsSkeleton() {
  return (
    <div className="page-section">
      <div className="content-wrapper">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-6xl heading-gradient">
            Neural Memories
          </h2>
          <div className="w-64 h-4 mx-auto rounded animate-pulse bg-slate-700"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative p-6 rounded-lg glass-effect animate-pulse">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
              <div className="w-3/4 h-6 mb-4 rounded bg-slate-700"></div>
              <div className="space-y-2">
                <div className="w-full h-4 rounded bg-slate-700"></div>
                <div className="w-2/3 h-4 rounded bg-slate-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}