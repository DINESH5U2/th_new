import { Box, Typography } from "@mui/material";
import { stats } from "../../data/home";
import { faint, ink, muted } from "../../utils/designTokens";
import NumberTicker from "../NumberTicker";

/** The club in a few numbers, counting up as they come into view. */
export default function StatsBand() {
  return (
    <Box
      component="section"
      aria-label="Turing Hut in numbers"
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2.5, sm: 4, md: 6 },
        py: { xs: 6, md: 8 }
      }}>
      <Box
        component="dl"
        sx={{
          m: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${stats.length}, 1fr)`
        }}>
        {stats.map(({ label, value, suffix }, index) => (
          <Box
            key={label}
            sx={{
              display: "flex",
              flexDirection: "column-reverse",
              justifyContent: "flex-end",
              gap: 1,
              px: { xs: 1.5, sm: 3, md: 4 },
              pl: index ? undefined : 0,
              borderLeft: index ? `1px solid ${faint}` : "none"
            }}>
            <Typography
              component="dt"
              sx={{
                fontSize: { xs: "0.82rem", sm: "0.95rem" },
                lineHeight: 1.4,
                color: muted
              }}>
              {label}
            </Typography>
            <Typography
              component="dd"
              sx={{
                m: 0,
                fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: ink
              }}>
              <NumberTicker value={value} />
              {suffix}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
