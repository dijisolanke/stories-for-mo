"use client"
import { useState, useMemo } from "react"
import { Container, Typography, Box } from "@mui/material"
import type { Story } from "@/lib/sanity"
import StoryCard from "./StoryCard"
import AudioPlayer from "./AudioPlayer"
import TagFilter from "./TagFilter"

interface Props {
  initialStories: Story[]
}

export default function StoriesBrowser({ initialStories }: Props) {
  const [stories] = useState(initialStories)
  const [selectedTag, setSelectedTag] = useState("")
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

  const availableTags = useMemo(() => {
    const set = new Set<string>()
    stories.forEach(({ tags }) => tags?.split(",").forEach((tag) => set.add(tag.trim())))
    return [...set].sort()
  }, [stories])

  const filteredStories = useMemo(() => {
    if (!selectedTag) return stories
    return stories.filter((s) => s.tags?.toLowerCase().includes(selectedTag.toLowerCase()))
  }, [stories, selectedTag])

  return (
    <Container maxWidth="lg" sx={{ pb: selectedStory ? 20 : 4 }}>
      <TagFilter availableTags={availableTags} selectedTag={selectedTag} onTagChange={setSelectedTag} />

      {filteredStories.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {selectedTag ? `No stories tagged "${selectedTag}"` : "No stories available"}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: {
              xs: "center", // Center on mobile
              sm: "flex-start", // Left align on larger screens
            },
          }}
        >
          {filteredStories.map((story) => (
            <StoryCard key={story._id} story={story} onPlay={setSelectedStory} />
          ))}
        </Box>
      )}

      <AudioPlayer story={selectedStory} onClose={() => setSelectedStory(null)} />
    </Container>
  )
}
