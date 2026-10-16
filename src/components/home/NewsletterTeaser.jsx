import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import "@fontsource-variable/newsreader/opsz.css";
import { latestEdition } from "../../data/home";
import { accent, ink, muted, serif } from "../../utils/designTokens";
import Link from "../Link";
import Picture from "../Picture";

/** The latest newsletter edition, as a story worth opening. */
export default function NewsletterTeaser() {
  const edition = latestEdition;

  return (
    <Box
      component="section"
      aria-labelledby="home-newsletter"
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2.5, sm: 4, md: 6 },
        py: { xs: 6, md: 10 }
      }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1.1fr" },
          gap: { xs: 4, md: 7 },
          alignItems: "center",
          p: { xs: 3, sm: 4, md: 6 },
          borderRadius: { xs: "24px", md: "32px" },
          bgcolor: "#f3f6f5"
        }}>
        {edition.cover && (
          <Box
            component={Link}
            to={`/newsletters/${edition.slug}`}
            tabIndex={-1}
            aria-hidden="true"
            sx={{
              display: "block",
              aspectRatio: "3 / 2",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 30px 60px -30px rgba(15,26,22,0.45)",
              "& img": {
                transition: "transform 0.8s cubic-bezier(.2,.7,.2,1)"
              },
              "&:hover img": { transform: "scale(1.04)" }
            }}>
            <Picture image={edition.cover} sx={{ height: 1 }} />
          </Box>
        )}
        <Box sx={{ gridColumn: edition.cover ? "auto" : "1 / -1" }}>
          <Typography
            component="p"
            sx={{
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: accent
            }}>
            From the newsletter
          </Typography>
          <Typography
            id="home-newsletter"
            component="h2"
            sx={{
              mt: 1,
              fontFamily: serif,
              fontSize: { xs: "2.5rem", md: "3.25rem" },
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: ink
            }}>
            Edition {edition.number}
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: muted
            }}>
            {new Date(edition.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}{" "}
            · {edition.summary.readingMinutes} min read
          </Typography>
          <Typography
            sx={{
              mt: 2.5,
              fontFamily: serif,
              fontSize: { xs: "1.15rem", md: "1.3rem" },
              lineHeight: 1.5,
              color: "rgba(15,26,22,0.85)"
            }}>
            {edition.summary.excerpt}
          </Typography>
          <Box
            sx={{
              mt: 3.5,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: { xs: 2, sm: 3 }
            }}>
            <Box
              component={Link}
              to={`/newsletters/${edition.slug}`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2.5,
                py: 1.25,
                borderRadius: "999px",
                bgcolor: accent,
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
                "& svg": { fontSize: 20, transition: "transform 0.2s ease" },
                "&:hover svg": { transform: "translateX(4px)" }
              }}>
              Edition {edition.number}
              <ArrowForwardRoundedIcon />
            </Box>
            <Box
              component={Link}
              to="/newsletters"
              sx={{
                fontWeight: 600,
                color: ink,
                textDecorationColor: "rgba(15,26,22,0.3)",
                textUnderlineOffset: "4px",
                "&:hover": { color: accent, textDecorationColor: accent }
              }}>
              Read all editions
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
