import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'

// Get all blog post slugs
async function getBlogSlugs() {
  try {
    const slugs = await client.fetch(`
      *[_type == "post" && defined(slug.current)] {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }
    `)
    return slugs
  } catch (error) {
    console.error('Error fetching blog slugs:', error)
    return []
  }
}

// Get all project slugs
async function getProjectSlugs() {
  try {
    const slugs = await client.fetch(`
      *[_type == "project" && defined(slug.current)] {
        "slug": slug.current,
        completedAt,
        _updatedAt
      }
    `)
    return slugs
  } catch (error) {
    console.error('Error fetching project slugs:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://webb3fitty.dev'
  
  // Get dynamic content
  const [blogSlugs, projectSlugs] = await Promise.all([
    getBlogSlugs(),
    getProjectSlugs(),
  ])

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic blog pages
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt || post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Dynamic project pages
  const projectPages: MetadataRoute.Sitemap = projectSlugs.map((project: any) => ({
    url: `${baseUrl}/explore/${project.slug}`,
    lastModified: new Date(project._updatedAt || project.completedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages, ...projectPages]
}
