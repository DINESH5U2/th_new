import { Box } from "@mui/material";
import { homeEvents } from "../../data/home";
import PosterCard from "../PosterCard";
import SectionHeading from "./SectionHeading";

/**
 * Upcoming events when there are any; otherwise the latest ones, so the
 * section is never an empty "coming soon".
 */
export default function EventsPreview() {
  const { upcoming, list } = homeEvents;

  return (
    <Box
      component="section"
      aria-labelledby="home-events"
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2.5, sm: 4, md: 6 },
        py: { xs: 6, md: 10 }
      }}>
      <SectionHeading
        id="home-events"
        kicker={upcoming ? "Coming up" : "Recent events"}
        title={
          upcoming ? "Mark your calendar" : "What we have been up to lately"
        }
        link={{ to: "/events", label: "All events" }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)"
          },
          gap: { xs: 2.5, md: 3 }
        }}>
        {list.map((event, index) => (
          <Box
            key={event.slug}
            sx={{
              position: "relative",
              aspectRatio: "0.78",
              display: {
                xs: "block",
                sm: index === 2 ? "none" : "block",
                md: "block"
              }
            }}>
            <PosterCard event={event} titleComponent="h3" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
