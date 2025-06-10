import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'Color Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Purple', value: 'purple' },
          { title: 'Cyan', value: 'cyan' },
          { title: 'Amber', value: 'amber' },
          { title: 'Emerald', value: 'emerald' },
          { title: 'Blue', value: 'blue' },
          { title: 'Red', value: 'red' },
        ],
      },
      initialValue: 'purple',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Lucide React icon name (e.g., "Code", "Zap", "Globe")',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})