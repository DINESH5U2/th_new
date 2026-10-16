import { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { accent, ink, surface } from "../utils/designTokens";
import { eventCards as showcase } from "../utils/eventCards";
import CardsRotateSlider from "./CardsRotateSlider";
import Link from "./Link";
import Picture from "./Picture";

// Shape of a card without a poster (width / height)
const FALLBACK_RATIO = 0.78;
const ratioOf = event =>
  event.poster ? event.poster.width / event.poster.height : FALLBACK_RATIO;

/** Just the poster, in its own shape, opening the event. */
function Poster({ event }) {
  return (
    <Box
      component={Link}
      to={`/events/${event.slug}`}
      aria-label={`${event.title}, ${event.dateLabel}`}
      draggable={false}
      sx={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        borderRadius: "14px",
        overflow: "hidden",
        bgcolor: ink,
        color: "#fff",
        textDecoration: "none",
        boxShadow:
          "0 2px 6px rgba(15,26,22,0.12), 0 36px 64px -28px rgba(15,26,22,0.6)",
        transition: "box-shadow 0.3s ease",
        outline: "none",
        "&:hover": {
          boxShadow: `0 0 0 2px rgba(255,255,255,0.9), 0 0 0 5px ${accent}, 0 40px 70px -28px rgba(15,26,22,0.7)`
        },
        "&:focus-visible": {
          boxShadow: `0 0 0 3px #fff, 0 0 0 6px ${accent}, 0 36px 64px -28px rgba(15,26,22,0.6)`
        }
      }}>
      {event.poster ? (
        <Picture
          image={event.poster}
          sizes="(max-width: 640px) 86vw, 600px"
          sx={{ width: 1, height: 1 }}
          imgSx={{ userSelect: "none" }}
        />
      ) : (
        <Typography sx={{ px: 3, fontWeight: 700, textAlign: "center" }}>
          {event.title}
        </Typography>
      )}
    </Box>
  );
}

// Fades cards out where they pass under the heading and the progress bar
const scrim = (edge, height) => ({
  position: "absolute",
  [edge]: 0,
  left: 0,
  right: 0,
  height,
  background: `linear-gradient(to ${edge === "top" ? "bottom" : "top"}, ${surface} 45%, rgba(243,245,244,0))`,
  pointerEvents: "none",
  zIndex: 1
});

/**
 * Every event as a poster in a scroll-driven, rotating card slider; a poster
 * opens its event page.
 */
export default function EventsShowcase() {
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const total = showcase.length;
  const pad = n => String(n).padStart(2, "0");

  // Written straight to the DOM so scrolling never re-renders the slider
  const handleProgress = progress => {
    const current = Math.round(progress * (total - 1)) + 1;
    counterRef.current.textContent = pad(current);
    barRef.current.style.transform = `scaleX(${progress})`;
  };

  return (
    <CardsRotateSlider
      items={showcase}
      getKey={event => event.slug}
      getRatio={ratioOf}
      renderCard={event => <Poster event={event} />}
      rotationAmount={1.1}
      verticalDrift={1}
      perspective={1000}
      onProgress={handleProgress}
      sx={{
        "--card-h": "min(100vh - 280px, 680px)",
        "--card-max-w": "min(86vw, 880px)"
      }}
      stageSx={{
        pt: "80px",
        background: `radial-gradient(55% 50% at 50% 55%, #ffffff, rgba(255,255,255,0)), ${surface}`
      }}>
      <Box sx={scrim("top", { xs: 160, md: 180 })} />
      <Box sx={scrim("bottom", { xs: 64, md: 84 })} />
      <Box
        sx={{
          position: "absolute",
          top: { xs: 84, md: 96 },
          left: 0,
          right: 0,
          px: { xs: 2.5, md: 6 },
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 2,
          pointerEvents: "none",
          zIndex: 1
        }}>
        <Box>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.6rem", md: "2.1rem" },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: ink
            }}>
            Events
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: { xs: "0.85rem", md: "0.95rem" },
              color: "rgba(15,26,22,0.62)"
            }}>
            Contests, workshops and talks, newest first
          </Typography>
        </Box>
        <Typography
          aria-hidden="true"
          sx={{
            fontVariantNumeric: "tabular-nums",
            fontWeight: 600,
            fontSize: { xs: "0.9rem", md: "1rem" },
            color: "rgba(15,26,22,0.45)",
            whiteSpace: "nowrap"
          }}>
          <Box component="span" ref={counterRef} sx={{ color: ink }}>
            {pad(1)}
          </Box>{" "}
          / {pad(total)}
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 20, md: 28 },
          left: 0,
          right: 0,
          px: { xs: 2.5, md: 6 },
          display: "flex",
          alignItems: "center",
          gap: { xs: 2, md: 3 },
          pointerEvents: "none",
          zIndex: 1
        }}>
        <Box
          sx={{
            flex: 1,
            height: 2,
            borderRadius: 1,
            bgcolor: "rgba(15,26,22,0.1)",
            overflow: "hidden"
          }}>
          <Box
            ref={barRef}
            sx={{
              height: 1,
              bgcolor: accent,
              transform: "scaleX(0)",
              transformOrigin: "left"
            }}
          />
        </Box>
        <Typography
          sx={{
            fontSize: { xs: "0.75rem", md: "0.82rem" },
            color: "rgba(15,26,22,0.55)",
            whiteSpace: "nowrap"
          }}>
          Scroll to browse · select a poster for details
        </Typography>
      </Box>
    </CardsRotateSlider>
  );
}
