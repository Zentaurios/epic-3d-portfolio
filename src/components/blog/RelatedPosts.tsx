'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { getAllPosts, urlFor } from '@/lib/sanity/client'
import type { BlogPost } from '@/types'

interface RelatedPostsProps {
  currentSlug?: string
  maxPosts?: number
  posts?: BlogPost[]
}

export function RelatedPosts({ currentSlug, maxPosts = 3, posts: initialPosts }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>(initialPosts || [])
  const [loading, setLoading] = useState(!initialPosts)
  
  useEffect(() => {
    // Only fetch if we don't already have the posts and we have a currentSlug
    if (!initialPosts && currentSlug) {
      async function fetchRelatedPosts() {
        try {
          const allPosts = await getAllPosts()
          
          // Filter out current post and get random related posts
          const otherPosts = allPosts.filter((post: BlogPost) => post.slug.current !== currentSlug)
          
          // Simple algorithm: take random posts (in a real app, you'd use categories, tags, etc.)
          const shuffled = otherPosts.sort(() => 0.5 - Math.random())
          const selected = shuffled.slice(0, maxPosts)
          
          setRelatedPosts(selected)
        } catch (error) {
          console.error('Failed to fetch related posts:', error)
          setRelatedPosts([])
        } finally {
          setLoading(false)
        }
      }
      
      fetchRelatedPosts()
    }
  }, [currentSlug, maxPosts, initialPosts])
  
  if (loading) {
    return <RelatedPostsSkeleton />
  }
  
  if (relatedPosts.length === 0) {
    return null
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  
  return (
    <section className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-3xl md:text-4xl font-bold heading-gradient">
              More Cosmic Insights
            </h2>
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-gray-400 text-lg">
            Continue your journey through the knowledge galaxy
          </p>
        </div>
        
        {/* Related Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPosts.map((post, index) => (
            <article
              key={post._id}
              className="group glass hover:glow-purple smooth-transition cursor-pointer transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => window.location.href = `/blog/${post.slug.current}`}
            >
              {/* Featured Badge */}
              {post.featured && (
                <div className="absolute -top-3 -left-3 z-10">
                  <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                </div>
              )}
              
              {/* Post Image */}
              <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                {post.mainImage?.asset?.url ? (
                  <Image
                    src={urlFor(post.mainImage).width(400).height(225).url()}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-purple-300 opacity-50 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">{post.mainImage?.alt || post.title}</p>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-cyan-600/40 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Post Content */}
              <div className="p-6">
                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.estimatedReadTime} min</span>
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-purple-300 smooth-transition line-clamp-2">
                  {post.title}
                </h3>
                
                {/* Excerpt */}
                <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.slice(0, 2).map((category) => (
                    <span
                      key={category._id}
                      className={`px-2 py-1 rounded text-xs font-medium bg-${category.color}-500/20 text-${category.color}-300`}
                    >
                      {category.title}
                    </span>
                  ))}
                  {post.categories.length > 2 && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">
                      +{post.categories.length - 2}
                    </span>
                  )}
                </div>
                
                {/* Read More */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">By {post.author.name}</span>
                  <div className="flex items-center space-x-2 text-purple-400 group-hover:text-purple-300 smooth-transition">
                    <span className="text-sm font-medium">Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* View All Posts Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/blog'}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white font-semibold text-lg hover:from-purple-500 hover:to-cyan-500 smooth-transition glow-purple hover:scale-105 transform"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Explore All Articles
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

function RelatedPostsSkeleton() {
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
