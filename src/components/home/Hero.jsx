import { Box, Typography } from "@mui/material";
import "@fontsource-variable/newsreader/opsz-italic.css";
import logo from "../../assets/images/image.svg";
import { accent, ink, muted, serif } from "../../utils/designTokens";

/** Opening section: the club's mark beside what it stands for. */
export default function Hero() {
  return (
    <Box
      component="section"
      aria-labelledby="home-title"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: { xs: "20px", md: "32px" },
        mt: { xs: 1, md: 2 },
        // dotted grid fading out from the top left, with a soft brand glow
        background: `radial-gradient(60% 70% at 85% 30%, rgba(22,101,79,0.12), rgba(22,101,79,0) 70%),
          radial-gradient(rgba(15,26,22,0.13) 1px, transparent 1.2px) 0 0 / 22px 22px,
          #fbfcfb`,
        "@keyframes logo-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(251,252,251,0) 55%, #fbfcfb 100%)"
        }
      }}>
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2.5, sm: 4, md: 6 },
          py: { xs: 6, md: 11 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "auto minmax(0, 680px)" },
          justifyContent: "center",
          alignItems: "center",
          columnGap: { md: 7, lg: 9 },
          rowGap: 4
        }}>
        <Box
          component="img"
          src={logo}
          alt="Turing Hut"
          sx={{
            display: "block",
            width: { xs: 120, sm: 160, md: 260, lg: 300 },
            height: "auto",
            aspectRatio: "1 / 1",
            filter: "drop-shadow(0 24px 40px rgba(15,26,22,0.28))",
            "@media (prefers-reduced-motion: no-preference)": {
              animation: "logo-float 7s ease-in-out infinite"
            }
          }}
        />
        <Box sx={{ maxWidth: 680 }}>
          <Typography
            id="home-title"
            component="h1"
            sx={{
              fontSize: { xs: "2.9rem", sm: "4rem", lg: "4.75rem" },
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.035em",
              color: ink
            }}>
            <Box component="span" sx={{ display: "block" }}>
              Programming
            </Box>{" "}
            as a{" "}
            <Box
              component="span"
              sx={{
                fontFamily: serif,
                fontStyle: "italic",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: accent
              }}>
              sport.
            </Box>
          </Typography>
          <Typography
            sx={{
              mt: 3,
              maxWidth: 580,
              fontSize: { xs: "1.05rem", md: "1.15rem" },
              lineHeight: 1.65,
              color: muted
            }}>
            We orient freshers to the world of computer science, run contests
            and workshops all year, and point students to the opportunities that
            grow their skills.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
