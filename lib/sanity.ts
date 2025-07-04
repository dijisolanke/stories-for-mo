import { createClient } from "@sanity/client"

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-01-01",
})

export interface Story {
  _id: string
  title: string
  description: string
  tags: string
  audioUrl: string
  imageUrl: string
}

export async function getStories(): Promise<Story[]> {
  const query = `*[_type == "story"]{
    _id,
    title,
    description,
    tags,
    "audioUrl": audio.asset->url,
    "imageUrl": image.asset->url
  }`
  return client.fetch(query)
}

export async function getStoryById(id: string): Promise<Story> {
  const query = `*[_type == "story" && _id == $id][0] {
    _id,
    title,
    description,
    tags,
    "audioUrl": audio.asset->url,
    "imageUrl": image.asset->url
  }`

  return await client.fetch(query, { id })
}
