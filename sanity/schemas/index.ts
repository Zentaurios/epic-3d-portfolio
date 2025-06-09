// This file exports all your Sanity schemas
import { author } from './author'
import { category } from './category'
import { post } from './post'
import { project } from './project'
import { siteSettings } from './siteSettings'
import { blockContent } from './blockContent'

export const schemas = [
  // Content types
  post,
  project,
  
  // Reference types
  author,
  category,
  
  // Singleton types
  siteSettings,
  
  // Block content type
  blockContent,
]
