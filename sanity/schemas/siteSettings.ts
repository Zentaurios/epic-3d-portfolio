import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'keywords',
      title: 'Default Keywords',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
    }),
    defineField({
      name: 'socialImage',
      title: 'Default Social Share Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineField({
      name: 'author',
      title: 'Primary Author',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Email',
          type: 'email',
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
        },
        {
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 3,
        },
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'url',
        },
        {
          name: 'github',
          title: 'GitHub',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        },
        {
          name: 'discord',
          title: 'Discord',
          type: 'string',
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      fields: [
        {
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
        },
        {
          name: 'gtmId',
          title: 'Google Tag Manager ID',
          type: 'string',
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'features',
      title: 'Feature Toggles',
      type: 'object',
      fields: [
        {
          name: 'enableBlog',
          title: 'Enable Blog',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'enableProjects',
          title: 'Enable Projects',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'enableNewsletter',
          title: 'Enable Newsletter',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'enableComments',
          title: 'Enable Comments',
          type: 'boolean',
          initialValue: false,
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
