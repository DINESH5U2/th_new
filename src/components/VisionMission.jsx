import { Box, Typography } from "@mui/material";
import { hairline, ink, pageColumn } from "./aboutStyles";
import VisionFormation from "./VisionFormation";

export default function VisionMission() {
  return (
    <>
      <Box sx={pageColumn}>
        <Box
          component="header"
          sx={{
            pt: { xs: 4, md: 9 },
            pb: { xs: 5, md: 9 },
            borderBottom: `1px solid ${hairline}`
          }}>
          <Typography
            component="h1"
            sx={{
              color: ink,
              fontSize: { xs: "2rem", sm: "2.625rem", md: "3.25rem" },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              maxWidth: "18ch",
              textWrap: "balance"
            }}>
            We're on a mission to improve the programming{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Culture.
            </Box>
          </Typography>
          <Typography
            sx={{
              mt: { xs: 2.5, md: 3.5 },
              color: "secondary.main",
              fontSize: { xs: "1.0625rem", md: "1.25rem" },
              lineHeight: 1.6,
              maxWidth: "48ch"
            }}>
            Our mission is to unite people with motivated interest to foster a
            culture of learning in the community with regards to Computer
            Science.
          </Typography>
        </Box>
      </Box>
      <VisionFormation />
    </>
  );
}
