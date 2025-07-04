"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, Typography, Button, Slider, Box, IconButton } from "@mui/material"
import { PlayArrow, Pause, Stop, VolumeUp, Close } from "@mui/icons-material"
import type { Story } from "@/lib/sanity"

interface AudioPlayerProps {
  story: Story | null
  onClose: () => void
}

export default function AudioPlayer({ story, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !story) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      // Clear media session when story ends
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "none"
      }
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    // Set up Media Session API for background playback
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: story.title,
        artist: "Bedtime Stories",
        album: "Story Collection",
        artwork: story.imageUrl
          ? [
              { src: story.imageUrl, sizes: "96x96", type: "image/png" },
              { src: story.imageUrl, sizes: "128x128", type: "image/png" },
              { src: story.imageUrl, sizes: "192x192", type: "image/png" },
              { src: story.imageUrl, sizes: "256x256", type: "image/png" },
              { src: story.imageUrl, sizes: "384x384", type: "image/png" },
              { src: story.imageUrl, sizes: "512x512", type: "image/png" },
            ]
          : undefined,
      })

      // Set up action handlers
      navigator.mediaSession.setActionHandler("play", () => {
        audio.play()
        setIsPlaying(true)
      })

      navigator.mediaSession.setActionHandler("pause", () => {
        audio.pause()
        setIsPlaying(false)
      })

      navigator.mediaSession.setActionHandler("stop", () => {
        audio.pause()
        audio.currentTime = 0
        setIsPlaying(false)
        setCurrentTime(0)
      })

      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        const skipTime = details.seekOffset || 10
        audio.currentTime = Math.max(audio.currentTime - skipTime, 0)
      })

      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        const skipTime = details.seekOffset || 10
        audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration)
      })

      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime) {
          audio.currentTime = details.seekTime
        }
      })
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [story])

  // Update Media Session position state
  useEffect(() => {
    if ("mediaSession" in navigator && duration > 0) {
      navigator.mediaSession.setPositionState({
        duration: duration,
        playbackRate: 1,
        position: currentTime,
      })
    }
  }, [currentTime, duration])

  const togglePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "paused"
        }
      } else {
        await audio.play()
        setIsPlaying(true)
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "playing"
        }
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)

    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "none"
    }
  }

  const handleSeek = (event: Event, newValue: number | number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const time = newValue as number
    audio.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const vol = newValue as number
    audio.volume = vol
    setVolume(vol)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!story) return null

  return (
    <Card
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: "16px 16px 0 0",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {story.title}
          </Typography>
          <IconButton onClick={onClose} aria-label="Close player" sx={{ ml: 2 }}>
            <Close />
          </IconButton>
        </Box>

        <audio
          ref={audioRef}
          src={story.audioUrl}
          preload="metadata"
          // Enable background playback
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <Box sx={{ mb: 2 }}>
          <Slider
            value={currentTime}
            max={duration || 100}
            onChange={handleSeek}
            aria-label="Audio progress"
            sx={{
              "& .MuiSlider-thumb": {
                width: 20,
                height: 20,
              },
              "& .MuiSlider-track": {
                height: 6,
              },
              "& .MuiSlider-rail": {
                height: 6,
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {formatTime(currentTime)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatTime(duration)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            onClick={togglePlayPause}
            startIcon={isPlaying ? <Pause /> : <PlayArrow />}
            size="large"
            sx={{ minWidth: 120 }}
            aria-label={isPlaying ? "Pause story" : "Play story"}
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>

          <Button variant="outlined" onClick={handleStop} startIcon={<Stop />} size="large" aria-label="Stop story">
            Stop
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <VolumeUp />
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.1}
            onChange={handleVolumeChange}
            aria-label="Volume"
            sx={{ flexGrow: 1 }}
          />
        </Box>

        {/* Background playback indicator */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
            ✨ Audio will continue playing when you minimize the app or turn off the screen
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
