import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required(),
        }
      ]
    }),
    defineField({
      name: 'gallery',
      title: 'Project Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: { type: 'category' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'status',
      title: 'Project Status',
      type: 'string',
      options: {
        list: [
          { title: 'Live', value: 'live' },
          { title: 'Beta', value: 'beta' },
          { title: 'Development', value: 'development' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'priority',
      title: 'Display Priority',
      type: 'number',
      description: 'Higher numbers appear first',
      initialValue: 0,
    }),
    defineField({
      name: 'links',
      title: 'Project Links',
      type: 'object',
      fields: [
        {
          name: 'github',
          title: 'GitHub URL',
          type: 'url',
        },
        {
          name: 'live',
          title: 'Live Site URL',
          type: 'url',
        },
        {
          name: 'demo',
          title: 'Demo URL',
          type: 'url',
        },
        {
          name: 'docs',
          title: 'Documentation URL',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'metrics',
      title: 'Project Metrics',
      type: 'object',
      fields: [
        {
          name: 'users',
          title: 'Active Users',
          type: 'string',
          description: 'e.g., "1.2K", "50K+", etc.',
        },
        {
          name: 'performance',
          title: 'Performance Metric',
          type: 'string',
          description: 'e.g., "98.5% uptime", "50ms response", etc.',
        },
        {
          name: 'value',
          title: 'Value Created',
          type: 'string',
          description: 'e.g., "$2.5M TVL", "340% ROI", etc.',
        },
      ],
    }),
    defineField({
      name: 'highlights',
      title: 'Key Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key features or achievements of this project',
    }),
    defineField({
      name: 'challenges',
      title: 'Technical Challenges',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'challenge',
              title: 'Challenge',
              type: 'string',
            },
            {
              name: 'solution',
              title: 'Solution',
              type: 'text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'completedAt',
      title: 'Completion Date',
      type: 'date',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(155),
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      status: 'status',
      category: 'category.title',
    },
    prepare(selection) {
      const { status, category } = selection
      return {
        ...selection,
        subtitle: `${category} - ${status}`,
      }
    },
  },
  orderings: [
    {
      title: 'Priority (High to Low)',
      name: 'priorityDesc',
      by: [
        { field: 'priority', direction: 'desc' },
        { field: 'completedAt', direction: 'desc' },
      ],
    },
    {
      title: 'Completion Date (Newest First)',
      name: 'completedAtDesc',
      by: [{ field: 'completedAt', direction: 'desc' }],
    },
  ],
})
