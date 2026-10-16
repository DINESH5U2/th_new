import { Typography, Box } from "@mui/material";
import faqs from "../data/faqs";
import HowItWorks from "./HowItWorks";
import { hairline, ink, pageColumn } from "./aboutStyles";

const themes = ["orange", "blue", "purple"];

export default function Faqs() {
  return (
    <Box component="section" sx={{ mt: { xs: 2, md: 4 } }}>
      <Box sx={pageColumn}>
        <Typography
          component="h2"
          sx={{
            pt: { xs: 4, md: 6 },
            borderTop: `1px solid ${hairline}`,
            color: ink,
            fontSize: { xs: "1.75rem", md: "2rem" },
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.02em"
          }}>
          FAQs
        </Typography>
      </Box>

      <HowItWorks
        steps={faqs.map(({ question, answer }, index) => ({
          title: question,
          description: answer,
          theme: themes[index % themes.length]
        }))}
      />
    </Box>
  );
}
