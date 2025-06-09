'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Calendar, Clock, Eye, ChevronRight } from 'lucide-react'
import { urlFor } from '@/lib/sanity/client'
import { BlogPost } from '@/types'

interface LatestBlogsProps {
  blogs?: BlogPost[]
  onNavigate: (section: string) => void
  brainActivity?: number
}

export function LatestBlogs({ blogs = [], onNavigate, brainActivity = 0.5 }: LatestBlogsProps) {
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null)
  
  // Use provided blogs or fall back to minimal default
  const displayBlogs = blogs.length > 0 ? blogs : [
    {
      _id: 'fallback-1',
      title: 'Welcome to Webb3Fitty',
      slug: { current: 'welcome' },
      excerpt: 'Exploring the intersection of Web3, AI, and immersive digital experiences.',
      publishedAt: '2025-01-15',
      estimatedReadTime: 5,
      featured: false,
      author: { name: 'Webb3Fitty', slug: { current: 'webb3fitty' }, _id: '1' },
      categories: [{ title: 'Welcome', slug: { current: 'welcome' }, color: '#8B5CF6', _id: '1' }],
      mainImage: null
    }
  ]
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryDisplay = (categories: BlogPost['categories']) => {
    if (!categories) return []
    return categories.map(cat => typeof cat === 'string' ? cat : cat.title)
  }
  
  return (
    <section id="blog" className="flex items-center justify-center min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-6xl heading-gradient">
            Latest Insights
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-400">
            Dive deep into the latest trends, tutorials, and thought leadership 
            in Web3, AI, and cutting-edge development practices.
          </p>
        </div>
        
        {/* Featured Blog Post */}
        {displayBlogs[0] && (
          <div className="glass-dark p-8 mb-12 hover:glow-purple smooth-transition cursor-pointer transform hover:scale-[1.02]"
               onClick={() => onNavigate('blog')}>
            <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Blog Content */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="px-3 py-1 font-medium text-purple-300 rounded-full bg-purple-500/20">
                    Featured
                  </span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(displayBlogs[0].publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{displayBlogs[0].estimatedReadTime} min read</span>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold leading-tight text-white md:text-4xl hover:text-purple-300 smooth-transition">
                  {displayBlogs[0].title}
                </h3>
                
                <p className="text-lg leading-relaxed text-gray-300">
                  {displayBlogs[0].excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {getCategoryDisplay(displayBlogs[0].categories).map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm rounded-full bg-cyan-500/20 text-cyan-300"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 font-medium text-purple-400 hover:text-purple-300 smooth-transition">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Blog Image */}
              <div className="relative">
                {displayBlogs[0].mainImage ? (
                  <div className="relative overflow-hidden rounded-lg aspect-video">
                    <Image
                      src={urlFor(displayBlogs[0].mainImage).width(600).height(400).url()}
                      alt={displayBlogs[0].mainImage.alt || displayBlogs[0].title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-lg aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-600/20 glass">
                    <Eye className="w-16 h-16 text-purple-300 opacity-50" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2">
          {displayBlogs.slice(1).map((blog) => (
            <div
              key={blog._id}
              className={`glass p-6 hover:glow-cyan smooth-transition cursor-pointer transform hover:scale-105 ${
                hoveredBlog === blog._id ? 'glow-purple' : ''
              }`}
              onMouseEnter={() => setHoveredBlog(blog._id)}
              onMouseLeave={() => setHoveredBlog(null)}
              onClick={() => onNavigate('blog')}
            >
              {/* Blog Image */}
              <div className="relative mb-6 overflow-hidden rounded-lg aspect-video">
                {blog.mainImage ? (
                  <Image
                    src={urlFor(blog.mainImage).width(400).height(250).url()}
                    alt={blog.mainImage.alt || blog.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center rounded-lg aspect-video bg-gradient-to-br from-cyan-600/20 to-purple-600/20 glass">
                    <Eye className="w-12 h-12 opacity-50 text-cyan-300" />
                  </div>
                )}
              </div>
              
              {/* Blog Meta */}
              <div className="flex items-center mb-4 space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{blog.estimatedReadTime} min</span>
                </div>
              </div>
              
              {/* Blog Content */}
              <h3 className="mb-3 text-xl font-bold leading-tight text-white hover:text-cyan-300 smooth-transition">
                {blog.title}
              </h3>
              
              <p className="mb-4 leading-relaxed text-gray-300">
                {blog.excerpt}
              </p>
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {getCategoryDisplay(blog.categories).slice(0, 2).map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs text-purple-300 rounded bg-purple-500/20"
                  >
                    {category}
                  </span>
                ))}
              </div>
              
              {/* Read More */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">By {blog.author?.name || 'Webb3Fitty'}</span>
                <ChevronRight className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Blog Stats */}
        <div className="grid grid-cols-1 gap-6 mb-16 md:grid-cols-3">
          <div className="p-6 text-center glass">
            <div className="mb-2 text-3xl font-bold text-purple-300">{displayBlogs.length}+</div>
            <div className="text-gray-400">Technical Articles</div>
          </div>
          <div className="p-6 text-center glass">
            <div className="mb-2 text-3xl font-bold text-cyan-300">0K+</div>
            <div className="text-gray-400">Monthly Readers</div>
          </div>
          <div className="p-6 text-center glass">
            <div className="mb-2 text-3xl font-bold text-amber-300">Soon</div>
            <div className="text-gray-400">Tutorial Series</div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('blog')}
            className="relative px-8 py-4 text-lg font-semibold text-white transform rounded-full group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 smooth-transition glow-purple hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Explore All Articles
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
            </span>
            <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 smooth-transition" />
          </button>
        </div>
      </div>
    </section>
  )
}
