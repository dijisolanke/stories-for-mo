import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from ".";

export default defineConfig({
  name: "default",
  title: "stories2",

  projectId: "n3n7jqd7",
  dataset: "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  basePath: "/admin",
});
