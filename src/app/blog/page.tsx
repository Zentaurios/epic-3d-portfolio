import { Metadata } from 'next'
import { BlogGrid } from '@/components/blog/BlogGrid'
import { getAllPosts } from '@/lib/sanity/client'
import type { BlogPost } from '@/types'

// Generate metadata for SEO and social sharing
export const metadata: Metadata = {
  title: "Neural Memory Bank - Webb3Fitty Blog",
  description: "Exploring the digital consciousness through insights on Web3, AI, development, and the journey through technological evolution. Read the latest thoughts from Webb3Fitty.",
  keywords: ["webb3fitty", "blog", "web3", "ai", "development", "blockchain", "insights", "technology", "neural", "consciousness"],
  authors: [{ name: "Webb3Fitty" }],
  creator: "Webb3Fitty",
  publisher: "Webb3Fitty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // OpenGraph metadata
  openGraph: {
    title: "Neural Memory Bank - Webb3Fitty Blog",
    description: "Exploring the digital consciousness through insights on Web3, AI, development, and technological evolution.",
    type: "website",
    locale: "en_US",
    url: "https://webb3fitty.dev/blog",
    siteName: "Webb3Fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        width: 1200,
        height: 630,
        alt: "Neural Memory Bank - Webb3Fitty Blog",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Neural Memory Bank - Webb3Fitty Blog",
    description: "Exploring the digital consciousness through insights on Web3, AI, development, and technological evolution.",
    creator: "@webb3fitty",
    site: "@webb3fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        alt: "Neural Memory Bank - Webb3Fitty Blog",
      }
    ],
  },

  // Additional metadata
  alternates: {
    canonical: "https://webb3fitty.dev/blog",
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

  // Blog specific metadata
  other: {
    'blog:author': 'Webb3Fitty',
    'blog:topics': 'Web3,AI,Development,Blockchain,Technology',
    'content:type': 'blog',
  },
}

export default async function BlogPage() {
  // Fetch blog posts server-side for SEO
  let posts: BlogPost[] = []
  
  try {
    posts = await getAllPosts()
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    // Continue with empty array - component will handle empty state
  }

  return (
    <main className="relative z-10 min-h-screen">
      <div className="container px-4 py-8 mx-auto">
        {/* Page Header */}
        <section id="blog-header" data-section="blog-header" className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl heading-gradient">
            Neural Memory Bank
          </h1>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-400">
            Exploring the digital consciousness through insights on Web3, AI, 
            development, and the journey through technological evolution.
          </p>
        </section>

        {/* Blog Grid - Pass server-fetched data as props */}
        <section id="blog-grid" data-section="blog-grid">
          <BlogGrid initialPosts={posts} />
        </section>
      </div>
    </main>
  )
}
