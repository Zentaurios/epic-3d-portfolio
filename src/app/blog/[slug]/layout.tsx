import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, urlFor } from '@/lib/sanity/client'
import type { BlogPost } from '@/types'

interface BlogLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO and social sharing
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const post: BlogPost = await getPostBySlug(slug)
    
    if (!post) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.'
      }
    }

    // Generate image URLs for social sharing
    const mainImageUrl = post.mainImage?.asset?.url 
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : 'https://webb3fitty.dev/og-default.jpg' // Fallback image

    // SEO optimized title
    const title = post.seo?.metaTitle || `${post.title} | Webb3Fitty Blog`
    const description = post.seo?.metaDescription || post.excerpt
    const keywords = post.seo?.keywords || post.categories.map(cat => cat.title)

    // Construct canonical URL
    const canonicalUrl = `https://webb3fitty.dev/blog/${slug}`

    return {
      title,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: post.author.name }],
      creator: post.author.name,
      publisher: 'Webb3Fitty',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      
      // OpenGraph metadata
      openGraph: {
        title,
        description,
        type: 'article',
        locale: 'en_US',
        url: canonicalUrl,
        siteName: 'Webb3Fitty',
        images: [
          {
            url: mainImageUrl,
            width: 1200,
            height: 630,
            alt: post.mainImage?.alt || post.title,
          }
        ],
        authors: [post.author.name],
        publishedTime: post.publishedAt,
        modifiedTime: post.publishedAt,
        section: post.categories[0]?.title || 'Technology',
        tags: post.categories.map(cat => cat.title),
      },

      // Twitter Card metadata
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@webb3fitty',
        site: '@webb3fitty',
        images: [
          {
            url: mainImageUrl,
            alt: post.mainImage?.alt || post.title,
          }
        ],
      },

      // Additional metadata
      alternates: {
        canonical: canonicalUrl,
      },
      
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Article specific metadata
      other: {
        'article:author': post.author.name,
        'article:published_time': post.publishedAt,
        'article:modified_time': post.publishedAt,
        'article:section': post.categories[0]?.title || 'Technology',
        'article:tag': post.categories.map(cat => cat.title).join(','),
        'reading-time': `${post.estimatedReadTime} minutes`,
      },
    }
  } catch (error) {
    console.error('Error generating blog post metadata:', error)
    return {
      title: 'Blog Post | Webb3Fitty',
      description: 'Explore cutting-edge insights on Web3, AI, and development from Webb3Fitty.',
    }
  }
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    // Note: You might want to implement a getAllPostSlugs function for better performance
    // For now, we'll let Next.js handle dynamic generation
    return []
  } catch (error) {
    console.error('Error generating static params for blog posts:', error)
    return []
  }
}

export default async function BlogPostLayout({
  children,
  params,
}: BlogLayoutProps) {
  const { slug } = await params
  
  // Fetch the post data for JSON-LD structured data
  let post: BlogPost | null = null
  try {
    post = await getPostBySlug(slug)
    if (!post) {
      notFound()
    }
  } catch (error) {
    console.error('Error fetching post for layout:', error)
    notFound()
  }

  // Generate structured data with actual post information
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: `https://webb3fitty.dev/blog/${slug}`,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: 'https://webb3fitty.dev',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Webb3Fitty',
      url: 'https://webb3fitty.dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https://webb3fitty.dev/webb3fitty.png',
        width: 60,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://webb3fitty.dev/blog/${slug}`,
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    description: post.excerpt,
    keywords: post.categories.map(cat => cat.title).join(', '),
    wordCount: post.estimatedReadTime * 200, // Approximate words (200 words per minute)
    timeRequired: `PT${post.estimatedReadTime}M`, // ISO 8601 duration format
    image: post.mainImage?.asset?.url ? {
      '@type': 'ImageObject',
      url: urlFor(post.mainImage).width(1200).height(630).url(),
      width: 1200,
      height: 630,
      alt: post.mainImage.alt || post.title,
    } : undefined,
    articleSection: post.categories[0]?.title || 'Technology',
    about: post.categories.map(cat => ({
      '@type': 'Thing',
      name: cat.title,
    })),
  }

  return (
    <>
      {/* JSON-LD structured data for better SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {children}
    </>
  )
}
