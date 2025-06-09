import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemas } from './sanity/schemas'

// Use hardcoded values for now since env vars aren't loading
const projectId = 'ntqs7f5z'
const dataset = 'production'

export default defineConfig({
  name: 'epic-3d-portfolio',
  title: 'Epic 3D Portfolio',
  projectId,
  dataset,
  server: {
    port: 3333,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog Posts')
              .child(S.documentTypeList('post').title('Blog Posts')),
            S.listItem()
              .title('Projects')
              .child(S.documentTypeList('project').title('Projects')),
            S.listItem()
              .title('Categories')
              .child(S.documentTypeList('category').title('Categories')),
            S.listItem()
              .title('Authors')
              .child(S.documentTypeList('author').title('Authors')),
            S.listItem()
              .title('Site Settings')
              .child(S.editor().id('siteSettings').schemaType('siteSettings').documentId('siteSettings')),
          ]),
    }),
    visionTool(),
    codeInput(),
  ],
  schema: {
    types: schemas,
  },
})
