import { BlogGrid } from '@/components/blog/BlogGrid'
import { getAllPosts } from '@/lib/sanity/client'
import type { BlogPost } from '@/types'

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
