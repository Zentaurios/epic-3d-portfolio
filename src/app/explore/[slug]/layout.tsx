import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug, urlFor } from '@/lib/sanity/client'
import type { Project } from '@/types'

interface ProjectLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO and social sharing
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const project: Project = await getProjectBySlug(slug)
    
    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.'
      }
    }

    // Generate image URLs for social sharing
    const mainImageUrl = project.mainImage?.asset?.url 
      ? urlFor(project.mainImage).width(1200).height(630).url()
      : 'https://webb3fitty.dev/webb3fitty.png' // Fallback image

    // SEO optimized title
    const title = project.seo?.metaTitle || `${project.title} | Webb3Fitty Projects`
    const description = project.seo?.metaDescription || project.description
    const keywords = project.seo?.keywords || [
      ...project.technologies,
      project.category?.title,
      'web3',
      'project',
      'development'
    ].filter(Boolean)

    // Construct canonical URL
    const canonicalUrl = `https://webb3fitty.dev/explore/${slug}`

    // Project status for rich metadata
    const projectStatus = project.status === 'live' ? 'Published' : 
                         project.status === 'beta' ? 'Beta' :
                         project.status === 'development' ? 'In Development' : 'Available'

    return {
      title,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: 'Webb3Fitty' }],
      creator: 'Webb3Fitty',
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
        type: 'website',
        locale: 'en_US',
        url: canonicalUrl,
        siteName: 'Webb3Fitty',
        images: [
          {
            url: mainImageUrl,
            width: 1200,
            height: 630,
            alt: project.mainImage?.alt || project.title,
          }
        ],
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
            alt: project.mainImage?.alt || project.title,
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

      // Project specific metadata
      other: {
        'project:author': 'Webb3Fitty',
        'project:status': projectStatus,
        'project:category': project.category?.title || 'Technology',
        'project:technologies': project.technologies.join(','),
        'project:featured': project.featured ? 'true' : 'false',
      },
    }
  } catch (error) {
    console.error('Error generating project metadata:', error)
    return {
      title: 'Project | Webb3Fitty',
      description: 'Explore cutting-edge Web3 and AI projects by Webb3Fitty.',
    }
  }
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    // Note: You might want to implement a getAllProjectSlugs function for better performance
    // For now, we'll let Next.js handle dynamic generation
    return []
  } catch (error) {
    console.error('Error generating static params for projects:', error)
    return []
  }
}

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { slug } = await params
  
  // Fetch the project data for JSON-LD structured data
  let project: Project | null = null
  try {
    project = await getProjectBySlug(slug)
    if (!project) {
      notFound()
    }
  } catch (error) {
    console.error('Error fetching project for layout:', error)
    notFound()
  }

  // Generate structured data with actual project information
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    url: `https://webb3fitty.dev/explore/${slug}`,
    description: project.description,
    author: {
      '@type': 'Person',
      name: 'Webb3Fitty',
      url: 'https://webb3fitty.dev',
    },
    creator: {
      '@type': 'Person',
      name: 'Webb3Fitty',
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
      '@id': `https://webb3fitty.dev/explore/${slug}`,
    },
    dateCreated: project.completedAt,
    dateModified: project.completedAt,
    keywords: [...project.technologies, project.category?.title].filter(Boolean).join(', '),
    category: project.category?.title || 'Technology',
    image: project.mainImage?.asset?.url ? {
      '@type': 'ImageObject',
      url: urlFor(project.mainImage).width(1200).height(630).url(),
      width: 1200,
      height: 630,
      alt: project.mainImage.alt || project.title,
    } : undefined,
    about: {
      '@type': 'Thing',
      name: project.category?.title || 'Technology Project',
    },
    genre: project.technologies.join(', '),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    isFamilyFriendly: true,
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
