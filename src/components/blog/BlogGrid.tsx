'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, Calendar, Clock, Eye, ArrowRight } from 'lucide-react'
import { urlFor } from '@/lib/sanity/client'
import type { BlogPost } from '@/types'

interface BlogGridProps {
  initialPosts: BlogPost[]
  isLoading?: boolean
}

export function BlogGrid({ initialPosts, isLoading = false }: BlogGridProps) {
  const [posts] = useState<BlogPost[]>(initialPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  // Get unique categories from posts
  const categories = ['All', ...Array.from(new Set(
    posts.flatMap(post => 
      post.categories?.map(cat => cat?.title).filter(Boolean) || []
    )
  ))]

  // Sort posts based on selected criteria
  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      case 'longest':
        return (b.estimatedReadTime || 0) - (a.estimatedReadTime || 0)
      case 'shortest':
        return (a.estimatedReadTime || 0) - (b.estimatedReadTime || 0)
      default: // newest
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  const filteredPosts = sortedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || 
                           post.categories?.some(cat => cat?.title === selectedCategory) || false
    return matchesSearch && matchesCategory
  })

  // Show loading skeleton while loading
  if (isLoading) {
    return <BlogGridSkeleton />
  }

  // Show empty state if no posts
  if (posts.length === 0) {
    return <EmptyBlogState />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  return (
    <section className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        {/* Search and Filters */}
        <div className="p-6 mb-12 glass-dark rounded-2xl">
          <div className="flex flex-col items-center gap-6 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-12 pr-4 text-white placeholder-gray-400 border bg-white/5 border-white/10 rounded-xl focus:outline-none focus:border-purple-500 smooth-transition"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 text-white border bg-white/5 border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 smooth-transition"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-900">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 text-white border bg-white/5 border-white/10 rounded-xl focus:outline-none focus:border-amber-500 smooth-transition"
              >
                <option value="newest" className="bg-gray-900">Newest First</option>
                <option value="oldest" className="bg-gray-900">Oldest First</option>
                <option value="longest" className="bg-gray-900">Longest Read</option>
                <option value="shortest" className="bg-gray-900">Shortest Read</option>
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredPosts.length} of {posts.length} articles
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          </div>
        </div>
        
        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="block"
            >
              <article
                className={`group glass hover:glow-purple smooth-transition cursor-pointer transform hover:scale-105 ${
                  post.featured ? 'glow-cyan' : ''
                }`}
              >
              {/* Featured Badge */}
              {post.featured && (
                <div className="absolute z-10 -top-3 -right-3">
                  <div className="px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r from-purple-600 to-cyan-600">
                    Featured
                  </div>
                </div>
              )}
              
              {/* Blog Image */}
              <div className="relative mb-6 overflow-hidden rounded-lg aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-600/20">
                {post.mainImage?.asset?.url ? (
                  <Image
                    src={urlFor(post.mainImage).width(400).height(250).url()}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <Eye className="w-12 h-12 text-purple-300 opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Hover Effect */}
                <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-purple-600/40 to-cyan-600/40 group-hover:opacity-100 smooth-transition" />
              </div>
              
              {/* Blog Content */}
              <div className="p-6">
                {/* Meta Information */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-400">                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.estimatedReadTime || 5} min</span>
                  </div>
                </div>
                </div>
                
                {/* Title */}
                <h3 className="mb-3 text-xl font-bold leading-tight text-white group-hover:text-purple-300 smooth-transition">
                  {post.title}
                </h3>
                
                {/* Excerpt */}
                <p className="mb-4 leading-relaxed text-gray-300 line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories?.slice(0, 3).map((category, index) => (
                    <span
                      key={category?._id || `category-${post._id}-${index}`}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        category?.title === 'Web3' ? 'bg-purple-500/20 text-purple-300' :
                        category?.title === 'AI' ? 'bg-cyan-500/20 text-cyan-300' :
                        category?.title === 'React' ? 'bg-blue-500/20 text-blue-300' :
                        category?.title === '3D' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {category?.title || 'Unknown'}
                    </span>
                  )) || []}
                </div>
                
                {/* Read More */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">By Webb3Fitty</span>
                  <div className="flex items-center space-x-2 text-purple-400 group-hover:text-purple-300 smooth-transition">
                    <span className="text-sm font-medium">Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
                  </div>
                </div>
              </div>
            </article>
            </Link>
          ))}
        </div>
        
        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="py-16 text-center">
            <div className="max-w-md p-8 mx-auto glass-dark">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-white">No articles found</h3>
              <p className="mb-6 text-gray-400">
                Try adjusting your search criteria or explore different categories.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                }}
                className="px-6 py-3 text-white bg-purple-600 rounded-xl hover:bg-purple-500 smooth-transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <div className="mt-16 text-center">
            <button className="px-8 py-4 text-lg font-semibold text-white transform rounded-full group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 smooth-transition glow-purple hover:scale-105">
              <span className="flex items-center gap-2">
                Load More Articles
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

// Loading skeleton component
export function BlogGridSkeleton() {
  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Search and filters skeleton */}
        <div className="mb-12">
          <div className="w-full h-12 max-w-md mx-auto mb-6 bg-gray-700/30 rounded-xl animate-pulse" />
          <div className="flex flex-wrap justify-center gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={`filter-skeleton-${i}`} className="w-24 h-10 bg-gray-700/20 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={`post-skeleton-${i}`} className="overflow-hidden glass">
              <div className="aspect-video bg-gray-700/30 animate-pulse" />
              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  {[...Array(2)].map((_, j) => (
                    <div key={`category-skeleton-${i}-${j}`} className="w-16 h-5 rounded bg-gray-700/20 animate-pulse" />
                  ))}
                </div>
                <div className="h-6 mb-3 rounded bg-gray-700/30 animate-pulse" />
                <div className="h-4 mb-2 rounded bg-gray-700/20 animate-pulse" />
                <div className="w-3/4 h-4 mb-4 rounded bg-gray-700/20 animate-pulse" />
                <div className="flex items-center justify-between">
                  <div className="w-20 h-4 rounded bg-gray-700/20 animate-pulse" />
                  <div className="w-16 h-4 rounded bg-gray-700/20 animate-pulse" />
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
function EmptyBlogState() {
  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl heading-gradient">
            Neural Memory Bank
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-400">
            The memory synapses are forming. Knowledge fragments are being uploaded 
            to the neural consciousness matrix.
          </p>
        </div>

        {/* Empty State Visualization */}
        <div className="max-w-2xl mx-auto">
          <div className="relative p-12 overflow-hidden text-center border glass border-purple-500/20">
            {/* Neural activity background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
            
            {/* Memory consciousness icon */}
            <div className="relative mb-8">
              <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <Calendar className="w-12 h-12 text-purple-400" />
                
                {/* Memory sparks */}
                <div className="absolute w-4 h-4 bg-purple-400 rounded-full -top-2 -right-2 animate-ping" />
                <div className="absolute w-3 h-3 delay-700 bg-blue-400 rounded-full -bottom-2 -left-2 animate-ping" />
                <div className="absolute w-2 h-2 delay-1000 rounded-full top-1/2 -left-4 bg-cyan-400 animate-ping" />
              </div>
            </div>

            <h3 className="mb-4 text-2xl font-bold text-white">
              Memory Banks Initializing
            </h3>
            
            <p className="mb-8 leading-relaxed text-gray-300">
              The neural pathways are connecting and memories are being encoded. Soon this space will 
              contain insights about Web3, AI, development, and the journey through digital consciousness.
            </p>

            {/* Coming Soon Topics */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
              <div className="p-4 border rounded-lg bg-white/5 border-purple-500/20">
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-3 rounded-lg bg-purple-500/20">
                  <Search className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-sm font-medium text-purple-300">Web3 Insights</div>
                <div className="mt-1 text-xs text-gray-400">Blockchain wisdom</div>
              </div>
              
              <div className="p-4 border rounded-lg bg-white/5 border-blue-500/20">
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-3 rounded-lg bg-blue-500/20">
                  <Eye className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-sm font-medium text-blue-300">AI Discoveries</div>
                <div className="mt-1 text-xs text-gray-400">Neural learnings</div>
              </div>
              
              <div className="p-4 border rounded-lg bg-white/5 border-cyan-500/20">
                <div className="flex items-center justify-center w-8 h-8 mx-auto mb-3 rounded-lg bg-cyan-500/20">
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-sm font-medium text-cyan-300">Dev Stories</div>
                <div className="mt-1 text-xs text-gray-400">Code adventures</div>
              </div>
            </div>

            {/* Placeholder stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-purple-300">∞</div>
                <div className="text-xs text-gray-400">Knowledge</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-blue-300">🧠</div>
                <div className="text-xs text-gray-400">Insights</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-cyan-300">✨</div>
                <div className="text-xs text-gray-400">Ideas</div>
              </div>
            </div>

            {/* Neural activity indicators */}
            <div className="absolute flex gap-1 bottom-4 right-4">
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping" />
              <div className="w-1 h-1 delay-300 bg-blue-400 rounded-full animate-ping" />
              <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping delay-600" />
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="mb-6 text-gray-400">
              Want to contribute insights? Connect with the memory matrix administrator.
            </p>
            <button className="px-6 py-3 font-medium text-purple-300 transform border rounded-full group glass border-purple-500/50 hover:bg-purple-600/20 smooth-transition hover:scale-105">
              <span className="flex items-center gap-2">
                Initiate Memory Link
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
