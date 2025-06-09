import { client } from './client'
import { BlogPost, Project } from '@/types'

// Search functions now define queries inline to avoid TypeScript typing issues with Sanity client
// Using type-safe approach to bypass Sanity client typing conflicts

// Helper function to safely fetch from Sanity
async function safeFetch<T>(query: string, params?: Record<string, unknown>): Promise<T[]> {
  try {
    // Use explicit typing to bypass Sanity client issues
    const result = await (client as {fetch: (query: string, params: Record<string, unknown>) => Promise<unknown>}).fetch(query, params || {})
    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return []
  }
}

// Get all categories from Sanity for keyword context
export async function getAllCategories(): Promise<Array<{title: string, slug: {current: string}, description?: string}>> {
  const categoriesQuery = `*[_type == "category" && defined(slug.current)] {
    title,
    slug,
    description
  }`
  
  return safeFetch(categoriesQuery)
}

// Enhanced keyword-aware search that uses categories and common terms
export async function intelligentSearch(query: string): Promise<{
  posts: Array<{title: string, slug: {current: string}, type: 'post', category?: string}>
  projects: Array<{title: string, slug: {current: string}, type: 'project', category?: string}>
  categories: Array<{title: string, slug: {current: string}}>
}> {
  try {
    // Search posts with enhanced keyword matching
    const postsQuery = `*[_type == "post" && defined(slug.current) && (
      title match "*" + $query + "*" ||
      excerpt match "*" + $query + "*" ||
      category->title match "*" + $query + "*" ||
      category->description match "*" + $query + "*" ||
      author->name match "*" + $query + "*" ||
      $query in tags[] ||
      lower(title) match "*" + lower($query) + "*" ||
      lower(excerpt) match "*" + lower($query) + "*" ||
      lower(category->title) match "*" + lower($query) + "*" ||
      lower($query) in string::lower(tags[])
    )] | order(publishedAt desc) {
      title,
      slug,
      "type": "post",
      "category": category->title
    }`
    
    // Search projects with enhanced keyword matching  
    const projectsQuery = `*[_type == "project" && defined(slug.current) && (
      title match "*" + $query + "*" ||
      description match "*" + $query + "*" ||
      category->title match "*" + $query + "*" ||
      category->description match "*" + $query + "*" ||
      $query in technologies[] ||
      lower(title) match "*" + lower($query) + "*" ||
      lower(description) match "*" + lower($query) + "*" ||
      lower(category->title) match "*" + lower($query) + "*" ||
      lower($query) in string::lower(technologies[])
    )] | order(priority desc, completedAt desc) {
      title,
      slug,
      "type": "project",
      "category": category->title
    }`
    
    // Search categories directly
    const categoryQuery = `*[_type == "category" && defined(slug.current) && (
      title match "*" + $query + "*" ||
      description match "*" + $query + "*" ||
      lower(title) match "*" + lower($query) + "*" ||
      lower(description) match "*" + lower($query) + "*"
    )] {
      title,
      slug
    }`

    const [posts, projects, matchedCategories] = await Promise.all([
      safeFetch(postsQuery, { query }),
      safeFetch(projectsQuery, { query }),
      safeFetch(categoryQuery, { query })
    ])

    return {
      posts: (posts || []) as Array<{title: string, slug: {current: string}, type: 'post', category?: string}>,
      projects: (projects || []) as Array<{title: string, slug: {current: string}, type: 'project', category?: string}>,
      categories: (matchedCategories || []) as Array<{title: string, slug: {current: string}}>
    }
  } catch (error) {
    console.error('Error in intelligent search:', error)
    return { posts: [], projects: [], categories: [] }
  }
}

// Search functions with proper typing and error handling
export async function searchPosts(query: string): Promise<BlogPost[]> {
  const searchQuery = `*[_type == "post" && defined(slug.current) && (
    title match "*" + $query + "*" ||
    excerpt match "*" + $query + "*" ||
    categories[]->title match "*" + $query + "*" ||
    author->name match "*" + $query + "*" ||
    lower(title) match "*" + lower($query) + "*" ||
    lower(excerpt) match "*" + lower($query) + "*"
  )] | order(publishedAt desc) {
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
  }`
  
  return safeFetch<BlogPost>(searchQuery, { query })
}

export async function searchProjects(query: string): Promise<Project[]> {
  const searchQuery = `*[_type == "project" && defined(slug.current) && (
    title match "*" + $query + "*" ||
    description match "*" + $query + "*" ||
    category->title match "*" + $query + "*" ||
    $query in technologies[] ||
    lower(title) match "*" + lower($query) + "*" ||
    lower(description) match "*" + lower($query) + "*" ||
    lower($query) in string::lower(technologies[])
  )] | order(priority desc, completedAt desc) {
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
  }`
  
  return safeFetch<Project>(searchQuery, { query })
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const getAllPostsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
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
  }`
  
  return safeFetch<BlogPost>(getAllPostsQuery)
}

export async function getAllProjects(): Promise<Project[]> {
  const getAllProjectsQuery = `*[_type == "project" && defined(slug.current)] | order(priority desc, completedAt desc) {
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
  }`
  
  return safeFetch<Project>(getAllProjectsQuery)
}

// Get recent content
export async function getRecentContent(): Promise<{
  recentPosts: BlogPost[]
  recentProjects: Project[]
}> {
  try {
    const recentContentQuery = `{
      "recentPosts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...5] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        estimatedReadTime,
        categories[]->{
          title,
          slug,
          color
        }
      },
      "recentProjects": *[_type == "project" && defined(slug.current)] | order(completedAt desc) [0...5] {
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
        status
      }
    }`
    
    const results = await (client as {fetch: (query: string) => Promise<{recentPosts?: unknown[], recentProjects?: unknown[]}>}).fetch(recentContentQuery)
    return {
      recentPosts: Array.isArray(results?.recentPosts) ? results.recentPosts as BlogPost[] : [],
      recentProjects: Array.isArray(results?.recentProjects) ? results.recentProjects as Project[] : []
    }
  } catch (error) {
    console.error('Error getting recent content:', error)
    return { recentPosts: [], recentProjects: [] }
  }
}

// Technology-aware search
export async function searchByTechnology(tech: string): Promise<{
  posts: BlogPost[]
  projects: Project[]
}> {
  try {
    // Normalize technology names for better matching
    const normalizedTech = normalizeTechnology(tech)
    
    // Search with both original and normalized terms
    const searchTerms = [tech, normalizedTech].filter((term, index, arr) => 
      arr.indexOf(term) === index // Remove duplicates
    )
    
    const [posts, projects] = await Promise.all([
      searchPosts(searchTerms.join(' ')),
      searchProjects(searchTerms.join(' '))
    ])
    
    return { posts, projects }
  } catch (error) {
    console.error('Error searching by technology:', error)
    return { posts: [], projects: [] }
  }
}

// Find specific content by exact title match
export async function findByExactTitle(title: string, type: 'post' | 'project'): Promise<BlogPost | Project | null> {
  try {
    const query = type === 'post' 
      ? `*[_type == "post" && defined(slug.current) && lower(title) == lower($title)][0] {
          _id, title, slug, excerpt, publishedAt, estimatedReadTime,
          author->{ name, image, slug },
          categories[]->{ title, slug, color },
          mainImage{ asset->{ _id, url }, alt }
        }`
      : `*[_type == "project" && defined(slug.current) && lower(title) == lower($title)][0] {
          _id, title, slug, description,
          category->{ title, slug, color },
          technologies, status, featured, priority, links, metrics,
          mainImage{ asset->{ _id, url }, alt },
          completedAt
        }`
    
    const result = await (client as {fetch: (query: string, params: {title: string}) => Promise<unknown>}).fetch(query, { title })
    return result ? (result as BlogPost | Project) : null
  } catch (error) {
    console.error(`Error finding ${type} by exact title:`, error)
    return null
  }
}

// Normalize technology names for better matching
function normalizeTechnology(tech: string): string {
  const techMap: Record<string, string> = {
    'nextjs': 'Next.js',
    'next.js': 'Next.js', 
    'next': 'Next.js',
    'reactjs': 'React',
    'react': 'React',
    'typescript': 'TypeScript',
    'ts': 'TypeScript',
    'javascript': 'JavaScript',
    'js': 'JavaScript',
    'nodejs': 'Node.js',
    'node': 'Node.js',
    'threejs': 'Three.js',
    'three.js': 'Three.js',
    'three': 'Three.js',
    'tailwindcss': 'TailwindCSS',
    'tailwind': 'TailwindCSS'
  }
  
  return techMap[tech.toLowerCase()] || tech
}