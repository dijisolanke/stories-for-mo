import type React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "@mui/material/styles"
import TagFilter from "@/components/TagFilter"
import theme from "@/app/theme"

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

describe("TagFilter", () => {
  const mockTags = ["Funny", "Scary", "Short", "Long"]
  const mockOnTagChange = jest.fn()

  beforeEach(() => {
    mockOnTagChange.mockClear()
  })

  it("renders filter title and select dropdown", () => {
    renderWithTheme(<TagFilter availableTags={mockTags} selectedTag="" onTagChange={mockOnTagChange} />)

    expect(screen.getByText("Filter Stories")).toBeInTheDocument()
    expect(screen.getByLabelText("Choose a mood")).toBeInTheDocument()
  })

  it("displays all available tags in dropdown", () => {
    renderWithTheme(<TagFilter availableTags={mockTags} selectedTag="" onTagChange={mockOnTagChange} />)

    const select = screen.getByLabelText("Choose a mood")
    fireEvent.mouseDown(select)

    expect(screen.getByText("All Stories")).toBeInTheDocument()
    mockTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument()
    })
  })

  it("calls onTagChange when a tag is selected", () => {
    renderWithTheme(<TagFilter availableTags={mockTags} selectedTag="" onTagChange={mockOnTagChange} />)

    const select = screen.getByLabelText("Choose a mood")
    fireEvent.mouseDown(select)

    const funnyOption = screen.getByText("Funny")
    fireEvent.click(funnyOption)

    expect(mockOnTagChange).toHaveBeenCalledWith("Funny")
  })

  it("shows selected tag chip when tag is selected", () => {
    renderWithTheme(<TagFilter availableTags={mockTags} selectedTag="Funny" onTagChange={mockOnTagChange} />)

    expect(screen.getByText("Showing: Funny")).toBeInTheDocument()
  })

  it("clears selection when chip delete button is clicked", () => {
    renderWithTheme(<TagFilter availableTags={mockTags} selectedTag="Funny" onTagChange={mockOnTagChange} />)

    const deleteButton = screen.getByTestId("CancelIcon")
    fireEvent.click(deleteButton)

    expect(mockOnTagChange).toHaveBeenCalledWith("")
  })

  it("has proper accessibility attributes", () => {
    renderWithTheme(<TagFilter availableTags={mockTags} selectedTag="" onTagChange={mockOnTagChange} />)

    const select = screen.getByLabelText("Choose a mood")
    expect(select).toHaveAttribute("aria-describedby", "filter-label")
  })
})
