import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { client, blogQueries } from '@/lib/sanity/client'
import { BlogPost } from '@/components/blog/BlogPost'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { BlogPost as BlogPostType } from '@/types'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await client.fetch(`
      *[_type == "post" && defined(slug.current)] {
        "slug": slug.current
      }
    `)
    
    return posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for blog posts:', error)
    return []
  }
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const post: BlogPostType = await client.fetch(blogQueries.getPostBySlug, { slug })
    
    if (!post) {
      return {
        title: 'Post Not Found | Webb3Fitty',
        description: 'The requested blog post could not be found.',
      }
    }

    const publishedDate = new Date(post.publishedAt).toISOString()
    const modifiedDate = new Date(post._updatedAt || post.publishedAt).toISOString()

    return {
      title: `${post.title} | Webb3Fitty Blog`,
      description: post.excerpt || `Read ${post.title} by ${post.author?.name || 'Webb3Fitty'}`,
      keywords: [
        post.title,
        ...(post.categories?.map(cat => typeof cat === 'string' ? cat : cat.title) || []),
        'webb3fitty',
        'blog',
        'web development',
        'technology'
      ],
      authors: [{ name: post.author?.name || 'Webb3Fitty' }],
      openGraph: {
        title: post.title,
        description: post.excerpt || '',
        type: 'article',
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
        authors: [post.author?.name || 'Webb3Fitty'],
        url: `/blog/${slug}`,
        images: post.mainImage ? [
          {
            url: post.mainImage.asset?.url || '',
            alt: post.mainImage.alt || post.title,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || '',
        images: post.mainImage ? [post.mainImage.asset?.url || ''] : undefined,
      },
      alternates: {
        canonical: `/blog/${slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata for blog post:', error)
    return {
      title: 'Blog Post | Webb3Fitty',
      description: 'Explore insights on Web3, AI, and modern web development.',
    }
  }
}

// Server component for blog post page
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  
  try {
    // Fetch the blog post data server-side
    const post: BlogPostType = await client.fetch(blogQueries.getPostBySlug, { slug })
    
    if (!post) {
      notFound()
    }

    // Fetch related posts server-side
    const relatedPosts = await client.fetch(blogQueries.getRelatedPosts, { 
      slug,
      categories: post.categories?.map(cat => typeof cat === 'string' ? cat : cat._id) || []
    })

    return (
      <main className="relative z-10">
        <Suspense fallback={<BlogPostSkeleton />}>
          <BlogPost post={post} />
        </Suspense>
        
        <Suspense fallback={<div className="h-20" />}>
          <RelatedPosts posts={relatedPosts} />
        </Suspense>
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              image: post.mainImage?.asset?.url,
              author: {
                "@type": "Person",
                name: post.author?.name || "Webb3Fitty"
              },
              publisher: {
                "@type": "Organization",
                name: "Webb3Fitty",
                logo: {
                  "@type": "ImageObject",
                  url: "https://webb3fitty.dev/logo.png"
                }
              },
              datePublished: post.publishedAt,
              dateModified: post._updatedAt || post.publishedAt,
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://webb3fitty.dev/blog/${slug}`
              }
            })
          }}
        />
      </main>
    )
  } catch (error) {
    console.error('Error fetching blog post:', error)
    notFound()
  }
}

function BlogPostSkeleton() {
  return (
    <article className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero section skeleton */}
        <div className="p-8 mb-8 glass-dark">
          <div className="h-8 mb-4 rounded-lg bg-purple-500/20 pulse-glow"></div>
          <div className="h-4 mb-2 rounded-lg bg-gray-500/20 pulse-glow"></div>
          <div className="w-2/3 h-4 rounded-lg bg-gray-500/20 pulse-glow"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-8 glass">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 rounded bg-gray-500/20 pulse-glow"></div>
                <div className="h-4 rounded bg-gray-500/20 pulse-glow"></div>
                <div className="w-3/4 h-4 rounded bg-gray-500/20 pulse-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
