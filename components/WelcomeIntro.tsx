"use client";
import { useState, useRef, useEffect } from "react";
import { Box, Typography, IconButton, Slider, Tooltip } from "@mui/material";
import { PlayArrow, Pause, Replay10, Forward10 } from "@mui/icons-material";
import type { Story } from "@/lib/sanity";

interface WelcomeIntroProps {
  story: Story;
}

export default function WelcomeIntro({ story }: WelcomeIntroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreviewTime, setSeekPreviewTime] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    // Check if duration is already available
    if (audio.duration) {
      setDuration(audio.duration);
    }

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isSeeking]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
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

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const valueLabelFormat = (value: number) => {
    return formatTime(value);
  };

  const displayTime =
    isSeeking && seekPreviewTime !== null ? seekPreviewTime : currentTime;

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: "auto",
        mb: 4,
        p: 2.5,
        borderRadius: 3,
        background:
          "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="overline"
          sx={{
            color: "secondary.main",
            fontWeight: 700,
            letterSpacing: "0.1em",
            fontSize: "0.7rem",
          }}
        >
          Welcome
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            fontSize: "1rem",
            mt: 0.5,
          }}
        >
          {story.title}
        </Typography>
        {story.description && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              mt: 0.5,
              lineHeight: 1.4,
            }}
          >
            {story.description}
          </Typography>
        )}
      </Box>

      <audio ref={audioRef} src={story.audioUrl} preload="metadata" />

      {/* Progress slider */}
      <Box sx={{ px: 1 }}>
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
          size="small"
          sx={{
            "& .MuiSlider-thumb": {
              width: 14,
              height: 14,
            },
            "& .MuiSlider-track": {
              height: 4,
            },
            "& .MuiSlider-rail": {
              height: 4,
            },
            "& .MuiSlider-valueLabel": {
              backgroundColor: "primary.main",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 600,
            },
          }}
        />
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mt: -0.5 }}
        >
          {isSeeking && seekPreviewTime !== null ? (
            <Typography
              variant="caption"
              color="primary.main"
              sx={{ fontWeight: 600, fontSize: "0.7rem" }}
            >
              {formatTime(currentTime)} → {formatTime(seekPreviewTime)}
            </Typography>
          ) : (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.7rem" }}
            >
              {formatTime(currentTime)}
            </Typography>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.7rem" }}
          >
            {formatTime(duration)}
          </Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          mt: 1.5,
        }}
      >
        <Tooltip title="Back 10s">
          <IconButton
            onClick={handleSkipBackward}
            aria-label="Skip backward 10 seconds"
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "text.primary",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              },
            }}
          >
            <Replay10 sx={{ fontSize: 24 }} />
          </IconButton>
        </Tooltip>

        <IconButton
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            width: 48,
            height: 48,
            mx: 1,
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          {isPlaying ? (
            <Pause sx={{ fontSize: 28 }} />
          ) : (
            <PlayArrow sx={{ fontSize: 28 }} />
          )}
        </IconButton>

        <Tooltip title="Forward 10s">
          <IconButton
            onClick={handleSkipForward}
            aria-label="Skip forward 10 seconds"
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "text.primary",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              },
            }}
          >
            <Forward10 sx={{ fontSize: 24 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
