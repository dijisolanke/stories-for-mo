"use client";

import React from "react";
import { Fab, Box } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

// Define props interface
interface FloatingDonationButtonProps {
  donationUrl?: string;
  buttonText?: string;
}

// Jiggle animation keyframes for the coffee icon
const coffeeJiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(-5deg) scale(1.1); }
  20% { transform: rotate(5deg) scale(1.1); }
  30% { transform: rotate(-5deg) scale(1.1); }
  40% { transform: rotate(5deg) scale(1.1); }
  50% { transform: rotate(0deg) scale(1); }
`;

// Styled Fab with custom styling to match the image
const StyledDonationFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: "24px",
  right: "24px",
  backgroundColor: "#4A47A3", // Purple background to match the image
  color: "white",
  zIndex: 1000,
  boxShadow: "0 8px 24px rgba(74, 71, 163, 0.3)",
  transition: "all 0.3s ease",
  borderRadius: "24px",
  padding: "8px 16px",
  minWidth: "140px",
  height: "48px",
  fontSize: "14px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",

  "&:hover": {
    backgroundColor: "#3A3591",
    transform: "translateY(-2px)",
    boxShadow: "0 12px 32px rgba(74, 71, 163, 0.4)",
  },

  "&:active": {
    transform: "translateY(0px)",
  },
}));

// Coffee cup icon with jiggle animation
const CoffeeIcon = styled("img")<{ shouldAnimate: boolean }>(
  ({ shouldAnimate }) => ({
    width: "25px",
    height: "25px",
    marginRight: "5px",
    transformOrigin: "center",
    animation: shouldAnimate ? `${coffeeJiggle} 0.8s ease-in-out` : "none",
  })
);

const FloatingDonationButton: React.FC<FloatingDonationButtonProps> = ({
  donationUrl = "https://pay.sumup.com/b2c/QFULCMYD",
  buttonText = "BUY ME A COFFEE!",
}) => {
  const [shouldAnimate, setShouldAnimate] = React.useState<boolean>(false);

  // Trigger jiggle animation every 10 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setShouldAnimate(true);
      // Reset animation after it completes
      setTimeout(() => setShouldAnimate(false), 800); // Duration matches animation duration
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDonationClick = (): void => {
    window.open(donationUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <StyledDonationFab
      onClick={handleDonationClick}
      aria-label="Donate - Buy us a coffee"
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Coffee cup icon with jiggle animation */}
        <CoffeeIcon
          src="/coffee.png"
          alt="Coffee cup"
          shouldAnimate={shouldAnimate}
        />
        {buttonText}
      </Box>
    </StyledDonationFab>
  );
};

export default FloatingDonationButton;
