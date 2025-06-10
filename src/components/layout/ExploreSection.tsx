'use client'

import { useState } from 'react'
import { ArrowRight, Github as GitHubIcon, ExternalLink, Sparkles } from 'lucide-react'
import { Project } from '@/types'

interface ExploreSectionProps {
  onNavigate: (section: string) => void
  projects?: Project[]
  brainActivity?: number
}

export function ExploreSection({ onNavigate, projects = [], brainActivity = 0.5 }: ExploreSectionProps) {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  // Use real projects data, limit to first 4 for homepage display
  const featuredProjects = projects.slice(0, 4)

  // Generate dynamic categories from real project data
  const projectCategories = featuredProjects.reduce((acc, project) => {
    const categoryName = project.category?.title || 'Other'
    if (!acc[categoryName]) {
      acc[categoryName] = { count: 0, projects: [] }
    }
    acc[categoryName].count++
    acc[categoryName].projects.push(project)
    return acc
  }, {} as Record<string, { count: number; projects: Project[] }>)

  const categories = Object.entries(projectCategories).map(([name, data]) => ({
    name,
    icon: getCategoryIcon(name),
    description: getCategoryDescription(name),
    projectCount: data.count,
  }))

  // Helper functions for category data
  function getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      'Web3': '🚀',
      'AI': '🤖',
      '3D': '🌟',
      'Fintech': '💰',
      'Security': '🔒',
      'Other': '⚡'
    }
    return iconMap[category] || '⚡'
  }

  function getCategoryDescription(category: string): string {
    const descMap: Record<string, string> = {
      'Web3': 'DeFi protocols, NFT platforms, and decentralized applications',
      'AI': 'Intelligent applications and automated content generation',
      '3D': 'Immersive 3D experiences and WebGL applications',
      'Fintech': 'Financial technology and payment solutions',
      'Security': 'Cybersecurity tools and blockchain security',
      'Other': 'Innovative solutions and cutting-edge projects'
    }
    return descMap[category] || 'Innovative solutions and cutting-edge projects'
  }

  // Get status color for projects
  function getStatusColor(status: string): string {
    switch (status) {
      case 'live': return 'text-green-300 bg-green-500/20'
      case 'beta': return 'text-cyan-300 bg-cyan-500/20'
      case 'development': return 'text-amber-300 bg-amber-500/20'
      case 'archived': return 'text-gray-300 bg-gray-500/20'
      default: return 'text-blue-300 bg-blue-500/20'
    }
  }

  // Get status label
  function getStatusLabel(status: string): string {
    switch (status) {
      case 'live': return 'Live'
      case 'beta': return 'Beta'
      case 'development': return 'In Development'
      case 'archived': return 'Archived'
      default: return 'Active'
    }
  }
  
  return (
    <section id="explore" className="page-section relative">
      <div className="content-wrapper max-w-7xl">
        {/* Section Header with Enhanced Neural Effects */}
        <div className="relative mb-16 text-center">
          {/* Neural activity background pulse */}
          <div 
            className="absolute inset-0 transition-all duration-1000 bg-gradient-to-r from-orange-500/10 via-amber-500/15 to-orange-600/10 rounded-3xl blur-xl"
            style={{ 
              opacity: brainActivity * 0.4,
              transform: `scale(${1 + brainActivity * 0.1})`
            }}
          />
          
          {/* Floating creativity particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[
              { left: 10, top: 20, delay: 0.5, duration: 4.2 },
              { left: 90, top: 30, delay: 1.8, duration: 3.6 },
              { left: 50, top: 80, delay: 1.1, duration: 4.8 },
              { left: 25, top: 60, delay: 2.3, duration: 3.2 },
              { left: 75, top: 15, delay: 0.4, duration: 5.1 }
            ].map((particle, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  opacity: 0.3 + brainActivity * 0.4,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10">
            <h2 className="mb-6 text-4xl font-bold md:text-6xl heading-gradient">
              Explore My Universe
            </h2>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-300">
              Journey through a collection of legendary projects that showcase the future 
              of web development, Web3 innovation, and AI integration.
            </p>
          </div>
        </div>
        
        {/* Enhanced Featured Projects Grid */}
        <div className="grid grid-cols-1 gap-8 mb-16 lg:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <div
              key={project._id}
              className={`group relative glass-effect p-8 transition-all duration-500 cursor-pointer transform hover:scale-[1.02] overflow-hidden ${
                hoveredProject === index ? 'border-orange-500/50 border-2 shadow-orange-500/20 shadow-2xl' : 'border-slate-700/30 border'
              }`}
              style={{
                transform: `translateY(${Math.max(0, (1 - brainActivity) * 5)}px)`,
                opacity: Math.max(0.8, brainActivity * 0.6 + 0.4)
              }}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => {
                if (project.slug?.current) {
                  window.location.href = `/explore/${project.slug.current}`
                } else {
                  onNavigate('explore')
                }
              }}
            >
              {/* Creativity neural glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-orange-600/10 transition-opacity duration-500 ${
                hoveredProject === index ? 'opacity-100' : 'opacity-0'
              }`} />
              
              {/* Neural pathway lines */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-orange-400/30 to-transparent" />
              
              {/* Project Header */}
              <div className="relative z-10 flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full glass-effect transition-all duration-300 ${
                    hoveredProject === index 
                      ? 'bg-orange-500/20 border-orange-400/50 border shadow-orange-400/20 shadow-lg' 
                      : 'bg-slate-800/50'
                  }`}>
                    <span className="text-2xl">{getCategoryIcon(project.category?.title || 'Other')}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-orange-100 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-orange-300 font-medium">
                      {project.category?.title || 'Project'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${getStatusColor(project.status)} ${
                    hoveredProject === index ? 'scale-105' : ''
                  }`}>
                    {getStatusLabel(project.status)}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 text-xs font-medium text-yellow-300 rounded-full bg-yellow-500/20 border border-yellow-400/30">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>
              
              {/* Project Description */}
              <div className="relative z-10 mb-6">
                <p className="leading-relaxed text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                  {project.description || 'An innovative project showcasing cutting-edge technology and creative solutions.'}
                </p>
              </div>
              
              {/* Enhanced Tech Stack */}
              <div className="relative z-10 flex flex-wrap gap-2 mb-6">
                {project.technologies?.slice(0, 4).map((tech, techIndex) => (
                  <span
                    key={tech}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 border ${
                      hoveredProject === index 
                        ? 'text-orange-200 bg-orange-500/20 border-orange-400/40 shadow-orange-400/20 shadow-sm' 
                        : 'text-orange-300 bg-orange-500/10 border-orange-500/20'
                    }`}
                    style={{
                      animationDelay: `${techIndex * 50}ms`,
                      transform: hoveredProject === index ? 'translateY(-1px)' : 'translateY(0)'
                    }}
                  >
                    {tech}
                  </span>
                )) || (
                  <span className="px-3 py-1.5 text-sm text-gray-400 rounded-full bg-gray-500/20 border border-gray-500/30">
                    Technologies coming soon
                  </span>
                )}
                {(project.technologies?.length || 0) > 4 && (
                  <span className="px-3 py-1.5 text-sm text-gray-400 rounded-full bg-gray-500/20 border border-gray-500/30">
                    +{(project.technologies?.length || 0) - 4} more
                  </span>
                )}
              </div>
              
              {/* Enhanced Project Links */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex space-x-4">
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      className="flex items-center space-x-2 text-gray-400 hover:text-orange-300 transition-all duration-300 group/link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GitHubIcon className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Code</span>
                    </a>
                  )}
                  {project.links?.live && (
                    <a
                      href={project.links.live}
                      className="flex items-center space-x-2 text-gray-400 hover:text-orange-300 transition-all duration-300 group/link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Live Demo</span>
                    </a>
                  )}
                </div>
                <ArrowRight className={`w-5 h-5 text-orange-400 transition-all duration-300 ${
                  hoveredProject === index ? 'translate-x-1 scale-110' : ''
                }`} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Categories Overview */}
        <div className="grid grid-cols-1 gap-6 mb-16 md:grid-cols-3">
          {categories.map((category, categoryIndex) => (
            <div
              key={category.name}
              className="group relative p-6 text-center transition-all duration-500 transform cursor-pointer glass-effect hover:scale-105 border border-slate-700/30 hover:border-orange-500/50 overflow-hidden"
              style={{
                animationDelay: `${categoryIndex * 100}ms`,
                transform: `translateY(${Math.max(0, (1 - brainActivity) * 8)}px)`,
                opacity: Math.max(0.7, brainActivity * 0.7 + 0.3)
              }}
              onClick={() => onNavigate('explore')}
            >
              {/* Category neural glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-amber-500/3 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Floating category particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[1, 2, 3].map((particle) => (
                  <div
                    key={particle}
                    className="absolute w-1 h-1 rounded-full bg-orange-400 animate-pulse"
                    style={{
                      left: `${20 + particle * 25}%`,
                      top: `${15 + particle * 20}%`,
                      animationDelay: `${particle * 0.5}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
              
              <div className="relative z-10">
                <div className="mb-4 text-5xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {category.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white group-hover:text-orange-100 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="mb-4 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {category.description}
                </p>
                <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-300 bg-orange-500/20 rounded-full border border-orange-500/30 group-hover:bg-orange-500/30 group-hover:border-orange-400/50 transition-all duration-300">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {category.projectCount} Projects
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Call to Action */}
        <div className="text-center">
          <div className="relative inline-block">
            {/* Neural glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-amber-500/30 to-orange-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <button
              onClick={() => onNavigate('explore')}
              className="relative group px-8 py-4 text-lg font-semibold text-white transition-all duration-500 transform rounded-full shadow-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 hover:scale-105 hover:shadow-orange-500/25 border border-orange-500/30 hover:border-orange-400/50"
              style={{
                transform: `translateY(${Math.max(0, (1 - brainActivity) * 3)}px)`,
                opacity: Math.max(0.9, brainActivity * 0.4 + 0.6)
              }}
            >
              {/* Button neural pathways */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent group-hover:via-orange-200/70 transition-colors duration-300" />
              <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent group-hover:via-orange-200/70 transition-colors duration-300" />
              
              <span className="flex items-center gap-3 relative z-10">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                View All Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              
              {/* Hover shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
