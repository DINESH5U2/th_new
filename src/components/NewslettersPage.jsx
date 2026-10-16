import { Box, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import "@fontsource-variable/newsreader/opsz.css";
import { editions } from "../utils/content";
import HeroImage from "./HeroImage";
import Link from "./Link";
import PostBody from "./PostBody";

const serif = '"Newsreader Variable", Georgia, "Times New Roman", serif';
const ink = "#0f1a16";
const muted = "rgba(15,26,22,0.62)";
const faint = "rgba(15,26,22,0.1)";
const accent = "#16654F";

const dateOptions = { year: "numeric", month: "long", day: "numeric" };

const kicker = {
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase"
};

function EditionLink({ edition, direction }) {
  const older = direction === "older";
  return (
    <Box
      component={Link}
      to={`/newsletters/${edition.slug}`}
      sx={{
        display: "block",
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        border: `1px solid ${faint}`,
        color: ink,
        textDecoration: "none",
        textAlign: older ? "left" : "right",
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        "& svg": { fontSize: 18, transition: "transform 0.2s ease" },
        "&:hover, &:focus-visible": {
          borderColor: accent,
          bgcolor: "#f3f6f5",
          "& svg": { transform: older ? "translateX(-3px)" : "translateX(3px)" }
        },
        "&:focus-visible": { outline: `2px solid ${accent}`, outlineOffset: 2 }
      }}>
      <Typography
        component="span"
        sx={{
          ...kicker,
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          color: muted,
          flexDirection: older ? "row" : "row-reverse"
        }}>
        {older ? <ArrowBackRoundedIcon /> : <ArrowForwardRoundedIcon />}
        {older ? "Previous edition" : "Next edition"}
      </Typography>
      <Typography
        sx={{
          mt: 0.75,
          fontFamily: serif,
          fontSize: "1.5rem",
          fontWeight: 500,
          lineHeight: 1.1
        }}>
        Edition {edition.number}
      </Typography>
      <Typography
        sx={{
          mt: 0.75,
          fontSize: "0.9rem",
          color: muted,
          display: { xs: "none", sm: "-webkit-box" },
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
        {edition.summary.excerpt}
      </Typography>
    </Box>
  );
}

/** One newsletter edition, laid out for reading. */
export default function NewslettersPage({ post }) {
  const index = editions.findIndex(edition => edition.slug === post.slug);
  const newer = editions[index - 1];
  const older = editions[index + 1];
  const { topics, readingMinutes } = post.summary;

  return (
    <Box
      component="article"
      sx={{
        maxWidth: 760,
        mx: "auto",
        px: { xs: 2.5, sm: 4 },
        pt: { xs: 3, md: 5 },
        pb: { xs: 6, md: 10 },
        color: ink
      }}>
      <Box
        component={Link}
        to="/newsletters"
        sx={{
          ...kicker,
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          color: accent,
          textDecoration: "none",
          "& svg": { fontSize: 18, transition: "transform 0.2s ease" },
          "&:hover svg": { transform: "translateX(-3px)" }
        }}>
        <ArrowBackRoundedIcon />
        All editions
      </Box>

      <Box
        component="header"
        sx={{ mt: 3, pb: 3, borderBottom: `3px double ${ink}` }}>
        <Typography component="p" sx={{ ...kicker, color: muted }}>
          The Turing Hut Newsletter
        </Typography>
        <Typography
          component="h1"
          sx={{
            mt: 1,
            fontFamily: serif,
            fontSize: { xs: "2.75rem", md: "3.75rem" },
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.02em"
          }}>
          Edition {post.slug}
        </Typography>
        <Typography sx={{ mt: 2, fontSize: "0.95rem", color: muted }}>
          {new Date(post.date).toLocaleDateString("en-US", dateOptions)} ·{" "}
          {readingMinutes} min read
        </Typography>
        {topics.length > 0 && (
          <Typography sx={{ mt: 1, fontSize: "0.95rem", color: muted }}>
            <Box component="span" sx={{ fontWeight: 600, color: ink }}>
              In this edition:
            </Box>{" "}
            {topics.join(" · ")}
          </Typography>
        )}
      </Box>

      {post.heroImage && (
        <Box sx={{ mt: 4, "& .image, & img": { borderRadius: 2 } }}>
          <HeroImage image={post.heroImage} alt={`Edition ${post.slug}`} />
        </Box>
      )}

      <Box
        sx={{
          mt: 4,
          "& p, & li": { fontSize: "1.05rem", lineHeight: 1.75 }
        }}>
        <PostBody body={post.body} images={post.images} />
      </Box>

      {(older || newer) && (
        <Box
          component="nav"
          aria-label="More editions"
          sx={{
            mt: { xs: 6, md: 8 },
            pt: 4,
            borderTop: `1px solid ${faint}`,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2
          }}>
          {older ? <EditionLink edition={older} direction="older" /> : <span />}
          {newer && <EditionLink edition={newer} direction="newer" />}
        </Box>
      )}
    </Box>
  );
}
