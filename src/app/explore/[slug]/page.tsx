import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { client, projectQueries } from '@/lib/sanity/client'
import { ProjectDetail } from '@/components/explore/ProjectDetail'
import { RelatedProjects } from '@/components/explore/RelatedProjects'
import { Project } from '@/types'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all projects
export async function generateStaticParams() {
  try {
    const projects = await client.fetch(`
      *[_type == "project" && defined(slug.current)] {
        "slug": slug.current
      }
    `)
    
    return projects.map((project: { slug: string }) => ({
      slug: project.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for projects:', error)
    return []
  }
}

// Generate metadata for each project
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const project: Project = await client.fetch(projectQueries.getProjectBySlug, { slug })
    
    if (!project) {
      return {
        title: 'Project Not Found | Webb3Fitty',
        description: 'The requested project could not be found.',
      }
    }

    return {
      title: `${project.title} | Webb3Fitty Projects`,
      description: project.description || `Explore ${project.title} - a cutting-edge project by Webb3Fitty`,
      keywords: [
        project.title,
        ...(project.technologies || []),
        project.category?.title || '',
        'webb3fitty',
        'project',
        'portfolio',
        'web development'
      ].filter(Boolean),
      authors: [{ name: 'Webb3Fitty' }],
      openGraph: {
        title: project.title,
        description: project.description || '',
        type: 'website',
        url: `/explore/${slug}`,
        images: project.mainImage ? [
          {
            url: project.mainImage.asset?.url || '',
            alt: project.mainImage.alt || project.title,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description || '',
        images: project.mainImage ? [project.mainImage.asset?.url || ''] : undefined,
      },
      alternates: {
        canonical: `/explore/${slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata for project:', error)
    return {
      title: 'Project | Webb3Fitty',
      description: 'Explore innovative projects and cutting-edge solutions.',
    }
  }
}

// Server component for project page
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  
  try {
    // Fetch the project data server-side
    const project: Project = await client.fetch(projectQueries.getProjectBySlug, { slug })
    
    if (!project) {
      notFound()
    }

    // Fetch related projects server-side
    const relatedProjects = await client.fetch(`
      *[_type == "project" && slug.current != $slug && defined(slug.current)] | order(featured desc, priority desc, completedAt desc)[0...3] {
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
        priority,
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
      }
    `, { slug })

    return (
      <main className="relative z-10">
        <Suspense fallback={<ProjectDetailSkeleton />}>
          <ProjectDetail project={project} />
        </Suspense>
        
        <Suspense fallback={<div className="h-20" />}>
          <RelatedProjects projects={relatedProjects} />
        </Suspense>
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: project.title,
              description: project.description,
              applicationCategory: project.category?.title || "WebApplication",
              operatingSystem: "Web",
              author: {
                "@type": "Person",
                name: "Webb3Fitty"
              },
              url: `https://webb3fitty.dev/explore/${slug}`,
              screenshot: project.mainImage?.asset?.url,
              datePublished: project.completedAt,
              softwareVersion: "1.0",
              programmingLanguage: project.technologies
            })
          }}
        />
      </main>
    )
  } catch (error) {
    console.error('Error fetching project:', error)
    notFound()
  }
}

function ProjectDetailSkeleton() {
  return (
    <article className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation skeleton */}
        <div className="w-32 h-6 mb-8 rounded bg-purple-500/20 pulse-glow"></div>
        
        {/* Hero section skeleton */}
        <div className="p-8 mb-8 glass-dark">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="h-8 rounded-lg bg-purple-500/20 pulse-glow"></div>
              <div className="h-4 rounded-lg bg-gray-500/20 pulse-glow"></div>
              <div className="w-2/3 h-4 rounded-lg bg-gray-500/20 pulse-glow"></div>
            </div>
            <div className="rounded-lg aspect-video bg-purple-500/20 pulse-glow"></div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="p-8 lg:col-span-2 glass">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 rounded bg-gray-500/20 pulse-glow"></div>
                  <div className="h-4 rounded bg-gray-500/20 pulse-glow"></div>
                  <div className="w-3/4 h-4 rounded bg-gray-500/20 pulse-glow"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 glass">
              <div className="h-6 mb-4 rounded bg-cyan-500/20 pulse-glow"></div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 rounded bg-gray-500/20 pulse-glow"></div>
                ))}
              </div>
            </div>
            
            <div className="p-6 glass">
              <div className="h-6 mb-4 rounded bg-amber-500/20 pulse-glow"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 rounded bg-gray-500/20 pulse-glow"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
