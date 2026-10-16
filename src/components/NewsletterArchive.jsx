import { useMemo, useState } from "react";
import { Box, IconButton, InputBase, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import "@fontsource-variable/newsreader/opsz.css";
import { editions } from "../utils/content";
import Link from "./Link";

const serif = '"Newsreader Variable", Georgia, "Times New Roman", serif';
const ink = "#0f1a16";
const muted = "rgba(15,26,22,0.62)";
const faint = "rgba(15,26,22,0.1)";
const accent = "#16654F";

const dateOf = edition =>
  new Date(edition.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

const yearOf = edition => new Date(edition.date).getFullYear();

// Everything a reader might type: "28", "#28", "edition 28", a month, a topic
const searchText = edition =>
  [
    `#${edition.number} edition ${edition.number} issue ${edition.number}`,
    dateOf(edition),
    edition.summary.excerpt,
    ...edition.summary.topics
  ]
    .join(" ")
    .toLowerCase();

const latest = editions[0];

function Meta({ edition, sx }) {
  return (
    <Typography
      component="p"
      sx={{
        fontSize: "0.8rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: muted,
        ...sx
      }}>
      {dateOf(edition)} · {edition.summary.readingMinutes} min read
    </Typography>
  );
}

function Cover({ cover, sx }) {
  return (
    <Box
      component="picture"
      sx={{ display: "block", overflow: "hidden", bgcolor: "#eef2f0", ...sx }}>
      {cover.images.sources.map(source => (
        <source key={source.type} {...source} />
      ))}
      <Box
        component="img"
        {...cover.images.fallback}
        alt=""
        loading="lazy"
        decoding="async"
        sx={{
          display: "block",
          width: 1,
          height: 1,
          objectFit: "cover",
          transition: "transform 0.6s cubic-bezier(.2,.7,.2,1)"
        }}
      />
    </Box>
  );
}

function FeaturedEdition({ edition }) {
  return (
    <Box
      component={Link}
      to={`/newsletters/${edition.slug}`}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
        gap: { xs: 3, md: 6 },
        alignItems: "center",
        py: { xs: 4, md: 6 },
        color: ink,
        textDecoration: "none",
        "&:hover img, &:focus-visible img": { transform: "scale(1.03)" },
        "&:hover .featured-title, &:focus-visible .featured-title": {
          color: accent
        },
        "&:focus-visible": {
          outline: `3px solid ${accent}`,
          outlineOffset: 8,
          borderRadius: 1
        }
      }}>
      <Box sx={{ order: { xs: 2, md: 1 } }}>
        <Typography
          component="p"
          sx={{
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: accent
          }}>
          Latest edition
        </Typography>
        <Typography
          className="featured-title"
          component="h2"
          sx={{
            mt: 1,
            fontFamily: serif,
            fontSize: { xs: "3rem", md: "4.25rem" },
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            transition: "color 0.2s ease"
          }}>
          Edition {edition.number}
        </Typography>
        <Meta edition={edition} sx={{ mt: 2 }} />
        <Typography
          sx={{
            mt: 2.5,
            fontFamily: serif,
            fontSize: { xs: "1.15rem", md: "1.35rem" },
            lineHeight: 1.5,
            color: "rgba(15,26,22,0.85)"
          }}>
          {edition.summary.excerpt}
        </Typography>
        {edition.summary.topics.length > 0 && (
          <Typography sx={{ mt: 2.5, fontSize: "0.95rem", color: muted }}>
            <Box component="span" sx={{ fontWeight: 600, color: ink }}>
              In this edition:
            </Box>{" "}
            {edition.summary.topics.join(" · ")}
          </Typography>
        )}
      </Box>

      <Box sx={{ order: { xs: 1, md: 2 } }}>
        {edition.cover ? (
          <Cover
            cover={edition.cover}
            sx={{ aspectRatio: "3 / 2", borderRadius: 3 }}
          />
        ) : (
          <Box
            aria-hidden="true"
            sx={{
              aspectRatio: "3 / 2",
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              background: `radial-gradient(90% 90% at 30% 20%, #2a8a6c, ${accent} 45%, #0b3a2c)`,
              color: "rgba(255,255,255,0.92)",
              fontFamily: serif,
              fontSize: "9rem",
              lineHeight: 1
            }}>
            {edition.number}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function EditionRow({ edition }) {
  return (
    <Box
      component={Link}
      to={`/newsletters/${edition.slug}`}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "56px 1fr",
          sm: edition.cover ? "84px 1fr 168px" : "84px 1fr"
        },
        gap: { xs: 2, sm: 3 },
        alignItems: "start",
        py: { xs: 2.5, sm: 3 },
        px: { xs: 1, sm: 2 },
        mx: { xs: -1, sm: -2 },
        borderRadius: 2,
        color: ink,
        textDecoration: "none",
        transition: "background-color 0.2s ease",
        "& .edition-no": { transition: "color 0.2s ease" },
        "& .edition-arrow": {
          transition: "opacity 0.2s ease, transform 0.2s ease",
          opacity: 0,
          transform: "translateX(-4px)"
        },
        "&:hover, &:focus-visible": {
          bgcolor: "#f3f6f5",
          "& .edition-no": { color: accent },
          "& .edition-arrow": { opacity: 1, transform: "none" },
          "& img": { transform: "scale(1.04)" }
        },
        "&:focus-visible": { outline: `2px solid ${accent}` }
      }}>
      <Box className="edition-no" sx={{ textAlign: "right" }}>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "inherit",
            opacity: 0.6
          }}>
          No.
        </Typography>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontFamily: serif,
            fontSize: { xs: "2.25rem", sm: "3rem" },
            fontWeight: 500,
            lineHeight: 1,
            color: "inherit"
          }}>
          {edition.number}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Meta edition={edition} />
          <ArrowForwardRoundedIcon
            className="edition-arrow"
            sx={{ fontSize: 18, color: accent }}
          />
        </Box>
        <Typography
          component="h3"
          sx={{
            mt: 0.75,
            fontSize: { xs: "1rem", sm: "1.08rem" },
            lineHeight: 1.55,
            color: "rgba(15,26,22,0.88)",
            display: "-webkit-box",
            WebkitLineClamp: { xs: 3, sm: 2 },
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
          {edition.summary.excerpt}
        </Typography>
        {edition.summary.topics.length > 0 && (
          <Box
            component="ul"
            aria-label="Topics"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              mt: 1.5,
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75
            }}>
            {edition.summary.topics.map(topic => (
              <Box
                component="li"
                key={topic}
                sx={{
                  px: 1.25,
                  py: 0.25,
                  borderRadius: "999px",
                  border: `1px solid ${faint}`,
                  fontSize: "0.78rem",
                  color: muted,
                  whiteSpace: "nowrap"
                }}>
                {topic}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {edition.cover && (
        <Cover
          cover={edition.cover}
          sx={{
            display: { xs: "none", sm: "block" },
            aspectRatio: "3 / 2",
            borderRadius: 1.5
          }}
        />
      )}
    </Box>
  );
}

function SearchField({ value, onChange }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        boxSizing: "border-box",
        width: { xs: 1, md: 320 },
        pl: 2,
        pr: 0.5,
        py: 0.5,
        borderRadius: "999px",
        border: `1px solid ${faint}`,
        bgcolor: "#fff",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:focus-within": {
          borderColor: accent,
          boxShadow: `0 0 0 3px rgba(22,101,79,0.15)`
        }
      }}>
      <SearchRoundedIcon sx={{ color: muted, fontSize: 20 }} />
      <InputBase
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="Search editions, topics, months"
        inputProps={{ "aria-label": "Search newsletters", type: "search" }}
        sx={{
          flex: 1,
          fontSize: "0.95rem",
          "& input::-webkit-search-cancel-button": { display: "none" }
        }}
      />
      <IconButton
        size="small"
        aria-label="Clear search"
        onClick={() => onChange("")}
        sx={{ visibility: value ? "visible" : "hidden" }}>
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

/**
 * The newsletter archive: a masthead, the latest edition as the lead story and
 * every edition by year, searchable by number, date, excerpt and topic.
 */
export default function NewsletterArchive() {
  const [query, setQuery] = useState("");
  const searching = query.trim() !== "";

  // [year, editions] pairs, latest year first; without a search the latest
  // edition is featured above, so it is left out here
  const years = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const listed = terms.length
      ? editions.filter(edition => {
          const text = searchText(edition);
          return terms.every(term => text.includes(term));
        })
      : editions.slice(1);
    const byYear = new Map();
    listed.forEach(edition => {
      const year = yearOf(edition);
      byYear.set(year, [...(byYear.get(year) ?? []), edition]);
    });
    return [...byYear].sort(([a], [b]) => b - a);
  }, [query]);
  const resultCount = years.reduce((count, [, list]) => count + list.length, 0);

  const jumpTo = year => event => {
    event.preventDefault();
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    document
      .getElementById(`editions-${year}`)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <Box
      sx={{
        maxWidth: 1120,
        mx: "auto",
        px: { xs: 2.5, sm: 4 },
        pt: { xs: 3, md: 5 },
        pb: { xs: 6, md: 10 },
        color: ink
      }}>
      <Box
        component="header"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "flex-end" },
          justifyContent: "space-between",
          gap: 3,
          pb: 3,
          borderBottom: `3px double ${ink}`
        }}>
        <Box>
          <Typography
            component="h1"
            sx={{
              fontFamily: serif,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.02em"
            }}>
            Turing Hut Newsletter
          </Typography>
          <Typography
            sx={{ mt: 1.5, maxWidth: 560, fontSize: "1.02rem", color: muted }}>
            Opportunities, contest recaps, reading picks and a problem to solve,
            from the programming club of VNR VJIET.
          </Typography>
          <Typography
            sx={{ mt: 1, fontSize: "0.85rem", fontWeight: 600, color: ink }}>
            {editions.length} editions
          </Typography>
        </Box>
        <SearchField value={query} onChange={setQuery} />
      </Box>

      {!searching && <FeaturedEdition edition={latest} />}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "140px 1fr" },
          gap: { md: 6 },
          borderTop: searching ? "none" : `1px solid ${faint}`,
          pt: { xs: 3, md: 5 }
        }}>
        <Box
          component="nav"
          aria-label="Editions by year"
          sx={{
            display: { xs: "none", md: "block" },
            position: "sticky",
            top: 110,
            alignSelf: "start"
          }}>
          <Typography
            component="p"
            sx={{
              mb: 1.5,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: muted
            }}>
            {searching ? "Results" : "Archive"}
          </Typography>
          {years.map(([year, list]) => (
            <Box
              key={year}
              component="a"
              href={`#editions-${year}`}
              onClick={jumpTo(year)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 0.75,
                color: ink,
                textDecoration: "none",
                fontFamily: serif,
                fontSize: "1.25rem",
                "&:hover": { color: accent }
              }}>
              {year}
              <Box
                component="span"
                sx={{
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  color: muted
                }}>
                {list.length}
              </Box>
            </Box>
          ))}
        </Box>

        <Box aria-live="polite">
          {searching && (
            <Typography sx={{ mb: 2, fontSize: "0.95rem", color: muted }}>
              {resultCount === 0
                ? `No editions match “${query.trim()}”.`
                : `${resultCount} ${resultCount === 1 ? "edition matches" : "editions match"} “${query.trim()}”`}
            </Typography>
          )}
          {years.map(([year, list]) => (
            <Box
              component="section"
              key={year}
              id={`editions-${year}`}
              aria-labelledby={`editions-${year}-heading`}
              sx={{
                scrollMarginTop: "110px",
                "& + &": { mt: { xs: 4, md: 6 } }
              }}>
              <Typography
                id={`editions-${year}-heading`}
                component="h2"
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 1.5,
                  pb: 1,
                  mb: 1,
                  borderBottom: `1px solid ${faint}`,
                  fontFamily: serif,
                  fontSize: { xs: "1.75rem", md: "2rem" },
                  fontWeight: 500
                }}>
                {year}
                <Box
                  component="span"
                  sx={{
                    fontFamily: "inherit",
                    fontSize: "0.95rem",
                    color: muted
                  }}>
                  {list.length} {list.length === 1 ? "edition" : "editions"}
                </Box>
              </Typography>
              {list.map(edition => (
                <EditionRow key={edition.slug} edition={edition} />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
