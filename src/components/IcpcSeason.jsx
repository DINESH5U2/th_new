import { useState } from "react";
import { Box, CircularProgress, Fade, Modal, Typography } from "@mui/material";
import "@fontsource-variable/newsreader/opsz.css";
import icpcImages, { icpcOriginalImages } from "../data/icpcImages";
import { hairline, ink } from "./aboutStyles";

// Editorial serif for numerals and regional names, as on the About page
const serif = '"Newsreader Variable", Georgia, "Times New Roman", serif';
const muted = "#6B6C6F";

const smallCaps = {
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  color: muted
};

// The text beside each photo: justified, hyphenated so justified lines do
// not open wide gaps, and kept to one width so both blocks share an edge
const textMeasure = 680;
const justified = {
  textAlign: "justify",
  hyphens: "auto",
  WebkitHyphens: "auto"
};

const listFormat = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction"
});

// "All India Rank 62" -> 62; "Qualified" -> null
const rankNumber = rank => {
  const match = /\d+/.exec(rank ?? "");
  return match ? Number(match[0]) : null;
};

// "ICPC Asia West Amritapuri Regionals 2025" -> { site: "Amritapuri", series: "ICPC Asia West Regionals", year: "2025" }
function parseEvent(event) {
  const year = /\b(\d{4})\b/.exec(event)?.[1] ?? "";
  const asiaWest = /Asia West/i.test(event);
  const site = event
    .replace(/^ICPC\s+/i, "")
    .replace(/^Asia West\s+/i, "")
    .replace(/\s*Regionals?\b.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  return {
    site,
    series: asiaWest ? "ICPC Asia West Regionals" : "ICPC Regionals",
    year
  };
}

// Entries grouped by regional, each regional's teams best rank first
function groupByRegional(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const key = entry.event.trim();
    if (!groups.has(key)) groups.set(key, { ...parseEvent(key), entries: [] });
    groups.get(key).entries.push(entry);
  }
  const byRank = (a, b) =>
    (rankNumber(a.rank) ?? Infinity) - (rankNumber(b.rank) ?? Infinity);
  return [...groups.values()].map(group => ({
    ...group,
    entries: group.entries.sort(byRank)
  }));
}

function Stat({ label, value }) {
  return (
    <Box
      sx={{
        py: { xs: 2, md: 2.5 },
        px: { xs: 1.5, sm: 2, md: 3 },
        borderLeft: `1px solid ${hairline}`
      }}>
      <Typography component="div" sx={smallCaps}>
        {label}
      </Typography>
      <Typography
        component="div"
        sx={{
          mt: 0.75,
          fontFamily: serif,
          fontOpticalSizing: "auto",
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.4rem" },
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: ink,
          fontVariantNumeric: "lining-nums tabular-nums"
        }}>
        {value}
      </Typography>
    </Box>
  );
}

function Photo({ entry, onOpen }) {
  const src = entry.imagePath && icpcImages[entry.imagePath];
  const original = entry.imagePath && icpcOriginalImages[entry.imagePath];
  const frame = {
    gridArea: "photo",
    width: "100%",
    aspectRatio: "4 / 3",
    borderRadius: "4px",
    overflow: "hidden",
    bgcolor: "#F2F2EF"
  };

  if (!src) {
    // No photo: the team's initials, set like a placeholder plate
    const initials = entry.team
      .replace(/[^A-Za-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join("");
    return (
      <Box
        aria-hidden="true"
        sx={{
          ...frame,
          display: "grid",
          placeItems: "center",
          border: `1px solid ${hairline}`,
          fontFamily: serif,
          fontSize: "2.5rem",
          fontStyle: "italic",
          color: "#A3A4A6"
        }}>
        {initials || "—"}
      </Box>
    );
  }

  const alt = `Team ${entry.team.trim()} at ${entry.event}`;

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onOpen({ src: original ?? src, alt })}
      aria-label={`View the photo of team ${entry.team.trim()} at full size`}
      sx={{
        ...frame,
        display: "block",
        p: 0,
        border: 0,
        font: "inherit",
        cursor: "default",
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 3
        }
      }}>
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        sx={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 35%",
          transition: "transform 0.6s cubic-bezier(0.32, 0.72, 0, 1)"
        }}
      />
    </Box>
  );
}

function TeamRow({ entry, isSeasonBest, onOpenPhoto }) {
  const rank = rankNumber(entry.rank);
  const members = Array.isArray(entry.members)
    ? listFormat.format(entry.members)
    : entry.members;

  return (
    <Box
      component="li"
      sx={{
        display: "grid",
        // Phones: photo first, then rank beside the name, then the story
        gridTemplateAreas: {
          xs: '"photo photo" "rank name" "body body"',
          md: '"rank photo name" "rank photo body"'
        },
        gridTemplateColumns: { xs: "64px 1fr", md: "96px 220px 1fr" },
        gridTemplateRows: { md: "auto 1fr" },
        columnGap: { xs: 2, md: 4 },
        rowGap: { xs: 1.5, md: 1 },
        py: { xs: 3, md: 4 },
        borderTop: `1px solid ${hairline}`,
        "&:first-of-type": { borderTop: 0 },
        "&:hover img": { transform: "scale(1.03)" }
      }}>
      <Box sx={{ gridArea: "rank", pt: { md: 0.5 } }}>
        {rank !== null ? (
          <>
            <Typography component="div" sx={smallCaps}>
              AIR
            </Typography>
            <Typography
              component="div"
              sx={{
                fontFamily: serif,
                fontOpticalSizing: "auto",
                fontSize: { xs: "2.25rem", md: "3.25rem" },
                fontWeight: 500,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: ink,
                fontVariantNumeric: "lining-nums tabular-nums"
              }}>
              {rank}
            </Typography>
          </>
        ) : (
          <Typography
            component="div"
            sx={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: { xs: "1.05rem", md: "1.2rem" },
              lineHeight: 1.2,
              color: ink,
              pt: { xs: 0.5, md: 0 }
            }}>
            Qualified
          </Typography>
        )}
      </Box>

      <Photo entry={entry} onOpen={onOpenPhoto} />

      <Box
        sx={{
          gridArea: "name",
          minWidth: 0,
          maxWidth: textMeasure,
          alignSelf: { xs: "end", md: "start" }
        }}>
        {isSeasonBest && (
          <Typography
            component="div"
            sx={{ ...smallCaps, color: "primary.main", mb: 0.5 }}>
            Season best
          </Typography>
        )}
        <Typography
          component="h4"
          sx={{
            m: 0,
            fontSize: { xs: "1.2rem", md: "1.4rem" },
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "-0.015em",
            color: ink,
            overflowWrap: "anywhere"
          }}>
          {entry.team.trim()}
        </Typography>
        <Typography
          sx={{
            mt: 0.5,
            fontSize: "0.92rem",
            lineHeight: 1.5,
            color: muted,
            ...justified
          }}>
          {members}
        </Typography>
      </Box>

      <Box sx={{ gridArea: "body", minWidth: 0, maxWidth: textMeasure }}>
        <Typography
          sx={{
            fontSize: "0.95rem",
            lineHeight: 1.65,
            color: "#3A3B3E",
            ...justified
          }}>
          {entry.description}
        </Typography>
        {entry.linkedinPost && (
          <Box
            component="a"
            href={entry.linkedinPost}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-block",
              mt: 1.5,
              fontSize: "0.88rem",
              fontWeight: 600,
              color: ink,
              textDecoration: "underline",
              textDecorationColor: hairline,
              textUnderlineOffset: "4px",
              transition: "text-decoration-color 0.2s ease",
              "&:hover": { textDecorationColor: ink }
            }}>
            Read the LinkedIn post ↗
          </Box>
        )}
      </Box>
    </Box>
  );
}

// One photo at its natural size: shown whole, never scaled up, and only
// scaled down when it is larger than the screen
function LightboxImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <CircularProgress
          size={28}
          thickness={4}
          sx={{ gridArea: "1 / 1", color: "rgba(255, 255, 255, 0.7)" }}
        />
      )}
      <Box
        component="img"
        src={src}
        alt={alt}
        // A cached image can finish before React attaches onLoad
        ref={img => {
          if (img?.complete && img.naturalWidth) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        sx={{
          gridArea: "1 / 1",
          display: "block",
          width: "auto",
          height: "auto",
          maxWidth: { xs: "calc(100vw - 32px)", md: "calc(100vw - 64px)" },
          maxHeight: { xs: "calc(100dvh - 32px)", md: "calc(100dvh - 64px)" },
          borderRadius: "4px",
          boxShadow: "0 24px 60px -20px rgba(0, 0, 0, 0.6)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.25s ease"
        }}
      />
    </>
  );
}

function PhotoLightbox({ photo, open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-label={photo?.alt ?? "Photo"}
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: "rgba(10, 10, 12, 0.88)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)"
          }
        }
      }}>
      <Fade in={open}>
        {/* Any click closes it, the photo included; Esc closes it too */}
        <Box
          tabIndex={-1}
          onClick={onClose}
          sx={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            outline: "none",
            cursor: "default"
          }}>
          {photo && (
            <LightboxImage key={photo.src} src={photo.src} alt={photo.alt} />
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

/**
 * One ICPC season as a results sheet: a strip of headline numbers, then each
 * regional the club competed at with its teams in rank order.
 */
export default function IcpcSeason({ year, entries }) {
  const regionals = groupByRegional(entries);
  const ranks = entries.map(e => rankNumber(e.rank)).filter(r => r !== null);
  const best = ranks.length ? Math.min(...ranks) : null;
  const teamCount = new Set(entries.map(e => e.team.trim().toLowerCase())).size;
  const [start, end] = year.split("-");
  const season = end ? `${start}–${end.slice(-2)}` : year;
  // The photo stays set while the modal fades out, so it does not vanish early
  const [photo, setPhoto] = useState(null);
  const [photoOpen, setPhotoOpen] = useState(false);
  const openPhoto = next => {
    setPhoto(next);
    setPhotoOpen(true);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderTop: `1px solid ${ink}`,
          borderBottom: `1px solid ${hairline}`,
          // The outer edge needs no rule
          "& > :first-of-type": { borderLeft: 0, pl: 0 }
        }}>
        <Stat label="Season" value={season} />
        <Stat label="Teams" value={teamCount} />
        <Stat
          label={regionals.length === 1 ? "Regional" : "Regionals"}
          value={regionals.length}
        />
      </Box>

      {regionals.map(regional => (
        <Box
          component="section"
          key={regional.site + regional.year}
          sx={{ mt: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 2,
              pb: 1.5,
              borderBottom: `1px solid ${ink}`
            }}>
            <Box>
              <Typography component="div" sx={smallCaps}>
                {regional.series} · {regional.year}
              </Typography>
              <Typography
                component="h3"
                sx={{
                  m: 0,
                  mt: 0.5,
                  fontFamily: serif,
                  fontOpticalSizing: "auto",
                  fontSize: { xs: "1.9rem", md: "2.6rem" },
                  fontWeight: 500,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: ink
                }}>
                {regional.site}
              </Typography>
            </Box>
            <Typography
              component="div"
              sx={{ ...smallCaps, whiteSpace: "nowrap", pb: 0.5 }}>
              {regional.entries.length}{" "}
              {regional.entries.length === 1 ? "team" : "teams"}
            </Typography>
          </Box>

          <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0 }}>
            {regional.entries.map(entry => (
              <TeamRow
                key={entry.id}
                entry={entry}
                isSeasonBest={best !== null && rankNumber(entry.rank) === best}
                onOpenPhoto={openPhoto}
              />
            ))}
          </Box>
        </Box>
      ))}

      <PhotoLightbox
        photo={photo}
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
      />
    </Box>
  );
}
