import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box
} from "@mui/material";
import { useState } from "react";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { contactLinks, faqs } from "../../data/turingCupFaqs";
import TuringCupHeading from "./TuringCupHeading";

export default function Faqs() {
  const [expanded, setExpanded] = useState(-1);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : -1);
  };

  return (
    <>
      <Grid container sx={{ my: 3, p: 3, w: 1, bgcolor: "#101820FF" }}>
        <Grid item md={2}></Grid>
        <Grid item xs={12} md={8} sx={{ my: "auto" }}>
          <TuringCupHeading>FAQs</TuringCupHeading>
          {faqs.map((item, ind) => (
            <Accordion
              disableGutters
              expanded={expanded === ind}
              onChange={handleChange(ind)}
              key={ind}
              sx={{ bgcolor: "#101820FF" }}>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: "#F2AA4CFF" }} />}
                aria-label="Expand"
                sx={ind !== 0 ? { borderTop: "1px solid #F2AA4CFF" } : null}>
                <Typography
                  variant="body1"
                  sx={{ color: "#F2AA4CFF", fontFamily: "'Gruppo', cursive" }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontFamily: "'Gruppo', cursive" }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
      <Typography
        variant="h6"
        sx={{
          pb: 2,
          textAlign: "center",
          color: "#F2AA4CFF",
          marginTop: "50px",
          fontFamily: "'Gruppo', cursive"
        }}>
        For further queries, feel free to reach out to us via Email, WhatsApp or
        Phone <br />
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          {contactLinks.map(({ href, target, hoverColor, Icon }) => (
            <Button
              key={href}
              href={href}
              target={target}
              sx={{
                color: "#F2AA4CFF",
                transition: "0.3s",
                "&:hover": { color: hoverColor }
              }}>
              <Icon sx={{ fontSize: 40 }} />
            </Button>
          ))}
        </Box>
      </Typography>
    </>
  );
}
