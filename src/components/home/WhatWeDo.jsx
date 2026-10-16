import { Box, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import { icpc, turingCupRegistrations, latestTuringCup } from "../../data/home";
import icpcImages from "../../data/icpcImages";
import winnersImages from "../../data/winnersImages";
import { accent, faint, gold, ink, muted } from "../../utils/designTokens";
import Link from "../Link";
import Picture from "../Picture";
import SectionHeading from "./SectionHeading";

const number = value => value.toLocaleString("en-US");

const activities = [
  {
    title: "Peer learning",
    Icon: Diversity3RoundedIcon,
    body: "First and second years learn advanced data structures and algorithms from their seniors.",
    link: { to: "/team", label: "Meet the mentors" }
  },
  {
    title: "Coding competitions",
    Icon: CodeRoundedIcon,
    body: "Showcase your skills and compete with the best in college at the contests we hold every year.",
    link: { to: "/events", label: "See the contests" }
  },
  {
    title: "Speaker sessions",
    Icon: ForumRoundedIcon,
    body: "Stay in the know about opportunities in tech and beyond through our information sessions.",
    link: { to: "/events", label: "Browse sessions" }
  }
];

// Shared by every card: lift on hover, arrow nudges, visible keyboard focus
const cardLink = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: "24px",
  overflow: "hidden",
  textDecoration: "none",
  transition: "transform 0.3s cubic-bezier(.2,.7,.2,1), box-shadow 0.3s ease",
  "& .card-arrow": { transition: "transform 0.2s ease" },
  "& .card-photo img": {
    transition: "transform 0.8s cubic-bezier(.2,.7,.2,1)"
  },
  "&:hover, &:focus-visible": {
    transform: "translateY(-4px)",
    boxShadow: "0 30px 60px -30px rgba(15,26,22,0.45)",
    "& .card-arrow": { transform: "translateX(4px)" },
    "& .card-photo img": { transform: "scale(1.04)" }
  },
  "&:focus-visible": { outline: `3px solid ${accent}`, outlineOffset: 3 },
  "@media (prefers-reduced-motion: reduce)": {
    "&, & .card-arrow, & .card-photo img": { transition: "none" },
    "&:hover, &:focus-visible": { transform: "none" }
  }
};

function CardLinkLabel({ children, color }) {
  return (
    <Box
      component="span"
      sx={{
        mt: "auto",
        pt: 3,
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        fontWeight: 600,
        color
      }}>
      {children}
      <ArrowForwardRoundedIcon className="card-arrow" sx={{ fontSize: 20 }} />
    </Box>
  );
}

/** Teams registered per Turing Cup: one series, the latest year highlighted. */
function RegistrationsChart() {
  const max = Math.max(...turingCupRegistrations.map(({ teams }) => teams));
  const last = turingCupRegistrations.length - 1;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        id="tc-registrations"
        sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)" }}>
        Teams registered
      </Typography>
      <Box
        aria-hidden="true"
        sx={{
          mt: 1.5,
          display: "flex",
          alignItems: "flex-end",
          gap: 2.5,
          height: 112,
          borderBottom: "1px solid rgba(255,255,255,0.18)"
        }}>
        {turingCupRegistrations.map(({ year, teams, colleges }, index) => (
          <Box
            key={year}
            sx={{
              position: "relative",
              height: 1,
              width: 24,
              display: "flex",
              alignItems: "flex-end",
              "&:hover .bar-tip": {
                opacity: 1,
                transform: "translate(-50%, 0)"
              }
            }}>
            {index === last && (
              <Typography
                component="span"
                sx={{
                  position: "absolute",
                  left: "50%",
                  bottom: `calc(${(teams / max) * 100}% + 6px)`,
                  transform: "translateX(-50%)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#fff",
                  whiteSpace: "nowrap"
                }}>
                {number(teams)}
              </Typography>
            )}
            <Box
              sx={{
                width: 1,
                height: `${(teams / max) * 100}%`,
                borderRadius: "4px 4px 0 0",
                bgcolor: index === last ? gold : "#5E6B66"
              }}
            />
            <Box
              className="bar-tip"
              sx={{
                position: "absolute",
                zIndex: 2,
                left: "50%",
                bottom: "calc(100% + 8px)",
                transform: "translate(-50%, 4px)",
                opacity: 0,
                transition: "opacity 0.15s ease, transform 0.15s ease",
                pointerEvents: "none",
                px: 1.25,
                py: 0.75,
                borderRadius: 1.5,
                bgcolor: "#fff",
                color: ink,
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                whiteSpace: "nowrap",
                fontSize: "0.78rem",
                lineHeight: 1.4
              }}>
              <strong>{year}</strong>
              <br />
              {number(teams)} teams · {colleges} colleges
            </Box>
          </Box>
        ))}
      </Box>
      <Box aria-hidden="true" sx={{ mt: 0.75, display: "flex", gap: 2.5 }}>
        {turingCupRegistrations.map(({ year }) => (
          <Typography
            key={year}
            component="span"
            sx={{
              width: 24,
              textAlign: "center",
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.55)"
            }}>
            ’{String(year).slice(2)}
          </Typography>
        ))}
      </Box>
      <Box
        component="table"
        aria-labelledby="tc-registrations"
        sx={visuallyHidden}>
        <thead>
          <tr>
            <th>Year</th>
            <th>Teams</th>
            <th>Colleges</th>
          </tr>
        </thead>
        <tbody>
          {turingCupRegistrations.map(({ year, teams, colleges }) => (
            <tr key={year}>
              <td>{year}</td>
              <td>{teams}</td>
              <td>{colleges}</td>
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}

function TuringCupCard() {
  const photo = winnersImages[`tc_winners${latestTuringCup.year}`];

  return (
    <Box
      component={Link}
      to="/turingcup"
      sx={{
        ...cardLink,
        gridColumn: { md: "span 7" },
        minHeight: { md: 460 },
        p: { xs: 3, md: 4.5 },
        bgcolor: "#101820",
        color: "#fff"
      }}>
      {photo && (
        <>
          <Picture
            image={photo}
            sizes="(min-width: 900px) 700px, 100vw"
            sx={{ position: "absolute", inset: 0, opacity: 0.35 }}
            imgSx={{ filter: "grayscale(0.3)" }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(100deg, #101820 30%, rgba(16,24,32,0.75) 60%, rgba(16,24,32,0.35))"
            }}
          />
        </>
      )}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          maxWidth: 420
        }}>
        <Typography
          component="p"
          sx={{
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: gold
          }}>
          Flagship contest
        </Typography>
        <Typography
          component="h3"
          sx={{
            mt: 1,
            fontFamily: "'Gruppo', cursive",
            fontSize: { xs: "2.5rem", md: "3.25rem" },
            fontWeight: 700,
            lineHeight: 1,
            color: gold,
            textShadow: "0 0 24px rgba(242,170,76,0.35)"
          }}>
          Turing Cup
        </Typography>
        <Typography
          sx={{
            mt: 2,
            fontSize: "1.02rem",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.8)"
          }}>
          Our national-level coding contest. In {latestTuringCup.year},{" "}
          {number(latestTuringCup.teams)} teams from {latestTuringCup.colleges}{" "}
          colleges registered.
        </Typography>
        <RegistrationsChart />
        <CardLinkLabel color={gold}>Explore the Turing Cup</CardLinkLabel>
      </Box>
    </Box>
  );
}

function IcpcCard() {
  const photo = icpc.latestPhoto && icpcImages[icpc.latestPhoto.imagePath];

  return (
    <Box
      component={Link}
      to="/icpc"
      sx={{
        ...cardLink,
        gridColumn: { md: "span 5" },
        minHeight: { xs: 380, md: 460 },
        justifyContent: "flex-end",
        p: { xs: 3, md: 4 },
        bgcolor: ink,
        color: "#fff"
      }}>
      {photo && (
        <Box
          className="card-photo"
          sx={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <Box
            component="img"
            src={photo}
            alt=""
            loading="lazy"
            decoding="async"
            sx={{ width: 1, height: 1, objectFit: "cover" }}
          />
        </Box>
      )}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(15,26,22,0.95) 25%, rgba(15,26,22,0.2) 75%)"
        }}
      />
      <Box sx={{ position: "relative" }}>
        <Typography
          component="p"
          sx={{
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#7fd8b4"
          }}>
          ICPC
        </Typography>
        <Typography
          component="h3"
          sx={{
            mt: 1,
            fontSize: { xs: "1.75rem", md: "2rem" },
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em"
          }}>
          {icpc.consecutive
            ? `At the Asia Regionals, every season since ${icpc.firstYear}`
            : `At the Asia Regionals since ${icpc.firstYear}`}
        </Typography>
        <Box sx={{ mt: 2.5, display: "flex", gap: 4 }}>
          {[
            [`#${icpc.bestRank}`, "best All India Rank"],
            [icpc.seasons, "seasons of teams"]
          ].map(([value, label]) => (
            <Box key={label}>
              <Typography
                sx={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1 }}>
                {value}
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.7)"
                }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
        <CardLinkLabel color="#fff">See our ICPC journey</CardLinkLabel>
      </Box>
    </Box>
  );
}

function ActivityCard({ title, Icon, body, link }) {
  return (
    <Box
      component={Link}
      to={link.to}
      sx={{
        ...cardLink,
        gridColumn: { md: "span 4" },
        p: { xs: 3, md: 3.5 },
        bgcolor: "#fff",
        color: ink,
        border: `1px solid ${faint}`
      }}>
      <Box
        sx={{
          width: 52,
          height: 52,
          display: "grid",
          placeItems: "center",
          borderRadius: "16px",
          bgcolor: "rgba(22,101,79,0.08)",
          color: accent
        }}>
        <Icon sx={{ fontSize: 28 }} />
      </Box>
      <Typography
        component="h3"
        sx={{
          mt: 3,
          fontSize: "1.3rem",
          fontWeight: 700,
          letterSpacing: "-0.01em"
        }}>
        {title}
      </Typography>
      <Typography
        sx={{ mt: 1, fontSize: "1rem", lineHeight: 1.6, color: muted }}>
        {body}
      </Typography>
      <CardLinkLabel color={accent}>{link.label}</CardLinkLabel>
    </Box>
  );
}

/** What the club does, led by its two biggest stages. */
export default function WhatWeDo() {
  return (
    <Box
      component="section"
      aria-labelledby="what-we-do"
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2.5, sm: 4, md: 6 },
        py: { xs: 6, md: 10 }
      }}>
      <SectionHeading
        id="what-we-do"
        kicker="What we do"
        title="Learn from seniors. Compete nationally. Hear from people in tech."
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" },
          gap: { xs: 2, md: 3 }
        }}>
        <TuringCupCard />
        <IcpcCard />
        {activities.map(activity => (
          <ActivityCard key={activity.title} {...activity} />
        ))}
      </Box>
    </Box>
  );
}
