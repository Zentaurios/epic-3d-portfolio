'use client'

import { useState } from 'react'
import { ArrowRight, Github as GitHubIcon, ExternalLink, Sparkles, Zap, Globe, Code2 } from 'lucide-react'
import { Project } from '@/types'

interface ExploreSectionProps {
  onNavigate: (section: string) => void
  brainActivity?: number
  projects?: Project[]
}

export function ExploreSection({ onNavigate, brainActivity = 0, projects = [] }: ExploreSectionProps) {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  
  // Brain activity affects visual intensity
  const activityIntensity = Math.min(Math.max(brainActivity, 0.3), 1)
  const creativityPulse = brainActivity * 1.2 // Higher multiplier for creativity region

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
    <section id="explore" className="page-section">
      <div className="content-wrapper max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-6xl heading-gradient">
            Explore My Universe
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-400">
            Journey through a collection of legendary projects that showcase the future 
            of web development, Web3 innovation, and AI integration.
          </p>
        </div>
        
        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 gap-8 mb-16 lg:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <div
              key={project._id}
              className={`glass-effect p-8 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                hoveredProject === index ? 'border-cyan-500/50' : ''
              }`}
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
              {/* Project Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full glass-effect">
                    {getCategoryIcon(project.category?.title || 'Other')}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                    <p className="text-sm text-purple-300">
                      {project.category?.title || 'Project'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 text-xs font-medium text-yellow-300 rounded-full bg-yellow-500/20">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              {/* Project Description */}
              <p className="mb-6 leading-relaxed text-gray-300">
                {project.description || 'An innovative project showcasing cutting-edge technology and creative solutions.'}
              </p>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies?.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm text-purple-300 rounded-full bg-purple-500/20"
                  >
                    {tech}
                  </span>
                )) || (
                  <span className="px-3 py-1 text-sm text-gray-400 rounded-full bg-gray-500/20">
                    Technologies coming soon
                  </span>
                )}
                {(project.technologies?.length || 0) > 4 && (
                  <span className="px-3 py-1 text-sm text-gray-400 rounded-full bg-gray-500/20">
                    +{(project.technologies?.length || 0) - 4} more
                  </span>
                )}
              </div>
              
              {/* Project Links */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white smooth-transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GitHubIcon className="w-4 h-4" />
                      <span className="text-sm">Code</span>
                    </a>
                  )}
                  {project.links?.live && (
                    <a
                      href={project.links.live}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white smooth-transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">Live Demo</span>
                    </a>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Categories Overview */}
        <div className="grid grid-cols-1 gap-6 mb-16 md:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="p-6 text-center transform cursor-pointer glass-effect transition-all duration-300 hover:scale-105"
              onClick={() => onNavigate('explore')}
            >
              <div className="mb-4 text-4xl">{category.icon}</div>
              <h3 className="mb-3 text-xl font-semibold text-white">{category.name}</h3>
              <p className="mb-4 text-sm text-gray-400">{category.description}</p>
              <div className="text-sm font-medium text-purple-300">
                {category.projectCount} Projects
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('explore')}
            className="relative px-8 py-4 text-lg font-semibold text-white transform rounded-full group bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              View All Projects
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
            </span>
            <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 smooth-transition" />
          </button>
        </div>
      </div>
    </section>
  )
}

const featuredProjects = [
  {
    id: 1,
    title: 'DeFi Galaxy Protocol',
    category: 'Web3 • DeFi',
    description: 'A revolutionary decentralized finance protocol that enables cross-chain liquidity mining with AI-powered yield optimization. Features include automated portfolio rebalancing, smart contract security audits, and gasless transactions.',
    technologies: ['Solidity', 'React', 'Web3.js', 'Chainlink', 'IPFS'],
    status: 'development' as const,
    icon: <Zap className="w-6 h-6 text-amber-300" />,
    links: {
      github: 'https://github.com',
      live: null,
    },
  },
  {
    id: 2,
    title: 'Neural Content Engine',
    category: 'AI • Content Generation',
    description: 'An advanced AI-powered content generation platform that creates personalized blog posts, social media content, and technical documentation. Utilizes GPT-4 integration with custom fine-tuning for technical accuracy.',
    technologies: ['Python', 'OpenAI API', 'Next.js', 'Prisma', 'Vercel'],
    status: 'live' as const,
    icon: <Code2 className="w-6 h-6 text-cyan-300" />,
    links: {
      github: 'https://github.com/Zentaurios',
      live: 'https://neural-content.demo',
    },
  },
  {
    id: 3,
    title: 'Metaverse Portfolio Hub',
    category: '3D • WebGL',
    description: 'An immersive 3D portfolio experience built with Three.js and React Three Fiber. Features real-time physics simulations, procedural generation, and WebXR support for VR/AR experiences.',
    technologies: ['Three.js', 'React', 'WebGL', 'GLSL', 'Blender'],
    status: 'live' as const,
    icon: <Globe className="w-6 h-6 text-purple-300" />,
    links: {
      github: 'https://github.com',
      live: 'https://metaverse-portfolio.demo',
    },
  },
  {
    id: 4,
    title: 'Smart Contract Auditor',
    category: 'Security • Automation',
    description: 'Automated smart contract security analysis tool that identifies vulnerabilities, gas optimization opportunities, and provides detailed security reports. Features machine learning-based pattern recognition.',
    technologies: ['Rust', 'Solidity', 'Machine Learning', 'Docker', 'GraphQL'],
    status: 'development' as const,
    icon: <Sparkles className="w-6 h-6 text-green-300" />,
    links: {
      github: 'https://github.com',
      live: null,
    },
  },
]

const categories = [
  {
    name: 'Web3 & Blockchain',
    icon: '🚀',
    description: 'DeFi protocols, NFT platforms, and decentralized applications',
    projectCount: 8,
  },
  {
    name: 'AI & Machine Learning',
    icon: '🤖',
    description: 'Intelligent applications and automated content generation',
    projectCount: 6,
  },
  {
    name: '3D & Interactive',
    icon: '🌟',
    description: 'Immersive 3D experiences and WebGL applications',
    projectCount: 4,
  },
]
