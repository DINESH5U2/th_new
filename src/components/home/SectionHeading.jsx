import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { accent, ink, muted } from "../../utils/designTokens";
import Link from "../Link";

/** A kicker, a title and an optional link to the full page, in one row. */
export default function SectionHeading({ id, kicker, title, intro, link }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "flex-end" },
        justifyContent: "space-between",
        gap: 2,
        mb: { xs: 4, md: 5 }
      }}>
      <Box sx={{ maxWidth: 640 }}>
        <Typography
          component="p"
          sx={{
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: accent
          }}>
          {kicker}
        </Typography>
        <Typography
          id={id}
          component="h2"
          sx={{
            mt: 1,
            fontSize: { xs: "2rem", md: "2.75rem" },
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: ink
          }}>
          {title}
        </Typography>
        {intro && (
          <Typography
            sx={{
              mt: 1.5,
              fontSize: "1.05rem",
              lineHeight: 1.6,
              color: muted
            }}>
            {intro}
          </Typography>
        )}
      </Box>
      {link && (
        <Box
          component={Link}
          to={link.to}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            flexShrink: 0,
            fontWeight: 600,
            color: accent,
            textDecoration: "none",
            "& svg": { fontSize: 20, transition: "transform 0.2s ease" },
            "&:hover svg": { transform: "translateX(3px)" }
          }}>
          {link.label}
          <ArrowForwardRoundedIcon />
        </Box>
      )}
    </Box>
  );
}
