'use client'

import { useState, useEffect } from 'react'
import { Zap, Code, Database, Palette, Shield, Globe, Cpu, Layers } from 'lucide-react'
import { getTechStats } from '@/lib/sanity/client'

const techCategories = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: Palette,
    color: 'purple',
    technologies: [
      { name: 'React', level: 95, experience: '5+ years' },
      { name: 'Next.js', level: 90, experience: '3+ years' },
      { name: 'TypeScript', level: 88, experience: '4+ years' },
      { name: 'Three.js', level: 85, experience: '2+ years' },
      { name: 'TailwindCSS', level: 92, experience: '3+ years' },
      { name: 'Framer Motion', level: 80, experience: '2+ years' },
    ]
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: Database,
    color: 'cyan',
    technologies: [
      { name: 'Node.js', level: 90, experience: '4+ years' },
      { name: 'Python', level: 85, experience: '3+ years' },
      { name: 'PostgreSQL', level: 82, experience: '3+ years' },
      { name: 'Redis', level: 78, experience: '2+ years' },
      { name: 'GraphQL', level: 80, experience: '2+ years' },
      { name: 'Docker', level: 75, experience: '2+ years' },
    ]
  },
  {
    id: 'blockchain',
    label: 'Blockchain',
    icon: Shield,
    color: 'amber',
    technologies: [
      { name: 'Solidity', level: 88, experience: '3+ years' },
      { name: 'Ethereum', level: 85, experience: '3+ years' },
      { name: 'Web3.js', level: 82, experience: '2+ years' },
      { name: 'Hardhat', level: 80, experience: '2+ years' },
      { name: 'IPFS', level: 75, experience: '2+ years' },
      { name: 'Polygon', level: 78, experience: '1+ years' },
    ]
  },
  {
    id: 'ai',
    label: 'AI & ML',
    icon: Cpu,
    color: 'emerald',
    technologies: [
      { name: 'TensorFlow', level: 80, experience: '2+ years' },
      { name: 'PyTorch', level: 75, experience: '2+ years' },
      { name: 'OpenAI API', level: 85, experience: '2+ years' },
      { name: 'LangChain', level: 78, experience: '1+ years' },
      { name: 'Hugging Face', level: 72, experience: '1+ years' },
      { name: 'Scikit-learn', level: 80, experience: '2+ years' },
    ]
  },
]

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState('frontend')
  const [animationKey, setAnimationKey] = useState(0)
  const [techStats, setTechStats] = useState({
    totalTechnologies: 25,
    uniqueCategories: 8,
    totalProjects: 100,
    activeTechnologies: []
  })
  
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [activeCategory])

  useEffect(() => {
    async function fetchTechStats() {
      try {
        const stats = await getTechStats()
        setTechStats(stats)
      } catch (error) {
        console.error('Failed to fetch tech stats:', error)
        // Keep default values on error
      }
    }
    
    fetchTechStats()
  }, [])
  
  const currentCategory = techCategories.find(cat => cat.id === activeCategory)!
  
  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 heading-gradient">
            Technology Arsenal
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A comprehensive toolkit spanning modern web development, blockchain innovation, 
            and artificial intelligence. Each technology mastered through real-world application.
          </p>
        </div>
        
        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {techCategories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group flex items-center space-x-3 px-6 py-4 rounded-xl smooth-transition font-medium ${
                  isActive
                    ? `glow-${category.color} bg-${category.color}-600/20 text-${category.color}-300`
                    : 'glass text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  isActive ? `text-${category.color}-400` : 'text-gray-400 group-hover:text-white'
                }`} />
                <span>{category.label}</span>
              </button>
            )
          })}
        </div>
        
        {/* Technology Grid */}
        <div key={animationKey} className="glass-dark p-8 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategory.technologies.map((tech, index) => (
              <div
                key={tech.name}
                className="group p-6 glass rounded-xl hover:glow-purple smooth-transition"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Tech Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 smooth-transition">
                    {tech.name}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {tech.experience}
                  </span>
                </div>
                
                {/* Skill Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Proficiency</span>
                    <span className="text-sm font-medium text-white">{tech.level}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-${currentCategory.color}-600 to-${currentCategory.color}-400 rounded-full smooth-transition`}
                      style={{ 
                        width: `${tech.level}%`,
                        animation: `growWidth 1s ease-out ${index * 100}ms forwards`
                      }}
                    />
                  </div>
                </div>
                
                {/* Skill Level Indicator */}
                <div className="mt-4 flex items-center space-x-2">
                  {tech.level >= 90 && (
                    <>
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-amber-400 font-medium">Expert</span>
                    </>
                  )}
                  {tech.level >= 80 && tech.level < 90 && (
                    <>
                      <Code className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium">Advanced</span>
                    </>
                  )}
                  {tech.level >= 70 && tech.level < 80 && (
                    <>
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-cyan-400 font-medium">Proficient</span>
                    </>
                  )}
                  {tech.level < 70 && (
                    <>
                      <Globe className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-purple-400 font-medium">Intermediate</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="glass p-6 text-center hover:glow-purple smooth-transition">
            <div className="text-3xl font-bold text-purple-300 mb-2">{techStats.totalTechnologies}+</div>
            <div className="text-gray-400">Technologies</div>
          </div>
          <div className="glass p-6 text-center hover:glow-cyan smooth-transition">
            <div className="text-3xl font-bold text-cyan-300 mb-2">8</div>
            <div className="text-gray-400">Years Experience</div>
          </div>
          <div className="glass p-6 text-center hover:glow-amber smooth-transition">
            <div className="text-3xl font-bold text-amber-300 mb-2">{techStats.totalProjects}+</div>
            <div className="text-gray-400">Projects Built</div>
          </div>
          <div className="glass p-6 text-center hover:glow-emerald smooth-transition">
            <div className="text-3xl font-bold text-emerald-300 mb-2">24/7</div>
            <div className="text-gray-400">Learning Mode</div>
          </div>
        </div>
        
        {/* Learning Philosophy */}
        <div className="glass-dark p-8 mt-12 text-center rounded-2xl">
          <h3 className="text-2xl font-bold text-white mb-4">Continuous Evolution</h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Technology never stands still, and neither do I. Every day brings new frameworks, 
            tools, and paradigms to explore. My approach combines deep expertise in proven 
            technologies with aggressive adoption of emerging innovations.
          </p>
          
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 rounded-full">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Always Learning</span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes growWidth {
          from {
            width: 0%;
          }
          to {
            width: var(--target-width);
          }
        }
      `}</style>
    </section>
  )
}

// TechStackSkeleton component for loading state
export function TechStackSkeleton() {
  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-700/30 rounded-lg w-80 mx-auto mb-6 animate-pulse" />
          <div className="h-6 bg-gray-700/20 rounded w-2/3 mx-auto animate-pulse" />
        </div>

        {/* Category tabs skeleton */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[...Array(5)].map((_, i) => (
            <div key={`tech-category-skeleton-${i}`} className="h-12 w-24 bg-gray-700/20 rounded-full animate-pulse" />
          ))}
        </div>

        {/* Tech grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...Array(6)].map((_, i) => (
            <div key={`tech-item-skeleton-${i}`} className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-700/30 rounded w-20 animate-pulse" />
                <div className="h-5 bg-gray-700/20 rounded w-16 animate-pulse" />
              </div>
              <div className="mb-4">
                <div className="h-2 bg-gray-700/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-700/40 rounded-full animate-pulse" style={{ width: '70%' }} />
                </div>
              </div>
              <div className="h-4 bg-gray-700/20 rounded w-24 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={`stat-skeleton-${i}`} className="glass p-6 text-center">
              <div className="h-8 bg-gray-700/30 rounded w-16 mx-auto mb-2 animate-pulse" />
              <div className="h-4 bg-gray-700/20 rounded w-20 mx-auto animate-pulse" />
            </div>
          ))}
        </div>

        {/* Philosophy section skeleton */}
        <div className="glass-dark p-8 rounded-2xl">
          <div className="h-8 bg-gray-700/30 rounded w-64 mx-auto mb-4 animate-pulse" />
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="h-4 bg-gray-700/20 rounded animate-pulse" />
            <div className="h-4 bg-gray-700/20 rounded w-5/6 mx-auto animate-pulse" />
            <div className="h-4 bg-gray-700/20 rounded w-4/5 mx-auto animate-pulse" />
          </div>
          <div className="h-8 bg-gray-700/20 rounded-full w-32 mx-auto mt-6 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
