import { Metadata } from 'next'
import { client, blogQueries, projectQueries } from '@/lib/sanity/client'
import { BlogPost, Project } from '@/types'
import ServerContent from '@/components/layout/ServerContent'
import ClientEnhancement from '@/components/3d/ClientEnhancement'

// Server-side data fetching
async function getHomePageData() {
  try {
    // Fetch featured content first, then fallback to recent content if needed
    const [featuredBlogs, featuredProjects, recentBlogs, recentProjects] = await Promise.all([
      client.fetch(blogQueries.getFeaturedPosts),
      client.fetch(projectQueries.getFeaturedProjects),
      client.fetch(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...3] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        estimatedReadTime,
        featured,
        author->{
          name,
          image,
          slug
        },
        categories[]->{
          title,
          slug,
          color
        },
        mainImage{
          asset->{
            _id,
            url
          },
          alt
        }
      }`),
      client.fetch(`*[_type == "project" && defined(slug.current)] | order(priority desc, completedAt desc)[0...3] {
        _id,
        title,
        slug,
        description,
        category->{
          title,
          slug,
          color
        },
        technologies,
        status,
        featured,
        links,
        metrics,
        mainImage{
          asset->{
            _id,
            url
          },
          alt
        },
        completedAt
      }`)
    ])

    // Use featured content if available, otherwise use recent content
    const blogs = featuredBlogs.length > 0 ? featuredBlogs : recentBlogs
    const projects = featuredProjects.length > 0 ? featuredProjects : recentProjects

    // If still no data, provide minimal fallback
    const fallbackBlogs = [
      {
        _id: 'fallback-1',
        title: 'Welcome to Webb3Fitty',
        slug: { current: 'welcome' },
        excerpt: 'Exploring the intersection of Web3, AI, and immersive digital experiences.',
        publishedAt: '2025-01-15',
        estimatedReadTime: 5,
        featured: false,
        author: null,
        categories: [],
        mainImage: null
      }
    ]

    const fallbackProjects = [
      {
        _id: 'fallback-1',
        title: 'Portfolio Website',
        slug: { current: 'portfolio' },
        description: 'This immersive 3D portfolio built with Next.js, Three.js, and modern web technologies.',
        category: null,
        technologies: ['Next.js', 'Three.js', 'TypeScript', 'Tailwind CSS'],
        status: 'live' as const,
        featured: false,
        links: null,
        metrics: null,
        mainImage: null,
        completedAt: '2025-01-01'
      }
    ]

    return {
      blogs: blogs.length > 0 ? blogs : fallbackBlogs,
      projects: projects.length > 0 ? projects : fallbackProjects
    }
  } catch (error) {
    console.error('Error fetching homepage data:', error)
    
    // Return minimal fallback content on error
    return {
      blogs: [
        {
          _id: 'error-fallback',
          title: 'Welcome to Webb3Fitty',
          slug: { current: 'welcome' },
          excerpt: 'Exploring the intersection of Web3, AI, and immersive digital experiences.',
          publishedAt: '2025-01-15',
          estimatedReadTime: 5,
          featured: false,
          author: null,
          categories: [],
          mainImage: null
        }
      ],
      projects: [
        {
          _id: 'error-fallback',
          title: 'Portfolio Website',
          slug: { current: 'portfolio' },
          description: 'This immersive 3D portfolio built with Next.js, Three.js, and modern web technologies.',
          category: null,
          technologies: ['Next.js', 'Three.js', 'TypeScript'],
          status: 'live' as const,
          featured: false,
          links: null,
          metrics: null,
          mainImage: null,
          completedAt: '2025-01-01'
        }
      ]
    }
  }
}

// SEO metadata - fully server-side rendered
export const metadata: Metadata = {
  title: 'Webb3Fitty - Epic 3D Portfolio | Full-Stack Developer & Digital Architect',
  description: 'Explore the cosmic portfolio of Webb3Fitty - a passionate full-stack developer specializing in immersive web experiences, blockchain integration, and AI-powered solutions. Built with Next.js, Three.js, and cutting-edge technologies.',
  keywords: 'Webb3Fitty, full-stack developer, 3D portfolio, Three.js, Next.js, Web3, blockchain, AI solutions, digital architect, immersive web experiences',
  authors: [{ name: 'Webb3Fitty' }],
  creator: 'Webb3Fitty',
  publisher: 'Webb3Fitty',
  openGraph: {
    title: 'Webb3Fitty - Epic 3D Portfolio',
    description: 'Navigate through an immersive galaxy of cutting-edge projects and innovative solutions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webb3Fitty Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webb3Fitty - Epic 3D Portfolio',
    description: 'Explore the cosmic portfolio of a passionate full-stack developer.',
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
  alternates: {
    canonical: 'https://webb3fitty.dev',
  },
}

// Home page component
export default async function HomePage() {
  const data = await getHomePageData()
  
  // Home content structure
  const homeContent = {
    hero: {
      title: "Webb3Fitty",
      subtitle: "Full-Stack Developer & Digital Architect",
      description: "Crafting immersive digital experiences at the intersection of Web3, AI, and cutting-edge technology. From blockchain solutions to cosmic 3D portfolios, I bring ideas to life in the digital realm."
    },
    about: {
      title: "About Webb3Fitty",
      content: "I'm a passionate full-stack developer specializing in creating immersive digital experiences. With expertise spanning blockchain development, AI integration, and modern web technologies, I transform complex ideas into elegant, performant solutions.",
      skills: [
        "React & Next.js",
        "Three.js & WebGL",
        "Node.js & Express",
        "Blockchain & Web3",
        "AI & Machine Learning",
        "TypeScript & Python",
        "Cloud Architecture",
        "UI/UX Design"
      ]
    },
    blogs: data.blogs,
    projects: data.projects
  }

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Webb3Fitty",
            "jobTitle": "Full-Stack Developer & Digital Architect",
            "description": "Passionate full-stack developer specializing in immersive web experiences, blockchain integration, and AI-powered solutions.",
            "url": "https://webb3fitty.dev",
            "sameAs": [],
            "knowsAbout": [
              "Web Development",
              "Blockchain",
              "Three.js",
              "React",
              "Next.js",
              "AI Integration",
              "Full-Stack Development"
            ],
            "mainEntity": {
              "@type": "ItemList",
              "name": "Featured Projects",
              "itemListElement": data.projects.slice(0, 3).map((project: Project, index: number) => ({
                "@type": "SoftwareApplication",
                "position": index + 1,
                "name": project.title,
                "description": project.description,
                "applicationCategory": "WebApplication",
                "operatingSystem": "Web Browser",
                "url": `https://webb3fitty.dev/explore/${project.slug.current}`,
                "author": {
                  "@type": "Person",
                  "name": "Webb3Fitty"
                },
                "keywords": project.technologies?.join(", ") || ""
              }))
            }
          })
        }}
      />

      {/* Blog structured data if we have blog posts */}
      {data.blogs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Webb3Fitty Blog",
              "description": "Insights on Web3, AI, and modern web development",
              "url": "https://webb3fitty.dev/blog",
              "author": {
                "@type": "Person",
                "name": "Webb3Fitty"
              },
              "blogPost": data.blogs.slice(0, 3).map((blog: BlogPost) => ({
                "@type": "BlogPosting",
                "headline": blog.title,
                "description": blog.excerpt,
                "datePublished": blog.publishedAt,
                "url": `https://webb3fitty.dev/blog/${blog.slug.current}`,
                "author": {
                  "@type": "Person",
                  "name": blog.author?.name || "Webb3Fitty"
                },
                "timeRequired": `PT${blog.estimatedReadTime}M`
              }))
            })
          }}
        />
      )}

      {/* Server-rendered content for SEO and accessibility (shown when JS is disabled) */}
      <noscript>
        <ServerContent content={homeContent} />
      </noscript>

      {/* Client-side 3D enhancement layer (shown when JS is enabled) */}
      <ClientEnhancement content={homeContent} />
    </>
  )
}
