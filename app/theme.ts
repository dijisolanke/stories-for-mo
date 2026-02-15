"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#a78bfa", // Soft lavender purple
      light: "#c4b5fd",
      dark: "#8b5cf6",
    },
    secondary: {
      main: "#fbbf24", // Warm amber
      light: "#fcd34d",
      dark: "#f59e0b",
    },
    background: {
      default: "transparent", // Let StarField show through
      paper: "rgba(15, 15, 35, 0.85)", // Semi-transparent deep navy
    },
    text: {
      primary: "#f1f5f9", // Soft white
      secondary: "#a5b4c6", // Muted blue-gray
    },
    divider: "rgba(139, 92, 246, 0.2)",
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0a0a1a",
        },
      },
    },
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
          borderColor: "rgba(167, 139, 250, 0.5)",
          color: "#c4b5fd",
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
          background:
            "linear-gradient(135deg, rgba(20, 20, 45, 0.9) 0%, rgba(30, 25, 60, 0.9) 100%)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(139, 92, 246, 0.15)",
          backdropFilter: "blur(8px)",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(139, 92, 246, 0.25)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
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
          color: "#a78bfa",
          "& .MuiSlider-thumb": {
            backgroundColor: "#c4b5fd",
            boxShadow: "0 2px 8px rgba(139, 92, 246, 0.4)",
            "&:hover": {
              boxShadow: "0 2px 12px rgba(139, 92, 246, 0.6)",
            },
          },
          "& .MuiSlider-track": {
            background: "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)",
          },
          "& .MuiSlider-rail": {
            backgroundColor: "rgba(100, 116, 139, 0.4)",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(139, 92, 246, 0.3)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(139, 92, 246, 0.5)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#a78bfa",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(139, 92, 246, 0.1)",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(20, 20, 45, 0.95)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: 8,
          fontSize: "0.8rem",
        },
      },
    },
  },
});

export default theme;
