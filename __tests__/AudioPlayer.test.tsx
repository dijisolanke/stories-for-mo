"use client"

import type React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "@mui/material/styles"
import AudioPlayer from "@/components/AudioPlayer"
import theme from "@/app/theme"
import type { Story } from "@/lib/sanity"

const mockStory: Story = {
  _id: "1",
  title: "Test Audio Story",
  description: "A test story for audio",
  tags: "Relaxing",
  audio: {
    asset: {
      _ref: "test-ref",
      url: "https://example.com/audio.mp3",
    },
  },
}

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

// Mock HTMLAudioElement
const mockAudio = {
  play: jest.fn(() => Promise.resolve()),
  pause: jest.fn(),
  currentTime: 0,
  duration: 100,
  volume: 1,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}

beforeAll(() => {
  global.HTMLAudioElement.prototype.play = mockAudio.play
  global.HTMLAudioElement.prototype.pause = mockAudio.pause
  Object.defineProperty(global.HTMLAudioElement.prototype, "currentTime", {
    get: () => mockAudio.currentTime,
    set: (value) => {
      mockAudio.currentTime = value
    },
  })
  Object.defineProperty(global.HTMLAudioElement.prototype, "duration", {
    get: () => mockAudio.duration,
  })
  Object.defineProperty(global.HTMLAudioElement.prototype, "volume", {
    get: () => mockAudio.volume,
    set: (value) => {
      mockAudio.volume = value
    },
  })
})

describe("AudioPlayer", () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    mockAudio.play.mockClear()
    mockAudio.pause.mockClear()
  })

  it("renders nothing when no story is provided", () => {
    const { container } = renderWithTheme(<AudioPlayer story={null} onClose={mockOnClose} />)

    expect(container.firstChild).toBeNull()
  })

  it("renders story title and controls when story is provided", () => {
    renderWithTheme(<AudioPlayer story={mockStory} onClose={mockOnClose} />)

    expect(screen.getByText("Test Audio Story")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /play story/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /stop story/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /close player/i })).toBeInTheDocument()
  })

  it("calls onClose when close button is clicked", () => {
    renderWithTheme(<AudioPlayer story={mockStory} onClose={mockOnClose} />)

    const closeButton = screen.getByRole("button", { name: /close player/i })
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it("has proper accessibility attributes", () => {
    renderWithTheme(<AudioPlayer story={mockStory} onClose={mockOnClose} />)

    expect(screen.getByRole("slider", { name: /audio progress/i })).toBeInTheDocument()
    expect(screen.getByRole("slider", { name: /volume/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /play story/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /stop story/i })).toBeInTheDocument()
  })

  it("displays time information", () => {
    renderWithTheme(<AudioPlayer story={mockStory} onClose={mockOnClose} />)

    // Should show formatted time (0:00 and 1:40 for 100 seconds)
    expect(screen.getByText("0:00")).toBeInTheDocument()
    expect(screen.getByText("1:40")).toBeInTheDocument()
  })
})
