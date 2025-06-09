'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Github as GitHubIcon, Calendar, Zap, Star, Eye, Code, Shield, Globe } from 'lucide-react'
import { getProjectBySlug, urlFor } from '@/lib/sanity/client'
import { PortableText } from '@portabletext/react'
import type { Project } from '@/types'

interface ProjectDetailProps {
  slug?: string
  project?: Project
}

export function ProjectDetail({ slug, project: initialProject }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(initialProject || null)
  const [loading, setLoading] = useState(!initialProject)
  const [activeTab, setActiveTab] = useState('overview')
  
  useEffect(() => {
    // Only fetch if we don't already have the project and we have a slug
    if (!initialProject && slug) {
      async function fetchProject() {
        try {
          const projectData = await getProjectBySlug(slug!)
          if (!projectData) {
            throw new Error('Project not found')
          }
          setProject(projectData)
        } catch (error) {
          console.error('Failed to fetch project:', error)
          setProject(null)
        } finally {
          setLoading(false)
        }
      }
      
      fetchProject()
    }
  }, [slug, initialProject])
  
  if (loading) {
    return <ProjectDetailSkeleton />
  }
  
  if (!project) {
    return <ProjectNotFound />
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-emerald-400 bg-emerald-500/20'
      case 'beta': return 'text-cyan-400 bg-cyan-500/20'
      case 'development': return 'text-amber-400 bg-amber-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }
  
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'web3': return Shield
      case 'ai': return Zap
      case '3d': return Eye
      case 'fintech': return Globe
      default: return Code
    }
  }
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'features', label: 'Features', icon: Star },
    { id: 'tech', label: 'Technology', icon: Code },
    { id: 'challenges', label: 'Challenges', icon: Zap },
  ]
  
  return (
    <article className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 smooth-transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Projects</span>
          </button>
        </div>
        
        {/* Hero Section */}
        <header className="glass-dark p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Project Info */}
            <div className="space-y-6">
              {/* Status and Category */}
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <div className="flex items-center space-x-2">
                  {React.createElement(getCategoryIcon(project.category.title), { 
                    className: `w-4 h-4 text-${project.category.color}-400` 
                  })}
                  <span className={`text-${project.category.color}-300 text-sm font-medium`}>
                    {project.category.title}
                  </span>
                </div>
                {project.featured && (
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <Star className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                )}
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold heading-gradient leading-tight">
                {project.title}
              </h1>
              
              {/* Description */}
              <p className="text-xl text-gray-300 leading-relaxed">
                {project.description}
              </p>
              
              {/* Metrics */}
              {project.metrics && (
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key} className="glass p-4 text-center">
                      <div className="text-lg font-bold text-white">{value}</div>
                      <div className="text-sm text-gray-400 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.links?.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white font-semibold hover:from-purple-500 hover:to-cyan-500 smooth-transition"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Live Demo</span>
                  </a>
                )}
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 glass border border-purple-500/50 rounded-lg text-purple-300 font-semibold hover:bg-purple-600/20 smooth-transition"
                  >
                    <GitHubIcon className="w-5 h-5" />
                    <span>View Code</span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Project Image */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                {project.mainImage?.asset?.url ? (
                  <Image
                    src={urlFor(project.mainImage).width(600).height(338).url()}
                    alt={project.mainImage.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                ) : (
                  <div className="text-center">
                    <Eye className="w-16 h-16 text-purple-300 opacity-50 mx-auto mb-4" />
                    <p className="text-gray-400">{project.mainImage?.alt || project.title}</p>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="glass-dark mb-8">
              <div className="flex flex-wrap border-b border-white/10">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium smooth-transition ${
                        activeTab === tab.id
                          ? 'text-purple-300 border-b-2 border-purple-500'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="glass p-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Project Overview</h2>
                  {project.longDescription ? (
                    <PortableText value={project.longDescription} />
                  ) : (
                    <div className="space-y-4 text-gray-300">
                      <p>
                        This project represents a significant step forward in {project.category.title.toLowerCase()} 
                        development, combining cutting-edge technologies with innovative design patterns 
                        to create a truly exceptional user experience.
                      </p>
                      <p>
                        Built with modern development practices and a focus on scalability, 
                        performance, and user experience, this project showcases the potential 
                        of emerging technologies in real-world applications.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'features' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
                  {project.highlights && project.highlights.length > 0 ? (
                    <ul className="space-y-3">
                      {project.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-4 text-gray-300">
                      <p>Key features of this project include:</p>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-3">
                          <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>Modern, responsive user interface</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>High-performance architecture</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>Scalable and maintainable codebase</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>Comprehensive testing and documentation</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'tech' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Technology Stack</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.technologies.map((tech) => (
                      <div
                        key={tech}
                        className="glass p-4 text-center hover:glow-purple smooth-transition"
                      >
                        <Code className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-white font-medium">{tech}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'challenges' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Technical Challenges</h2>
                  {project.challenges && project.challenges.length > 0 ? (
                    <div className="space-y-6">
                      {project.challenges.map((challenge, index) => (
                        <div key={index} className="glass p-6">
                          <h3 className="text-lg font-semibold text-purple-300 mb-3">
                            {challenge.challenge}
                          </h3>
                          <p className="text-gray-300 leading-relaxed">
                            {challenge.solution}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-300">
                      <p>
                        Every project comes with its unique set of challenges. This project 
                        involved solving complex technical problems and implementing innovative 
                        solutions to deliver the best possible user experience.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Links */}
            {project.links && (
              <div className="glass p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Project Links</h3>
                <div className="space-y-3">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 glass rounded-lg hover:glow-cyan smooth-transition"
                    >
                      <ExternalLink className="w-5 h-5 text-cyan-400" />
                      <span className="text-white">Live Demo</span>
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 glass rounded-lg hover:glow-purple smooth-transition"
                    >
                      <GitHubIcon className="w-5 h-5 text-purple-400" />
                      <span className="text-white">Source Code</span>
                    </a>
                  )}
                  {project.links.docs && (
                    <a
                      href={project.links.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 glass rounded-lg hover:glow-amber smooth-transition"
                    >
                      <Eye className="w-5 h-5 text-amber-400" />
                      <span className="text-white">Documentation</span>
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {/* Project Details */}
            <div className="glass p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Category</div>
                  <div className={`text-${project.category.color}-300 font-medium`}>
                    {project.category.title}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Status</div>
                  <div className="text-white font-medium capitalize">{project.status}</div>
                </div>
                {project.completedAt && (
                  <div>
                    <div className="text-sm text-gray-400">Completed</div>
                    <div className="text-white font-medium">
                      {new Date(project.completedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function ProjectDetailSkeleton() {
  return (
    <article className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="h-6 w-32 bg-purple-500/20 rounded mb-8 pulse-glow"></div>
        <div className="glass-dark p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-8 bg-purple-500/20 rounded-lg pulse-glow"></div>
              <div className="h-4 bg-gray-500/20 rounded-lg pulse-glow"></div>
              <div className="h-4 bg-gray-500/20 rounded-lg w-2/3 pulse-glow"></div>
            </div>
            <div className="aspect-video bg-purple-500/20 rounded-lg pulse-glow"></div>
          </div>
        </div>
      </div>
    </article>
  )
}

function ProjectNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center glass-dark p-8 max-w-md">
        <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
        <p className="text-gray-400 mb-6">
          The project you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 smooth-transition"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
