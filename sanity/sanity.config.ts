import { schemaTypes } from ".";

// sanity.config.ts for v2
export default {
  name: "default",
  title: "stories2",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    // Different plugin syntax for v2
  ],
  schema: {
    types: schemaTypes,
  },
};
