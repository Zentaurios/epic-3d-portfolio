'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ExternalLink, Github as GitHubIcon, Eye, ArrowRight, Sparkles, Star, Zap } from 'lucide-react'
import { getAllProjects, urlFor } from '@/lib/sanity/client'
import type { Project } from '@/types'

interface RelatedProjectsProps {
  currentSlug?: string
  maxProjects?: number
  projects?: Project[]
}

export function RelatedProjects({ currentSlug, maxProjects = 3, projects: initialProjects }: RelatedProjectsProps) {
  const [relatedProjects, setRelatedProjects] = useState<Project[]>(initialProjects || [])
  const [loading, setLoading] = useState(!initialProjects)
  
  useEffect(() => {
    // Only fetch if we don't already have the projects and we have a currentSlug
    if (!initialProjects && currentSlug) {
      async function fetchRelatedProjects() {
        try {
          const allProjects = await getAllProjects()
          
          // Filter out current project and get related projects
          const otherProjects = allProjects.filter((project: Project) => project.slug.current !== currentSlug)
          
          // Simple algorithm: prioritize same category, then featured, then random
          const sorted = otherProjects.sort((a: Project, b: Project) => {
            // Prioritize featured projects
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            
            // Then by priority
            return b.priority - a.priority
          })
          
          const selected = sorted.slice(0, maxProjects)
          setRelatedProjects(selected)
        } catch (error) {
          console.error('Failed to fetch related projects:', error)
          setRelatedProjects([])
        } finally {
          setLoading(false)
        }
      }
      
      fetchRelatedProjects()
    }
  }, [currentSlug, maxProjects, initialProjects])
  
  if (loading) {
    return <RelatedProjectsSkeleton />
  }
  
  if (relatedProjects.length === 0) {
    return null
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-emerald-400 bg-emerald-500/20'
      case 'beta': return 'text-cyan-400 bg-cyan-500/20'
      case 'development': return 'text-amber-400 bg-amber-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }
  
  return (
    <section className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-purple-400" />
            <h2 className="text-3xl md:text-4xl font-bold heading-gradient">
              More Epic Projects
            </h2>
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-gray-400 text-lg">
            Explore more innovative solutions from the project universe
          </p>
        </div>
        
        {/* Related Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProjects.map((project, index) => (
            <article
              key={project._id}
              className="group glass hover:glow-purple smooth-transition cursor-pointer transform hover:scale-105 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => window.location.href = `/explore/${project.slug.current}`}
            >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              
              {/* Project Image */}
              <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-600/20 relative overflow-hidden">
                {project.mainImage?.asset?.url ? (
                  <Image
                    src={urlFor(project.mainImage).width(400).height(225).url()}
                    alt={project.mainImage.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Eye className="w-12 h-12 text-purple-300 opacity-50" />
                  </div>
                )}
                
                {/* Category Label */}
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${project.category.color}-500/20 text-${project.category.color}-300`}>
                    {project.category.title}
                  </span>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-cyan-600/40 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center space-x-4">
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      className="p-3 glass rounded-full text-white hover:glow-purple smooth-transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GitHubIcon className="w-5 h-5" />
                    </a>
                  )}
                  {project.links?.live && (
                    <a
                      href={project.links.live}
                      className="p-3 glass rounded-full text-white hover:glow-cyan smooth-transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  <div className="p-3 glass rounded-full text-white">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              {/* Project Details */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 smooth-transition line-clamp-2">
                  {project.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-white/5 text-gray-300 rounded text-xs border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
                
                {/* Metrics */}
                {project.metrics && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {Object.entries(project.metrics).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-semibold text-white">{value}</div>
                        <div className="text-xs text-gray-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {project.links?.github && (
                      <div className="text-gray-400 hover:text-white smooth-transition">
                        <GitHubIcon className="w-4 h-4" />
                      </div>
                    )}
                    {project.links?.live && (
                      <div className="text-gray-400 hover:text-white smooth-transition">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-purple-400 group-hover:text-purple-300 smooth-transition">
                    <span className="text-sm font-medium">Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/explore'}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white font-semibold text-lg hover:from-purple-500 hover:to-cyan-500 smooth-transition glow-purple hover:scale-105 transform"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Explore All Projects
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

function RelatedProjectsSkeleton() {
  return (
    <section className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-8 bg-purple-500/20 rounded-lg mb-4 pulse-glow max-w-md mx-auto"></div>
          <div className="h-4 bg-gray-500/20 rounded-lg pulse-glow max-w-lg mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass p-6">
              <div className="aspect-video bg-purple-500/20 rounded-lg mb-6 pulse-glow"></div>
              <div className="h-6 bg-cyan-500/20 rounded mb-4 pulse-glow"></div>
              <div className="h-4 bg-gray-500/20 rounded mb-2 pulse-glow"></div>
              <div className="h-4 bg-gray-500/20 rounded mb-4 pulse-glow"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-purple-500/20 rounded pulse-glow"></div>
                <div className="h-6 w-16 bg-cyan-500/20 rounded pulse-glow"></div>
                <div className="h-6 w-16 bg-amber-500/20 rounded pulse-glow"></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-8 bg-emerald-500/20 rounded pulse-glow"></div>
                <div className="h-8 bg-cyan-500/20 rounded pulse-glow"></div>
                <div className="h-8 bg-amber-500/20 rounded pulse-glow"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
