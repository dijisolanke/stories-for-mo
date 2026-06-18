"use client";
import { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

export default function SplashScreen() {
  const [fadeIn, setFadeIn] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const exitingRef = useRef(false);

  const beginExit = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);

    const audio = audioRef.current;
    if (audio) {
      audio
        .play()
        .then(() => {
          // Remove component after audio finishes
          audio.addEventListener("ended", () => setGone(true), { once: true });
        })
        .catch(() => {
          // Audio blocked — remove after fade completes
          setTimeout(() => setGone(true), 900);
        });
    } else {
      setTimeout(() => setGone(true), 900);
    }
  };

  useEffect(() => {
    const fadeInTimer = setTimeout(() => setFadeIn(true), 80);
    // Auto-exit after 3s — user tap also triggers early
    const exitTimer = setTimeout(beginExit, 3000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <Box
      onClick={beginExit}
      onTouchStart={beginExit}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background:
          "linear-gradient(180deg, #0a0a1a 0%, #12122a 50%, #1a1a3a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        opacity: exiting ? 0 : 1,
        pointerEvents: exiting ? "none" : "auto",
        transition: "opacity 0.9s ease",
        userSelect: "none",
      }}
    >
      <audio ref={audioRef} src="/loading_sound.m4a" />

      {/* Portrait image */}
      <Box
        sx={{
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "scale(1)" : "scale(0.88)",
          transition: "opacity 1.2s ease, transform 1.2s ease",
        }}
      >
        <Image
          src="/portrait_512x512.png"
          alt="Stories for Mo"
          width={180}
          height={180}
          priority
          style={{
            borderRadius: "32px",
            display: "block",
          }}
        />
      </Box>

      {/* Stories text */}
      <Typography
        sx={{
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 1.2s ease 0.25s, transform 1.2s ease 0.25s",
          color: "primary.main",
          fontWeight: 700,
          fontSize: { xs: "2rem", md: "2.5rem" },
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Stories
      </Typography>
    </Box>
  );
}
