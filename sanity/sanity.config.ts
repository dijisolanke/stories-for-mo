import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './'

const config = {
  name: 'default',
  title: 'Stories for Mo',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  
  plugins: [structureTool(), visionTool()],
  
  schema: {
    types: schemaTypes,
  },
  
  basePath: '/admin',
}

export default config