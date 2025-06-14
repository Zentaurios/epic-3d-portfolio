import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: 'ntqs7f5z',
  dataset: 'production',
  useCdn: false, // Disabled for faster updates - enable later for performance
  apiVersion: '2025-02-06',
  // Add perspective for published content only in production
  perspective: process.env.NODE_ENV === 'production' ? 'published' : 'drafts',
  // Enable stega for preview mode (if using)
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio'
  }
})

const builder = imageUrlBuilder(client)

export const urlFor = (source: SanityImageSource) => builder.image(source)

// Blog post queries
export const blogQueries = {
  getAllPosts: `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
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
  }`,

  getPostBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    slug,
    excerpt,
    publishedAt,
    estimatedReadTime,
    featured,
    body,
    author->{
      name,
      image,
      slug,
      bio,
      social
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
    },
    seo
  }`,

  getFeaturedPosts: `*[_type == "post" && featured == true && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    estimatedReadTime,
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
  }`,

  getPostsByCategory: `*[_type == "post" && $categorySlug in categories[]->slug.current && defined(slug.current)] | order(publishedAt desc) {
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
  }`,

  getRelatedPosts: `*[_type == "post" && slug.current != $slug && defined(slug.current) && count(categories[@._ref in $categories]) > 0] | order(publishedAt desc)[0...3] {
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
  }`,
}

// Project queries
export const projectQueries = {
  getAllProjects: `*[_type == "project" && defined(slug.current)] | order(priority desc, completedAt desc) {
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
  }`,

  getProjectBySlug: `*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    longDescription,
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
    highlights,
    challenges,
    mainImage{
      asset->{
        _id,
        url
      },
      alt
    },
    gallery[]{
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    completedAt,
    seo
  }`,

  getFeaturedProjects: `*[_type == "project" && featured == true && defined(slug.current)] | order(priority desc, completedAt desc) {
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
  }`,

  getProjectsByCategory: `*[_type == "project" && category->slug.current == $categorySlug && defined(slug.current)] | order(priority desc, completedAt desc) {
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
  }`,
}

// Category queries
export const categoryQueries = {
  getAllCategories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color,
    icon
  }`,

  getCategoryBySlug: `*[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    color,
    icon
  }`,
}

// Site settings query
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  title,
  description,
  keywords,
  logo{
    asset->{
      _id,
      url
    },
    alt
  },
  socialImage{
    asset->{
      _id,
      url
    },
    alt
  },
  author->{
    name,
    image,
    bio,
    email,
    website,
    social,
    expertise
  },
  contact,
  social,
  analytics,
  features
}`

// Helper functions
export async function getAllPosts() {
  return await client.fetch(blogQueries.getAllPosts)
}

export async function getPostBySlug(slug: string) {
  return await client.fetch(blogQueries.getPostBySlug, { slug })
}

export async function getFeaturedPosts() {
  return await client.fetch(blogQueries.getFeaturedPosts)
}

export async function getAllProjects() {
  return await client.fetch(projectQueries.getAllProjects)
}

export async function getProjectBySlug(slug: string) {
  return await client.fetch(projectQueries.getProjectBySlug, { slug })
}

export async function getFeaturedProjects() {
  return await client.fetch(projectQueries.getFeaturedProjects)
}

export async function getAllCategories() {
  return await client.fetch(categoryQueries.getAllCategories)
}

export async function getSiteSettings() {
  return await client.fetch(siteSettingsQuery)
}

// Statistics queries
export const statsQueries = {
  getProjectStats: `{
    "totalProjects": count(*[_type == "project" && defined(slug.current)]),
    "liveProjects": count(*[_type == "project" && status == "live" && defined(slug.current)]),
    "categories": count(*[_type == "category"]),
    "technologies": count(array::unique(*[_type == "project" && defined(slug.current)].technologies[])),
    "featuredProjects": count(*[_type == "project" && featured == true && defined(slug.current)])
  }`,
  
  getTechStats: `{
    "totalTechnologies": count(array::unique(*[_type == "project" && defined(slug.current)].technologies[])),
    "uniqueCategories": count(*[_type == "category"]),
    "totalProjects": count(*[_type == "project" && defined(slug.current)]),
    "activeTechnologies": array::unique(*[_type == "project" && status in ["live", "beta", "development"] && defined(slug.current)].technologies[])
  }`
}

export async function getProjectStats() {
  return await client.fetch(statsQueries.getProjectStats)
}

export async function getTechStats() {
  return await client.fetch(statsQueries.getTechStats)
}
