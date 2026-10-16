import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { accent, ink } from "../utils/designTokens";
import Link from "./Link";

// Smallest webp of a responsive image, for the blurred backdrop
const smallestSource = poster =>
  (poster.images.sources[0] ?? poster.images.fallback).srcSet
    .split(",")[0]
    .trim()
    .split(" ")[0];

/** An event's poster, uncropped, with its details below; fills its box and links to the event. */
export default function PosterCard({ event, titleComponent = "h2" }) {
  const { poster } = event;

  return (
    <Box
      component={Link}
      to={`/events/${event.slug}`}
      aria-label={`${event.title}, ${event.dateLabel}. View event details`}
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        overflow: "hidden",
        bgcolor: ink,
        color: "#fff",
        textDecoration: "none",
        boxShadow:
          "0 2px 6px rgba(15,26,22,0.12), 0 36px 64px -28px rgba(15,26,22,0.6)",
        outline: "none",
        "&:focus-visible": {
          boxShadow: `0 0 0 3px #fff, 0 0 0 6px ${accent}, 0 36px 64px -28px rgba(15,26,22,0.6)`
        },
        "& .poster-main": {
          transition: "transform 0.6s cubic-bezier(.2,.7,.2,1)"
        },
        "& .poster-cta svg": { transition: "transform 0.3s ease" },
        "&:hover .poster-main, &:focus-visible .poster-main": {
          transform: "scale(1.03)"
        },
        "&:hover .poster-cta svg, &:focus-visible .poster-cta svg": {
          transform: "translateX(4px)"
        }
      }}>
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          overflow: "hidden"
        }}>
        {poster && (
          <>
            {/* The poster, uncropped, over a blurred wash of itself */}
            <Box
              component="img"
              aria-hidden="true"
              alt=""
              src={smallestSource(poster)}
              sx={{
                position: "absolute",
                inset: 0,
                width: 1,
                height: 1,
                objectFit: "cover",
                filter: "blur(28px) saturate(1.3) brightness(0.55)",
                transform: "scale(1.25)"
              }}
            />
            <picture>
              {poster.images.sources.map(source => (
                <source key={source.type} {...source} sizes="530px" />
              ))}
              <Box
                component="img"
                className="poster-main"
                {...poster.images.fallback}
                sizes="530px"
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: 1,
                  height: 1,
                  objectFit: "contain"
                }}
              />
            </picture>
          </>
        )}
        {event.status && (
          <Box
            component="span"
            sx={{
              position: "absolute",
              top: 14,
              left: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.25,
              py: 0.5,
              borderRadius: "999px",
              bgcolor: "rgba(255,255,255,0.92)",
              color: ink,
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              backdropFilter: "blur(8px)",
              "&::before": {
                content: '""',
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: event.status === "Today" ? "#e5484d" : "#2fbf71"
              }
            }}>
            {event.status}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: { xs: 1.5, sm: 2 },
          borderTop: "1px solid rgba(255,255,255,0.08)"
        }}>
        <Typography
          component="p"
          sx={{
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)"
          }}>
          {event.type} · {event.dateLabel}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            mt: 0.5
          }}>
          <Typography
            component={titleComponent}
            sx={{
              fontSize: { xs: "1rem", sm: "1.15rem" },
              fontWeight: 650,
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
            {event.title}
          </Typography>
          <Box
            component="span"
            className="poster-cta"
            aria-hidden="true"
            sx={{
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: accent
            }}>
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
