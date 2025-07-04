import { Container, Box, Typography } from "@mui/material";
import { Bedtime } from "@mui/icons-material";
import { getStories } from "@/lib/sanity";
import StoriesBrowser from "@/components/stories-browser";

export const revalidate = 60; // ISR: refresh once a minute

export default async function HomePage() {
  const stories = await getStories();

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Bedtime sx={{ fontSize: 48, color: "primary.main", mr: 2 }} />
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Bedtime Stories
            </Typography>
          </Box>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.25rem", maxWidth: 600, mx: "auto" }}
          >
            Choose a story and relax as you listen to wonderful tales 💤
          </Typography>
        </Box>
      </Container>

      {/* Client-side browsing / filtering / playback */}
      <StoriesBrowser initialStories={stories} />
    </>
  );
}
