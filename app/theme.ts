"use client"
import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8b5cf6", // Soft purple
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    secondary: {
      main: "#fbbf24", // Warm amber
      light: "#fcd34d",
      dark: "#f59e0b",
    },
    background: {
      default: "#1e1b3a", // Deep navy blue
      paper: "#2d2a4a", // Slightly lighter navy
    },
    text: {
      primary: "#f1f5f9", // Soft white
      secondary: "#cbd5e1", // Light gray
    },
    divider: "#475569",
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      color: "#f1f5f9",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
      color: "#f1f5f9",
    },
    body1: {
      fontSize: "1.125rem",
      lineHeight: 1.6,
      color: "#e2e8f0",
    },
    button: {
      fontSize: "1.125rem",
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "12px 24px",
          minHeight: 56,
          fontSize: "1.125rem",
        },
        contained: {
          background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
          boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
            boxShadow: "0 6px 16px rgba(139, 92, 246, 0.4)",
          },
        },
        outlined: {
          borderColor: "#8b5cf6",
          color: "#a78bfa",
          "&:hover": {
            borderColor: "#a78bfa",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: "linear-gradient(135deg, #2d2a4a 0%, #3730a3 100%)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.2)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          height: 40,
          borderRadius: 20,
          background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          color: "#1e1b3a",
          fontWeight: 600,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#8b5cf6",
          "& .MuiSlider-thumb": {
            backgroundColor: "#a78bfa",
            boxShadow: "0 2px 8px rgba(139, 92, 246, 0.3)",
          },
          "& .MuiSlider-track": {
            background: "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)",
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#475569",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8b5cf6",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#a78bfa",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#a78bfa",
          },
        },
      },
    },
  },
})

export default theme
