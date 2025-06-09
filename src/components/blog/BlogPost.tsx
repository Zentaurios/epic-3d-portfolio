'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Calendar, Clock, Eye, ArrowLeft, Share, Bookmark } from 'lucide-react'
import { getPostBySlug, urlFor } from '@/lib/sanity/client'
import { PortableText } from '@portabletext/react'
import type { BlogPost as BlogPostType } from '@/types'

interface BlogPostProps {
  slug?: string
  post?: BlogPostType
}

export function BlogPost({ slug, post: initialPost }: BlogPostProps) {
  const [post, setPost] = useState<BlogPostType | null>(initialPost || null)
  const [loading, setLoading] = useState(!initialPost)
  
  useEffect(() => {
    // Only fetch if we don't already have the post and we have a slug
    if (!initialPost && slug) {
      async function fetchPost() {
        try {
          const postData = await getPostBySlug(slug!)
          if (!postData) {
            throw new Error('Post not found')
          }
          setPost(postData)
        } catch (error) {
          console.error('Failed to fetch post:', error)
          setPost(null)
        } finally {
          setLoading(false)
        }
      }
      
      fetchPost()
    }
  }, [slug, initialPost])
  
  if (loading) {
    return <BlogPostSkeleton />
  }
  
  if (!post) {
    return <PostNotFound />
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  return (
    <article className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 smooth-transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Blog</span>
          </button>
        </div>
        
        {/* Hero Section */}
        <header className="glass-dark p-8 mb-8 text-center">
          {/* Meta Information */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{post.estimatedReadTime} min read</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>By {post.author.name}</span>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold heading-gradient leading-tight mb-6">
            {post.title}
          </h1>
          
          {/* Excerpt */}
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
            {post.excerpt}
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {post.categories.map((category) => (
              <span
                key={category._id}
                className={`px-4 py-2 rounded-full text-sm font-medium bg-${category.color}-500/20 text-${category.color}-300 border border-${category.color}-500/30`}
              >
                {category.title}
              </span>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 glass rounded-lg text-gray-300 hover:text-white smooth-transition">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 glass rounded-lg text-gray-300 hover:text-white smooth-transition">
              <Bookmark className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </header>
        
        {/* Main Image */}
        {post.mainImage && (
          <div className="glass p-4 mb-8">
            <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-lg flex items-center justify-center relative overflow-hidden">
              {post.mainImage.asset?.url ? (
                <Image
                  src={urlFor(post.mainImage).width(800).height(450).url()}
                  alt={post.mainImage.alt || post.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              ) : (
                <div className="text-center">
                  <Eye className="w-16 h-16 text-purple-300 opacity-50 mx-auto mb-4" />
                  <p className="text-gray-400">{post.mainImage?.alt || post.title}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Article Content */}
        <div className="glass p-8 blog-content">
          {post.body ? (
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                This is a placeholder article. The full content would be loaded from Sanity CMS.
              </p>
            </div>
          )}
        </div>
        
        {/* Author Bio */}
        <div className="glass-dark p-8 mt-8">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {post.author.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                {post.author.name}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Revolutionary Web3 & AI Developer crafting legendary digital experiences 
                that bridge cutting-edge technology with human creativity.
              </p>
              <div className="flex space-x-4">
                {post.author.social?.github && (
                  <a href={post.author.social.github} className="text-purple-400 hover:text-purple-300 smooth-transition">
                    GitHub
                  </a>
                )}
                {post.author.social?.twitter && (
                  <a href={post.author.social.twitter} className="text-cyan-400 hover:text-cyan-300 smooth-transition">
                    Twitter
                  </a>
                )}
                {post.author.social?.linkedin && (
                  <a href={post.author.social.linkedin} className="text-blue-400 hover:text-blue-300 smooth-transition">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// Portable Text components for rich content rendering
const portableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-lg flex items-center justify-center relative overflow-hidden">
          {value.asset?.url ? (
            <Image
              src={urlFor(value).width(700).height(400).url()}
              alt={value.alt || 'Blog image'}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          ) : (
            <div className="text-center">
              <Eye className="w-12 h-12 text-purple-300 opacity-50 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{value.alt || 'Image'}</p>
            </div>
          )}
        </div>
        {value.caption && (
          <p className="text-center text-gray-400 text-sm mt-2 italic">
            {value.caption}
          </p>
        )}
      </div>
    ),
    code: ({ value }: any) => (
      <pre className="my-6 p-6 bg-gray-900 rounded-lg overflow-x-auto">
        <code className={`language-${value.language || 'text'}`}>
          {value.code}
        </code>
      </pre>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 hover:text-cyan-300 underline smooth-transition"
      >
        {children}
      </a>
    ),
    code: ({ children }: any) => (
      <code className="bg-purple-500/20 px-2 py-1 rounded text-purple-300">
        {children}
      </code>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold text-white mt-12 mb-6 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-semibold text-cyan-300 mt-10 mb-5">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-semibold text-purple-300 mt-8 mb-4">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-purple-500 pl-6 my-6 italic text-gray-300 bg-purple-500/10 p-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
}

function BlogPostSkeleton() {
  return (
    <article className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="h-6 w-32 bg-purple-500/20 rounded mb-8 pulse-glow"></div>
        <div className="glass-dark p-8 mb-8">
          <div className="h-8 bg-purple-500/20 rounded-lg mb-4 pulse-glow"></div>
          <div className="h-4 bg-gray-500/20 rounded-lg mb-2 pulse-glow"></div>
          <div className="h-4 bg-gray-500/20 rounded-lg w-2/3 pulse-glow"></div>
        </div>
      </div>
    </article>
  )
}

function PostNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center glass-dark p-8 max-w-md">
        <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
        <p className="text-gray-400 mb-6">
          The blog post you're looking for doesn't exist or has been moved.
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
