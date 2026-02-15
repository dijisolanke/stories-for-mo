import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-01-01",
});

export interface Story {
  _id: string;
  title: string;
  description: string;
  tags: string;
  audioUrl: string;
  imageUrl: string;
  isPinned?: boolean;
  publishedAt?: string;
  _createdAt: string;
  storyStartTime?: string; // MM:SS format
}

/**
 * Converts MM:SS string to seconds
 */
export function parseTimeToSeconds(time: string | undefined): number | null {
  if (!time) return null;

  const match = time.match(/^(\d{1,2}):([0-5]\d)$/);
  if (!match) return null;

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  return minutes * 60 + seconds;
}

/**
 * Fetches all non-pinned stories ordered by date (newest first).
 * Stories with publishedAt use that date; others fall back to _createdAt.
 */
export async function getStories(): Promise<Story[]> {
  const query = `*[_type == "story" && isPinned != true] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    _createdAt,
    title,
    description,
    tags,
    "audioUrl": audio.asset->url,
    "imageUrl": image.asset->url,
    isPinned,
    publishedAt,
    storyStartTime
  }`;
  return client.fetch(query);
}

/**
 * Fetches the pinned intro/welcome story if one exists.
 * Returns null if no story is pinned.
 */
export async function getPinnedStory(): Promise<Story | null> {
  const query = `*[_type == "story" && isPinned == true][0] {
    _id,
    _createdAt,
    title,
    description,
    tags,
    "audioUrl": audio.asset->url,
    "imageUrl": image.asset->url,
    isPinned,
    publishedAt,
    storyStartTime
  }`;
  return client.fetch(query);
}

/**
 * Fetches a single story by ID.
 */
export async function getStoryById(id: string): Promise<Story> {
  const query = `*[_type == "story" && _id == $id][0] {
    _id,
    _createdAt,
    title,
    description,
    tags,
    "audioUrl": audio.asset->url,
    "imageUrl": image.asset->url,
    isPinned,
    publishedAt,
    storyStartTime
  }`;
  return await client.fetch(query, { id });
}

/**
 * Helper to check if a story is "new" (within last 3 days)
 */
export function isNewStory(story: Story): boolean {
  const storyDate = story.publishedAt || story._createdAt;
  if (!storyDate) return false;

  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  const storyTime = new Date(storyDate).getTime();
  const now = Date.now();

  return now - storyTime < threeDaysMs;
}
