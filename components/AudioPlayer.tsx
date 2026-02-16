"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Slider,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  Close,
  Forward10,
  Replay10,
} from "@mui/icons-material";
import type { Story } from "@/lib/sanity";
import { parseTimeToSeconds } from "@/lib/sanity";

const STORAGE_KEY = "bedtime-story-playback";

interface PlaybackState {
  storyId: string;
  currentTime: number;
  timestamp: number;
}

function savePlaybackPosition(storyId: string, time: number) {
  try {
    const state: PlaybackState = {
      storyId,
      currentTime: time,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (e.g. private browsing)
  }
}

function getSavedPlaybackPosition(storyId: string): number | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const state: PlaybackState = JSON.parse(stored);

    // Only restore if same story and saved within last 7 days
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (
      state.storyId === storyId &&
      Date.now() - state.timestamp < sevenDaysMs
    ) {
      return state.currentTime;
    }
    return null;
  } catch {
    return null;
  }
}

function clearPlaybackPosition() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

interface AudioPlayerProps {
  story: Story | null;
  onClose: () => void;
}

export default function AudioPlayer({ story, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreviewTime, setSeekPreviewTime] = useState<number | null>(null);
  const [hasRestoredPosition, setHasRestoredPosition] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastStoryIdRef = useRef<string | null>(null);

  // Reset restoration flag when story changes
  useEffect(() => {
    if (story && story._id !== lastStoryIdRef.current) {
      setHasRestoredPosition(false);
      lastStoryIdRef.current = story._id;
    }
  }, [story]);

  // Restore saved playback position when audio is ready
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !story || hasRestoredPosition) return;

    const restorePosition = () => {
      const savedTime = getSavedPlaybackPosition(story._id);
      if (savedTime !== null && savedTime < audio.duration - 1) {
        audio.currentTime = savedTime;
        setCurrentTime(savedTime);
      }
      setHasRestoredPosition(true);
    };

    // Restore once metadata is loaded
    if (audio.readyState >= 1) {
      restorePosition();
    } else {
      audio.addEventListener("loadedmetadata", restorePosition, { once: true });
      return () => audio.removeEventListener("loadedmetadata", restorePosition);
    }
  }, [story, hasRestoredPosition]);

  // Save position periodically while playing
  useEffect(() => {
    if (!isPlaying || !story) return;

    const interval = setInterval(() => {
      if (audioRef.current && currentTime > 0) {
        savePlaybackPosition(story._id, currentTime);
      }
    }, 5000); // Save every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, story, currentTime]);

  // Save position on pause, seek, and before page unload
  const saveCurrentPosition = useCallback(() => {
    if (
      story &&
      currentTime > 0 &&
      duration > 0 &&
      currentTime < duration - 1
    ) {
      savePlaybackPosition(story._id, currentTime);
    }
  }, [story, currentTime, duration]);

  useEffect(() => {
    window.addEventListener("beforeunload", saveCurrentPosition);
    return () =>
      window.removeEventListener("beforeunload", saveCurrentPosition);
  }, [saveCurrentPosition]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !story) return;

    const updateTime = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      clearPlaybackPosition(); // Clear saved position when story finishes
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "none";
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

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
      });

      navigator.mediaSession.setActionHandler("play", () => {
        audio.play();
        setIsPlaying(true);
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        audio.pause();
        setIsPlaying(false);
      });

      navigator.mediaSession.setActionHandler("stop", () => {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
      });

      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        const skipTime = details.seekOffset || 10;
        audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
      });

      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        const skipTime = details.seekOffset || 10;
        audio.currentTime = Math.min(
          audio.currentTime + skipTime,
          audio.duration
        );
      });

      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime) {
          audio.currentTime = details.seekTime;
        }
      });
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [story, isSeeking]);

  // Update Media Session position state
  useEffect(() => {
    if ("mediaSession" in navigator && duration > 0) {
      navigator.mediaSession.setPositionState({
        duration: duration,
        playbackRate: 1,
        position: currentTime,
      });
    }
  }, [currentTime, duration]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        saveCurrentPosition(); // Save position when pausing
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "paused";
        }
      } else {
        await audio.play();
        setIsPlaying(true);
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "playing";
        }
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    clearPlaybackPosition(); // Clear saved position when manually stopping

    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "none";
    }
  };

  const handleSkipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(audio.currentTime - 10, 0);
    setCurrentTime(audio.currentTime);
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
    setCurrentTime(audio.currentTime);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (_event: Event, newValue: number | number[]) => {
    const time = newValue as number;
    setSeekPreviewTime(time);
  };

  const handleSeekCommit = (
    _event: Event | React.SyntheticEvent,
    newValue: number | number[]
  ) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = newValue as number;
    audio.currentTime = time;
    setCurrentTime(time);
    setIsSeeking(false);
    setSeekPreviewTime(null);
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const vol = newValue as number;
    audio.volume = vol;
    setVolume(vol);
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Tooltip label for slider thumb
  const valueLabelFormat = (value: number) => {
    return formatTime(value);
  };

  if (!story) return null;

  const displayTime =
    isSeeking && seekPreviewTime !== null ? seekPreviewTime : currentTime;
  const storyStartSeconds = parseTimeToSeconds(story.storyStartTime);

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
          <IconButton
            onClick={() => {
              saveCurrentPosition();
              onClose();
            }}
            aria-label="Close player"
            sx={{ ml: 2 }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Skip intro button - shows only when before story start time */}
        {storyStartSeconds &&
          storyStartSeconds > 0 &&
          currentTime < storyStartSeconds && (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const audio = audioRef.current;
                  if (audio) {
                    audio.currentTime = storyStartSeconds;
                    setCurrentTime(storyStartSeconds);
                  }
                }}
                sx={{
                  borderColor: "rgba(167, 139, 250, 0.5)",
                  color: "secondary.main",
                  fontSize: "0.8rem",
                  py: 0.5,
                  "&:hover": {
                    borderColor: "secondary.main",
                    backgroundColor: "rgba(251, 191, 36, 0.1)",
                  },
                }}
              >
                Skip intro →
              </Button>
            </Box>
          )}

        <audio
          ref={audioRef}
          src={story.audioUrl}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Progress slider with tooltip */}
        <Box sx={{ mb: 2, position: "relative" }}>
          <Slider
            value={displayTime}
            max={duration || 100}
            onChange={handleSeekChange}
            onChangeCommitted={handleSeekCommit}
            onMouseDown={handleSeekStart}
            onTouchStart={handleSeekStart}
            valueLabelDisplay="auto"
            valueLabelFormat={valueLabelFormat}
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
              "& .MuiSlider-valueLabel": {
                backgroundColor: "primary.main",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
              },
            }}
          />
          {/* Story start marker */}
          {storyStartSeconds && storyStartSeconds > 0 && duration > 0 && (
            <Tooltip
              title={`Story starts at ${story.storyStartTime}`}
              placement="top"
            >
              <Box
                onClick={() => {
                  const audio = audioRef.current;
                  if (audio) {
                    audio.currentTime = storyStartSeconds;
                    setCurrentTime(storyStartSeconds);
                  }
                }}
                sx={{
                  position: "absolute",
                  left: `${(storyStartSeconds / duration) * 100}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 2,
                  height: 16,
                  backgroundColor: "secondary.main",
                  borderRadius: 1,
                  cursor: "pointer",
                  zIndex: 1,
                  opacity: 0.9,
                  transition: "transform 0.15s ease",
                  "&:hover": {
                    transform: "translate(-50%, -50%) scale(1.3)",
                    opacity: 1,
                  },
                }}
              />
            </Tooltip>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            {/* Show preview time with arrow when seeking */}
            {isSeeking && seekPreviewTime !== null ? (
              <Typography
                variant="body2"
                color="primary.main"
                sx={{ fontWeight: 600 }}
              >
                {formatTime(currentTime)} → {formatTime(seekPreviewTime)}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {formatTime(currentTime)}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {formatTime(duration)}
            </Typography>
          </Box>
        </Box>

        {/* Playback controls with skip buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Tooltip title="Back 10 seconds">
            <IconButton
              onClick={handleSkipBackward}
              aria-label="Skip backward 10 seconds"
              sx={{
                color: "text.primary",
                "&:hover": {
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                },
              }}
            >
              <Replay10 sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            onClick={togglePlayPause}
            startIcon={isPlaying ? <Pause /> : <PlayArrow />}
            size="large"
            sx={{
              minWidth: { xs: 100, sm: 120 },
              mx: 1,
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
            aria-label={isPlaying ? "Pause story" : "Play story"}
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>

          <Button
            variant="outlined"
            onClick={handleStop}
            startIcon={<Stop />}
            size="large"
            aria-label="Stop story"
            sx={{
              minWidth: { xs: 100, sm: 120 },
              mx: 1,
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Stop
          </Button>
          <Tooltip title="Forward 10 seconds">
            <IconButton
              onClick={handleSkipForward}
              aria-label="Skip forward 10 seconds"
              sx={{
                color: "text.primary",
                "&:hover": {
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                },
              }}
            >
              <Forward10 sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Volume control */}
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
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.75rem" }}
          >
            ✨ Audio will continue playing when you minimize the app or turn off
            the screen
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
