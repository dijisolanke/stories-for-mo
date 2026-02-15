const story = {
  name: "story",
  title: "Bedtime Story",
  type: "document",
  fields: [
    {
      name: "image",
      title: "Image",
      type: "image",
    },
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required().min(1).max(100),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule: any) => Rule.required().min(10).max(500),
    },
    {
      name: "tags",
      title: "Tags",
      type: "string",
      description: 'Comma-separated tags (e.g., "Funny, Short, Relaxing")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "audio",
      title: "Audio File",
      type: "file",
      options: {
        accept: "audio/*",
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "storyStartTime",
      title: "Story Start Time (MM:SS)",
      type: "string",
      description:
        'Time where the actual story begins, in MM:SS format (e.g., "12:15" or "1:30"). Leave empty if no intro.',
      validation: (Rule: any) =>
        Rule.regex(/^(\d{1,2}):([0-5]\d)$/, {
          name: "time format",
          invert: false,
        }).error('Please use MM:SS format (e.g., "12:15" or "1:30")'),
    },
    {
      name: "isPinned",
      title: "Pin as Welcome/Intro Story",
      type: "boolean",
      description:
        "If enabled, this story will appear in the welcome section at the top. Only one story should be pinned at a time.",
      initialValue: false,
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description:
        "Used for ordering stories. Defaults to creation date if not set.",
      options: {
        dateFormat: "DD-MM-YYYY",
        timeFormat: "HH:mm",
      },
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      tags: "tags",
      isPinned: "isPinned",
    },
    prepare(selection: any) {
      const { title, subtitle, tags, isPinned } = selection;
      return {
        title: isPinned ? `📌 ${title}` : title,
        subtitle: `${subtitle} • Tags: ${tags}`,
      };
    },
  },
  orderings: [
    {
      title: "Published Date, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date, Oldest",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
};

export default story;
