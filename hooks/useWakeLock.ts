"use client"
import { useEffect, useRef } from "react"

export function useWakeLock(isPlaying: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator && isPlaying) {
          wakeLockRef.current = await navigator.wakeLock.request("screen")
          console.log("Wake lock acquired")
        }
      } catch (err) {
        console.log("Wake lock failed:", err)
      }
    }

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release()
        wakeLockRef.current = null
        console.log("Wake lock released")
      }
    }

    if (isPlaying) {
      requestWakeLock()
    } else {
      releaseWakeLock()
    }

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isPlaying) {
        requestWakeLock()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      releaseWakeLock()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isPlaying])

  return wakeLockRef.current
}
