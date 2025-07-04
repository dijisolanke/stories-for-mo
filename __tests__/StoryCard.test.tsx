import type React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "@mui/material/styles"
import StoryCard from "@/components/StoryCard"
import theme from "@/app/theme"
import type { Story } from "@/lib/sanity"

const mockStory: Story = {
  _id: "1",
  title: "Test Story",
  description: "A test story description that might be quite long to test the text truncation feature",
  tags: "Funny, Short, Adventure, Magical, Exciting",
  audioUrl: "https://example.com/audio.mp3",
  imageUrl: "https://example.com/image.jpg",
}

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

describe("StoryCard", () => {
  const mockOnPlay = jest.fn()

  beforeEach(() => {
    mockOnPlay.mockClear()
  })

  it("renders story information in correct order", () => {
    renderWithTheme(<StoryCard story={mockStory} onPlay={mockOnPlay} />)

    expect(screen.getByText("Test Story")).toBeInTheDocument()
    expect(screen.getByText("Funny")).toBeInTheDocument()
    expect(screen.getByText("Short")).toBeInTheDocument()
    expect(screen.getByText("Adventure")).toBeInTheDocument()
    expect(screen.getByAltText("Cover image for Test Story")).toBeInTheDocument()
  })

  it("displays image with proper alt text", () => {
    renderWithTheme(<StoryCard story={mockStory} onPlay={mockOnPlay} />)

    const image = screen.getByAltText("Cover image for Test Story")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg")
  })

  it("shows placeholder image when no image URL provided", () => {
    const storyWithoutImage = { ...mockStory, imageUrl: "" }
    renderWithTheme(<StoryCard story={storyWithoutImage} onPlay={mockOnPlay} />)

    const image = screen.getByAltText("Cover image for Test Story")
    expect(image).toHaveAttribute("src", "/placeholder.svg?height=200&width=300")
  })

  it("truncates long descriptions", () => {
    renderWithTheme(<StoryCard story={mockStory} onPlay={mockOnPlay} />)

    const description = screen.getByText(/A test story description/)
    expect(description).toHaveStyle({
      display: "-webkit-box",
      WebkitLineClamp: "3",
    })
  })

  it("handles multiple tags with horizontal scroll", () => {
    renderWithTheme(<StoryCard story={mockStory} onPlay={mockOnPlay} />)

    // Check that all tags are present
    expect(screen.getByText("Funny")).toBeInTheDocument()
    expect(screen.getByText("Short")).toBeInTheDocument()
    expect(screen.getByText("Adventure")).toBeInTheDocument()
    expect(screen.getByText("Magical")).toBeInTheDocument()
    expect(screen.getByText("Exciting")).toBeInTheDocument()
  })

  it("calls onPlay when play button is clicked", () => {
    renderWithTheme(<StoryCard story={mockStory} onPlay={mockOnPlay} />)

    const playButton = screen.getByRole("button", { name: /play test story/i })
    fireEvent.click(playButton)

    expect(mockOnPlay).toHaveBeenCalledWith(mockStory)
  })

  it("calls onPlay when card is clicked", () => {
    renderWithTheme(<StoryCard story={mockStory} onPlay={mockOnPlay} />)

    const card = screen.getByRole("button", { name: /play story: test story/i })
    fireEvent.click(card)

    expect(mockOnPlay).toHaveBeenCalledWith(mockStory)
  })

  it("supports keyboard navigation", () => {
    renderWithTheme(<StoryCard story={mockStory} onPlay={mockOnPlay} />)

    const card = screen.getByRole("button", { name: /play story: test story/i })
    fireEvent.keyDown(card, { key: "Enter" })

    expect(mockOnPlay).toHaveBeenCalledWith(mockStory)
  })

  it("has proper accessibility attributes", () => {
    renderWithTheme(<StoryCard story={mockStory} onPlay={mockOnPlay} />)

    const card = screen.getByRole("button", { name: /play story: test story/i })
    expect(card).toHaveAttribute("tabIndex", "0")

    const playButton = screen.getByRole("button", { name: /play test story/i })
    expect(playButton).toBeInTheDocument()

    const image = screen.getByAltText("Cover image for Test Story")
    expect(image).toBeInTheDocument()
  })
})
