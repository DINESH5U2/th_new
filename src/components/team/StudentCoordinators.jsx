import { Box, Typography } from "@mui/material";
import jsondata from "../../assets/team_data.json";
import { getTeamImage, hasTeamImage, teamYears } from "../../data/teamImages";
import { accent, faint, ink, muted } from "../../utils/designTokens";
import StudentCard from "./StudentCard";

// Leadership roles come first, as one group of larger cards
const LEADERSHIP = /\b(president|lead|head|chief|secretary|advisor)\b/i;
// Then the teams, in the order the club tends to list them
const TEAM_ORDER = [
  /problem|teach/i,
  /develop/i,
  /design/i,
  /document|pr\b|social|media|content/i,
  /mentor/i,
  /coordinator/i
];

const rankOf = designation => {
  const index = TEAM_ORDER.findIndex(pattern => pattern.test(designation));
  return index === -1 ? TEAM_ORDER.length : index;
};

// "Mentor" -> "Mentors", "Student Coordinator" -> "Student Coordinators"
const pluralize = label => (/(or|er)$/i.test(label) ? `${label}s` : label);

/** A year's members as [{ title, featured, members }], leadership first. */
function groupsOf(members) {
  const leaders = members.filter(m => LEADERSHIP.test(m.designation));
  const byRole = new Map();
  members
    .filter(m => !LEADERSHIP.test(m.designation))
    .forEach(m =>
      byRole.set(m.designation, [...(byRole.get(m.designation) ?? []), m])
    );

  const teams = [...byRole]
    .sort(([a], [b]) => rankOf(a) - rankOf(b))
    .map(([designation, list]) => ({
      title: pluralize(designation),
      featured: false,
      members: list
    }));

  if (leaders.length === 0) return teams;
  const allLeads = leaders.every(m => /^lead$/i.test(m.designation));
  return [
    {
      title: allLeads ? "Leads" : "Leadership",
      featured: true,
      members: leaders
    },
    ...teams
  ];
}

// "2026-2027" -> "2026–27"
const shortYear = year => `${year.slice(0, 4)}–${year.slice(-2)}`;

function YearPicker({ year, onChange }) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: { xs: 70, md: 84 },
        zIndex: 5,
        mx: { xs: -2.5, sm: 0 },
        px: { xs: 2.5, sm: 0 },
        py: 1.5,
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0.92) 70%, rgba(255,255,255,0))",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)"
      }}>
      <Box
        role="group"
        aria-label="Choose a year"
        sx={{
          display: "flex",
          gap: 1,
          // a swipeable row on phones; every year in view on wider screens
          flexWrap: { xs: "nowrap", md: "wrap" },
          overflowX: { xs: "auto", md: "visible" },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          py: 0.5,
          px: 0.25
        }}>
        {teamYears.map(option => {
          const selected = option === year;
          return (
            <Box
              key={option}
              component="button"
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              sx={{
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.75,
                py: 0.9,
                borderRadius: "999px",
                border: `1px solid ${selected ? accent : faint}`,
                bgcolor: selected ? accent : "#fff",
                color: selected ? "#fff" : ink,
                font: "inherit",
                fontSize: "0.88rem",
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                cursor: "pointer",
                boxShadow: selected
                  ? "0 8px 20px -8px rgba(22,101,79,0.6)"
                  : "none",
                transition:
                  "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover": selected
                  ? {}
                  : { borderColor: "rgba(22,101,79,0.45)", bgcolor: "#f3f6f5" },
                "&:focus-visible": {
                  outline: `2px solid ${accent}`,
                  outlineOffset: 2
                }
              }}>
              {shortYear(option)}
              <Box
                component="span"
                sx={{
                  minWidth: 22,
                  px: 0.6,
                  borderRadius: "999px",
                  fontSize: "0.72rem",
                  lineHeight: "20px",
                  textAlign: "center",
                  bgcolor: selected ? "rgba(255,255,255,0.2)" : "#eef2f0",
                  color: selected ? "#fff" : muted
                }}>
                {jsondata.team[option].length}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/**
 * The student coordinators of a year: a year picker, then the members by
 * role, leads first as larger cards.
 */
export default function StudentCoordinators({ year, onYearChange }) {
  const members = jsondata.team[year];
  const groups = groupsOf(members);
  const teamCount = groups.filter(group => !group.featured).length;
  const current = year === teamYears[0];

  return (
    <Box
      component="section"
      aria-labelledby="students-title"
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2.5, sm: 4, md: 6 },
        mt: { xs: 6, md: 10 },
        mb: { xs: 6, md: 10 },
        "@keyframes student-in": {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "none" }
        },
        "@keyframes student-shimmer": { to: { backgroundPosition: "-300% 0" } }
      }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-end" },
          justifyContent: "space-between",
          gap: 2
        }}>
        <Box>
          <Typography
            component="p"
            sx={{
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: accent
            }}>
            Student coordinators
          </Typography>
          <Typography
            id="students-title"
            component="h2"
            sx={{
              mt: 1,
              fontSize: { xs: "2rem", md: "2.75rem" },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: ink
            }}>
            The {shortYear(year)} team
          </Typography>
          <Typography
            aria-live="polite"
            sx={{ mt: 1, fontSize: "1.02rem", color: muted }}>
            {members.length} {members.length === 1 ? "student" : "students"}
            {current ? " running the club" : " ran the club"}
            {teamCount > 1 &&
              ` across ${teamCount} ${teamCount === 1 ? "team" : "teams"}`}
            .
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <YearPicker year={year} onChange={onYearChange} />
      </Box>

      {/* keyed by year, so a new year's cards rise in again */}
      <Box key={year} sx={{ mt: { xs: 2, md: 3 } }}>
        {groups.map(group => (
          <Box
            component="section"
            key={group.title}
            aria-label={group.title}
            sx={{ "& + &": { mt: { xs: 5, md: 6 } } }}>
            <Typography
              component="h3"
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 1.25,
                pb: 1.25,
                mb: 2.5,
                borderBottom: `1px solid ${faint}`,
                fontSize: { xs: "1.15rem", md: "1.3rem" },
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: ink
              }}>
              {group.title}
              <Box
                component="span"
                sx={{ fontSize: "0.9rem", fontWeight: 500, color: muted }}>
                {group.members.length}
              </Box>
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: group.featured
                  ? {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: "repeat(auto-fill, minmax(240px, 300px))"
                    }
                  : {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: "repeat(auto-fill, minmax(200px, 1fr))"
                    },
                gap: { xs: 1.5, sm: 2.5 }
              }}>
              {group.members.map((member, index) => (
                <StudentCard
                  key={`${member.name}-${member.image}`}
                  member={member}
                  img={getTeamImage(member.image)}
                  hasImg={hasTeamImage(member.image)}
                  featured={group.featured}
                  index={index}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
