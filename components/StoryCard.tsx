"use client"
import type React from "react"
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from "@mui/material"
import { PlayArrow, Headphones } from "@mui/icons-material"
import Image from "next/image"
import type { Story } from "@/lib/sanity"

interface StoryCardProps {
  story: Story
  onPlay: (story: Story) => void
}

export default function StoryCard({ story, onPlay }: StoryCardProps) {
  const tags = story.tags ? story.tags.split(",").map((tag) => tag.trim()) : []

  const handlePlay = () => {
    onPlay(story)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handlePlay()
    }
  }

  return (
    <Card
      sx={{
        // Fixed widths for consistent sizing
        width: "100%",
        maxWidth: {
          xs: "100%", // Mobile: full width
          sm: "320px", // Small screens: fixed 320px
          md: "300px", // Medium screens: fixed 300px
          lg: "280px", // Large screens: fixed 280px
        },
        minWidth: {
          xs: "280px", // Minimum width on all screens
          sm: "320px",
          md: "300px",
          lg: "280px",
        },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)",
        },
        "&:focus-within": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)",
        },
      }}
      onClick={handlePlay}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Play story: ${story.title}`}
    >
      {/* Story Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 180,
          overflow: "hidden",
          borderRadius: "16px 16px 0 0",
        }}
      >
        <Image
          src={story.imageUrl || "/placeholder.svg?height=180&width=300"}
          alt={`Cover image for ${story.title}`}
          fill
          style={{
            objectFit: "cover",
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 320px, 300px"
        />
        {/* Audio indicator overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "rgba(139, 92, 246, 0.9)",
            borderRadius: "50%",
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Headphones sx={{ color: "white", fontSize: 20 }} />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Story Title */}
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            lineHeight: 1.3,
            mb: 1.5,
            color: "text.primary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {story.title}
        </Typography>

        {/* Tags with fixed width and scroll */}
        <Box
          sx={{
            width: "100%",
            height: 40,
            mb: 1.5,
            border: "1px solid rgba(139, 92, 246, 0.2)",
            borderRadius: 2,
            p: 0.5,
            backgroundColor: "rgba(139, 92, 246, 0.05)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              overflowX: "auto",
              overflowY: "hidden",
              height: "100%",
              alignItems: "center",
              "&::-webkit-scrollbar": {
                height: 4,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                borderRadius: 2,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(139, 92, 246, 0.5)",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(139, 92, 246, 0.7)",
                },
              },
            }}
          >
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  flexShrink: 0,
                  backgroundColor: "secondary.main",
                  color: "#1e1b3a",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  height: 24,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Story Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "0.9rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            height: "2.8rem", // Fixed height for 2 lines
          }}
        >
          {story.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          fullWidth
          size="large"
          onClick={handlePlay}
          sx={{
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
          }}
          aria-label={`Play ${story.title}`}
        >
          Play Story
        </Button>
      </CardActions>
    </Card>
  )
}
