import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemas } from './sanity/schemas'

export default defineConfig({
  name: 'epic-3d-portfolio',
  title: 'Epic 3D Portfolio',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ntqs7f5z',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  
  plugins: [
    structureTool(),
    visionTool(),
    codeInput()
  ],
  
  schema: {
    types: schemas,
  },
  
  // Configure the studio
  studio: {
    components: {
      // Add any custom studio components here if needed
    }
  }
})
