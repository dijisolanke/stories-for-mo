const story = {
  name: 'story',
  title: 'Bedtime Story',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required().min(1).max(100),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: any) => Rule.required().min(10).max(500),
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'string',
      description: 'Comma-separated tags (e.g., "Funny, Short, Relaxing")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'audio',
      title: 'Audio File',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      tags: 'tags',
    },
    prepare(selection: any) {
      const {title, subtitle, tags} = selection
      return {
        title,
        subtitle: `${subtitle} • Tags: ${tags}`,
      }
    },
  },
}

export default story
