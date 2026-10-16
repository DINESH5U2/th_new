import { Box, Typography, Divider, Container, Tabs, Tab } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import timelineDataFile from "../lib/icpc-timeline-data.json";
import IcpcSeason from "./IcpcSeason";

// Newest academic year first, whatever order the data file is in
const icpcTimelineData = [...timelineDataFile.timeline].sort((a, b) =>
  b.year.localeCompare(a.year)
);

// "2025-2026" -> "2025–26" for the year picker
const shortYear = year => {
  const [start, end] = year.split("-");
  return end ? `${start}–${end.slice(-2)}` : year;
};

const yearTabSx = {
  minHeight: 0,
  minWidth: 0,
  px: { xs: 2, md: 2.5 },
  py: 1,
  mx: 0.5,
  borderRadius: "999px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.92rem",
  letterSpacing: "-0.005em",
  fontVariantNumeric: "tabular-nums",
  color: "text.secondary",
  border: "1px solid",
  borderColor: "rgba(0, 0, 0, 0.08)",
  bgcolor: "background.paper",
  transition:
    "background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
  "&:hover": { borderColor: "primary.main", color: "primary.main" },
  "&.Mui-selected": {
    color: "primary.contrastText",
    bgcolor: "primary.main",
    borderColor: "primary.main",
    boxShadow: "0 6px 16px -6px rgba(22, 101, 79, 0.55)"
  },
  "&.Mui-focusVisible": {
    outline: "2px solid",
    outlineColor: "primary.main",
    outlineOffset: 2
  }
};

export default function ICPC() {
  const [searchParams, setSearchParams] = useSearchParams();
  // The year lives in the URL (?year=2023-2024) so a year can be shared
  const selected =
    icpcTimelineData.find(item => item.year === searchParams.get("year")) ??
    icpcTimelineData[0];

  const selectYear = (_, year) => {
    const next = new URLSearchParams(searchParams);
    if (year === icpcTimelineData[0].year) next.delete("year");
    else next.set("year", year);
    setSearchParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            textAlign: "center"
          }}>
          <Typography
            variant="h4"
            color="secondary"
            fontWeight={"bold"}
            sx={{ display: "inline", textAlign: "center", mb: 4 }}>
            About &nbsp;
          </Typography>
          <Typography
            variant="h4"
            color="primary"
            fontWeight={"bold"}
            sx={{ display: "inline", textAlign: "center", mb: 4 }}>
            ICPC
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body1"
            color="text.primary"
            sx={{ mb: 2, lineHeight: 1.7, textAlign: "justify" }}>
            The International Collegiate Programming Contest (ICPC) is the
            world’s oldest and most prestigious programming competition,
            representing the ultimate stage for students passionate about coding
            and problem-solving. Often referred to as the Olympics of
            Competitive Programming, ICPC fosters creativity, teamwork, and
            resilience—skills that have a lasting impact on both everyday life
            and professional careers.
          </Typography>

          <Typography
            variant="body1"
            color="text.primary"
            sx={{ mb: 4, lineHeight: 1.7, textAlign: "justify" }}>
            Each year, only a select number of teams qualify to compete at the
            regional level, which is conducted nationally. In this context,
            Turing Hut takes pride in consistently securing qualification for
            the regionals every year since 2017.
          </Typography>

          <Typography
            variant="body1"
            color="text.primary"
            sx={{ mb: 4, lineHeight: 1.7, textAlign: "justify" }}>
            With the establishment of Turing Hut in 2017, the competitive
            programming culture at VNRVJIET began to grow rapidly, and in the
            very same year, two teams from VNRVJIET qualified for the ICPC
            Regionals.
          </Typography>

          <Typography
            variant="body1"
            color="text.primary"
            sx={{ mb: 4, lineHeight: 1.7, textAlign: "justify" }}>
            The best performance by a VNRVJIET team at the ICPC Regionals was an
            <strong> All India Rank 42 </strong> achieved in 2023 by team
            <strong> Wrong Angled Triangle </strong>
            at the <strong>ICPC Asia West Amritapuri Regionals 2023 </strong>,
            narrowly missing qualification for the Asia West Continent Finals by
            just four ranks, with the last qualifying team placed at Rank 38.
          </Typography>

          <Typography
            variant="body1"
            color="text.primary"
            sx={{ mb: 4, lineHeight: 1.7, textAlign: "justify" }}>
            The best rank ever achieved by a VNRVJIET team in the ICPC Prelims
            was an <strong>All India Rank 24</strong> among nearly 3,000 teams,
            secured by team <strong>Right Angled Triangle</strong> in 2025. The
            team further achieved an
            <strong> All India Rank 62</strong> at the{" "}
            <strong>ICPC Asia West Amritapuri Regionals 2025</strong>, narrowly
            missing qualification for the Asia West Continentals, where the
            final qualifying position stood at Rank 49.
          </Typography>
        </Box>

        <Divider sx={{ bgcolor: "primary.main", height: 2, mb: 6 }} />
      </Box>

      <Typography
        variant="h4"
        color="primary"
        fontWeight="bold"
        sx={{ textAlign: "center", mb: 3 }}>
        ICPC Journey Timeline
      </Typography>

      {/* Year picker: one year's teams at a time, newest by default */}
      <Tabs
        value={selected.year}
        onChange={selectYear}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="ICPC year"
        sx={{
          maxWidth: "1000px",
          mx: "auto",
          mb: { xs: 3, md: 5 },
          minHeight: 0,
          // Centred when the pills all fit; scrolls from the start when not
          "& .MuiTabs-flexContainer": {
            // Room for the selected pill's shadow inside the clipped scroller
            pt: 1,
            pb: 2.25,
            width: "max-content",
            mx: "auto"
          },
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTabs-scrollButtons.Mui-disabled": { opacity: 0.3 }
        }}>
        {icpcTimelineData.map(({ year, entries }) => (
          <Tab
            key={year}
            value={year}
            id={`icpc-tab-${year}`}
            aria-controls="icpc-year-panel"
            label={shortYear(year)}
            title={`${year} · ${entries.length} ${entries.length === 1 ? "team" : "teams"}`}
            disableRipple
            sx={yearTabSx}
          />
        ))}
      </Tabs>

      <Box
        key={selected.year}
        id="icpc-year-panel"
        role="tabpanel"
        aria-labelledby={`icpc-tab-${selected.year}`}
        sx={{
          maxWidth: "1000px",
          mx: "auto",
          animation: "icpc-year-in 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
          "@keyframes icpc-year-in": {
            from: { opacity: 0, transform: "translateY(12px)" },
            to: { opacity: 1, transform: "none" }
          },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" }
        }}>
        <IcpcSeason year={selected.year} entries={selected.entries} />
      </Box>
    </Container>
  );
}
