'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github as GitHubIcon, Eye, Code, Zap, Star, ArrowRight } from 'lucide-react'
import { client, projectQueries, urlFor } from '@/lib/sanity/client'
import type { Project } from '@/types'

interface ProjectGridProps {
  initialProjects?: Project[]
  stats?: {
    totalProjects: number
    liveProjects: number
    categories: number
    technologies: number
    featuredProjects: number
  }
}

export function ProjectGrid({ initialProjects = [], stats }: ProjectGridProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [loading, setLoading] = useState(initialProjects.length === 0)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  // Only fetch if no initial projects provided
  useEffect(() => {
    if (initialProjects.length === 0) {
      async function fetchProjects() {
        try {
          setLoading(true)
          setError(null)
          const data = await client.fetch(projectQueries.getAllProjects)
          setProjects(data)
        } catch (err) {
          console.error('Error fetching projects:', err)
          setError('Failed to load projects. Please try again later.')
        } finally {
          setLoading(false)
        }
      }

      fetchProjects()
    } else {
      setLoading(false)
    }
  }, [initialProjects])
  // When we have real Sanity data, we'll convert this to server-side fetching

  // Get unique categories from projects
  const categories = ['All', ...Array.from(new Set(projects.map(project => project.category?.title || 'Uncategorized')))]

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => (project.category?.title || 'Uncategorized') === selectedCategory)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Web3': return 'purple'
      case 'AI': return 'cyan'
      case '3D': return 'emerald'
      case 'Fintech': return 'amber'
      case 'Security': return 'red'
      default: return 'gray'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-emerald-400 bg-emerald-500/20'
      case 'beta': return 'text-cyan-400 bg-cyan-500/20'
      case 'development': return 'text-amber-400 bg-amber-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  if (loading) {
    return <ProjectGridSkeleton />
  }

  if (error) {
    return <ErrorProjectsState error={error} onRetry={() => window.location.reload()} />
  }

  // Show empty state if no projects
  if (projects.length === 0) {
    return <EmptyProjectsState />
  }
  
  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl heading-gradient">
            Featured Projects
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-400">
            A showcase of innovative solutions that demonstrate expertise across 
            multiple domains and cutting-edge technologies.
          </p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full smooth-transition font-medium ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white glow-purple'
                  : 'glass text-gray-300 hover:text-white hover:bg-purple-600/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link
              key={project._id}
              href={`/explore/${project.slug.current}`}
              className="block"
            >
              <article
                className={`group glass hover:glow-purple smooth-transition cursor-pointer transform hover:scale-105 relative overflow-hidden ${
                  project.featured ? 'glow-cyan' : ''
                }`}
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute z-10 top-4 left-4">
                  <div className="flex items-center px-3 py-1 space-x-1 text-xs font-medium text-white rounded-full bg-gradient-to-r from-purple-600 to-cyan-600">
                    <Star className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute z-10 top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              {/* Project Image */}
              <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-600/20">
                {project.mainImage?.asset?.url ? (
                  <Image
                    src={urlFor(project.mainImage).width(500).height(300).url()}
                    alt={project.mainImage.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code className="w-16 h-16 text-purple-300 opacity-50" />
                  </div>
                )}
                
                {/* Category Overlay */}
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(project.category?.title || 'Uncategorized')}-500/20 text-${getCategoryColor(project.category?.title || 'Uncategorized')}-300`}>
                    {project.category?.title || 'Uncategorized'}
                  </span>
                </div>
                
                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/40 to-cyan-600/40 flex items-center justify-center space-x-4 transition-opacity duration-300 ${
                  hoveredProject === project._id ? 'opacity-100' : 'opacity-0'
                }`}>
                  {project.links?.github && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open(project.links?.github || '', '_blank', 'noopener,noreferrer')
                      }}
                      className="p-3 text-white rounded-full glass hover:glow-purple smooth-transition"
                      title="View on GitHub"
                    >
                      <GitHubIcon className="w-5 h-5" />
                    </button>
                  )}
                  {project.links?.live && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open(project.links?.live || '', '_blank', 'noopener,noreferrer')
                      }}
                      className="p-3 text-white rounded-full glass hover:glow-cyan smooth-transition"
                      title="View Live Demo"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  )}
                  <button className="p-3 text-white rounded-full glass hover:glow-amber smooth-transition">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Project Details */}
              <div className="p-6">
                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-white group-hover:text-purple-300 smooth-transition">
                  {project.title}
                </h3>
                
                {/* Description */}
                <p className="mb-4 leading-relaxed text-gray-300 line-clamp-2">
                  {project.description}
                </p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs text-gray-300 border rounded bg-white/5 border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                  {(project.technologies?.length || 0) > 3 && (
                    <span className="px-2 py-1 text-xs text-purple-300 rounded bg-purple-500/20">
                      +{(project.technologies?.length || 0) - 3}
                    </span>
                  )}
                </div>
                
                {/* Metrics */}
                {project.metrics && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-semibold text-white">{value}</div>
                        <div className="text-xs text-gray-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {project.links?.github && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          window.open(project.links?.github || '', '_blank', 'noopener,noreferrer')
                        }}
                        className="text-gray-400 hover:text-white smooth-transition"
                        title="View on GitHub"
                      >
                        <GitHubIcon className="w-4 h-4" />
                      </button>
                    )}
                    {project.links?.live && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          window.open(project.links?.live || '', '_blank', 'noopener,noreferrer')
                        }}
                        className="text-gray-400 hover:text-white smooth-transition"
                        title="View Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-purple-400 group-hover:text-purple-300 smooth-transition">
                    <span className="text-sm font-medium">Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
                  </div>
                </div>
              </div>
            </article>
            </Link>
          ))}
        </div>
        
        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="px-8 py-4 font-semibold text-purple-300 transform border rounded-full group glass border-purple-500/50 hover:bg-purple-600/20 smooth-transition hover:scale-105">
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              View All Projects
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
            </span>
          </button>
        </div>
        
        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-6 mt-16 md:grid-cols-4">
          <div className="p-6 text-center glass hover:glow-purple smooth-transition">
            <div className="mb-2 text-3xl font-bold text-purple-300">{stats?.totalProjects || projects.length}+</div>
            <div className="text-gray-400">Total Projects</div>
          </div>
          <div className="p-6 text-center glass hover:glow-cyan smooth-transition">
            <div className="mb-2 text-3xl font-bold text-cyan-300">{stats?.liveProjects || 0}+</div>
            <div className="text-gray-400">Live Projects</div>
          </div>
          <div className="p-6 text-center glass hover:glow-amber smooth-transition">
            <div className="mb-2 text-3xl font-bold text-amber-300">{stats?.featuredProjects || 0}+</div>
            <div className="text-gray-400">Featured Projects</div>
          </div>
          <div className="p-6 text-center glass hover:glow-emerald smooth-transition">
            <div className="mb-2 text-3xl font-bold text-emerald-300">{stats?.technologies || 0}+</div>
            <div className="text-gray-400">Technologies Used</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Loading skeleton component
export function ProjectGridSkeleton() {
  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header skeleton */}
        <div className="mb-12 text-center">
          <div className="h-12 mx-auto mb-6 rounded-lg bg-gray-700/30 w-96 animate-pulse" />
          <div className="w-2/3 h-6 mx-auto rounded bg-gray-700/20 animate-pulse" />
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[...Array(6)].map((_, i) => (
            <div key={`filter-skeleton-${i}`} className="w-20 h-12 rounded-full bg-gray-700/20 animate-pulse" />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={`project-skeleton-${i}`} className="overflow-hidden glass">
              <div className="aspect-video bg-gray-700/30 animate-pulse" />
              <div className="p-6">
                <div className="h-6 mb-3 rounded bg-gray-700/30 animate-pulse" />
                <div className="h-4 mb-2 rounded bg-gray-700/20 animate-pulse" />
                <div className="w-3/4 h-4 mb-4 rounded bg-gray-700/20 animate-pulse" />
                <div className="flex gap-2 mb-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={`tech-skeleton-${i}-${j}`} className="w-16 h-6 rounded bg-gray-700/20 animate-pulse" />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={`stat-skeleton-${i}-${j}`} className="text-center">
                      <div className="h-4 mb-1 rounded bg-gray-700/30 animate-pulse" />
                      <div className="h-3 rounded bg-gray-700/20 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Empty state component
function EmptyProjectsState() {
  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl heading-gradient">
            Creative Nexus
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-400">
            The neural pathways are being forged. Projects are currently being uploaded 
            to the creative consciousness matrix.
          </p>
        </div>

        {/* Empty State Visualization */}
        <div className="max-w-2xl mx-auto">
          <div className="relative p-12 overflow-hidden text-center border glass border-cyan-500/20">
            {/* Neural activity background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5" />
            
            {/* Creative consciousness icon */}
            <div className="relative mb-8">
              <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                <Code className="w-12 h-12 text-cyan-400" />
                
                {/* Neural sparks */}
                <div className="absolute w-4 h-4 rounded-full -top-2 -right-2 bg-cyan-400 animate-ping" />
                <div className="absolute w-3 h-3 delay-700 bg-purple-400 rounded-full -bottom-2 -left-2 animate-ping" />
                <div className="absolute w-2 h-2 delay-1000 rounded-full top-1/2 -left-4 bg-emerald-400 animate-ping" />
              </div>
            </div>

            <h3 className="mb-4 text-2xl font-bold text-white">
              Neural Networks Initializing
            </h3>
            
            <p className="mb-8 leading-relaxed text-gray-300">
              The creative synapses are firing and connecting. Soon this space will 
              showcase innovative projects spanning Web3, AI, and immersive digital experiences.
            </p>

            {/* Coming Soon Features */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
              <div className="p-4 border rounded-lg bg-white/5 border-cyan-500/20">
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-3 rounded-lg bg-cyan-500/20">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-sm font-medium text-cyan-300">Web3 dApps</div>
                <div className="mt-1 text-xs text-gray-400">Decentralized innovations</div>
              </div>
              
              <div className="p-4 border rounded-lg bg-white/5 border-purple-500/20">
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-3 rounded-lg bg-purple-500/20">
                  <Star className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-sm font-medium text-purple-300">AI Solutions</div>
                <div className="mt-1 text-xs text-gray-400">Intelligent systems</div>
              </div>
              
              <div className="p-4 border rounded-lg bg-white/5 border-emerald-500/20">
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-3 rounded-lg bg-emerald-500/20">
                  <Eye className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-sm font-medium text-emerald-300">3D Experiences</div>
                <div className="mt-1 text-xs text-gray-400">Immersive interfaces</div>
              </div>
            </div>

            {/* Placeholder stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-cyan-300">∞</div>
                <div className="text-xs text-gray-400">Possibilities</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-purple-300">⚡</div>
                <div className="text-xs text-gray-400">Innovation</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-emerald-300">🚀</div>
                <div className="text-xs text-gray-400">Launch Ready</div>
              </div>
            </div>

            {/* Neural activity indicators */}
            <div className="absolute flex gap-1 bottom-4 right-4">
              <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
              <div className="w-1 h-1 delay-300 bg-purple-400 rounded-full animate-ping" />
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping delay-600" />
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="mb-6 text-gray-400">
              Want to see specific projects? Connect with the neural network administrator.
            </p>
            <button className="px-6 py-3 font-medium transform border rounded-full group glass border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/20 smooth-transition hover:scale-105">
              <span className="flex items-center gap-2">
                Initiate Contact
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Error state component
function ErrorProjectsState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl heading-gradient">
            Neural Network Disruption
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-400">
            The creative consciousness experienced a temporary disconnect. 
            Neural pathways are being re-established.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative p-12 overflow-hidden text-center border glass border-red-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-amber-500/5" />
            
            <div className="relative mb-8">
              <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-500/20 to-amber-500/20">
                <Zap className="w-12 h-12 text-red-400" />
                <div className="absolute w-4 h-4 bg-red-400 rounded-full -top-2 -right-2 animate-ping" />
                <div className="absolute w-3 h-3 delay-700 rounded-full -bottom-2 -left-2 bg-amber-400 animate-ping" />
              </div>
            </div>

            <h3 className="mb-4 text-2xl font-bold text-white">
              Connection Interrupted
            </h3>
            
            <p className="mb-6 leading-relaxed text-gray-300">
              {error}
            </p>

            <button 
              onClick={onRetry}
              className="px-6 py-3 font-medium text-white transform rounded-full group bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 smooth-transition hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Reconnect Neural Pathways
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
