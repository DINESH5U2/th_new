import { useId } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";

// pin: [highlight, body, shade] for the push pin's plastic head
const THEMES = {
  orange: {
    bg: "#FFF7ED",
    text: "#F97316",
    border: "#FFEDD5",
    pin: ["#FED7AA", "#F97316", "#9A3412"]
  },
  blue: {
    bg: "#EFF6FF",
    text: "#2563EB",
    border: "#DBEAFE",
    pin: ["#BFDBFE", "#2563EB", "#1E3A8A"]
  },
  purple: {
    bg: "#FAF5FF",
    text: "#9333EA",
    border: "#F3E8FF",
    pin: ["#E9D5FF", "#9333EA", "#581C87"]
  }
};

// Where each note is pinned on desktop (cycled when there are more notes)
const DEFAULT_POSITIONS = [
  { top: 0, left: "15%", rotate: 8 },
  { top: 120, right: "15%", rotate: -8 },
  { top: 450, left: "15%", rotate: 8 },
  { top: 570, right: "10%", rotate: -8 },
  { top: 850, left: "15%", rotate: 8 }
];

// Board height on desktop by number of notes
const HEIGHTS = [0, 420, 500, 840, 960, 1220];

// Dashed connector segments between consecutive notes, in board pixels
const SEGMENTS = [
  "M 290 150 C 500 150, 550 270, 710 270",
  " C 850 270, 500 350, 290 450",
  " C 290 600, 550 720, 750 720",
  " C 950 720, 500 800, 290 850"
];

// One full dash (8 + 6) repeated, so the loop is seamless
const marchingAnts = keyframes`
  to { stroke-dashoffset: -140; }
`;

/**
 * A push pin seen head-on, as if driven into the board: only the domed
 * plastic head shows, lit from the top left, casting a soft shadow down and
 * to the right. `tilt` cancels the note's rotation so every pin shares the
 * same light direction.
 */
function Pin({ colors: [light, body, shade], tilt }) {
  const id = useId();

  return (
    <Box
      component="svg"
      viewBox="0 0 48 48"
      aria-hidden="true"
      sx={{
        display: "block",
        width: 40,
        height: 40,
        mx: "auto",
        mt: -0.5,
        mb: 2,
        overflow: "visible",
        transform: tilt
      }}>
      <defs>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <radialGradient id={`${id}-rim`} cx="0.4" cy="0.35" r="0.65">
          <stop offset="0" stopColor={body} />
          <stop offset="0.75" stopColor={body} />
          <stop offset="1" stopColor={shade} />
        </radialGradient>
        <radialGradient id={`${id}-dome`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor={light} />
          <stop offset="0.35" stopColor={body} />
          <stop offset="1" stopColor={shade} />
        </radialGradient>
      </defs>

      {/* Contact shadow on the paper, then the softer cast shadow */}
      <circle
        cx="26"
        cy="27"
        r="12"
        fill="rgba(0, 0, 0, 0.28)"
        filter={`url(#${id}-blur)`}
      />
      <ellipse
        cx="30"
        cy="31"
        rx="12"
        ry="11"
        fill="rgba(0, 0, 0, 0.12)"
        filter={`url(#${id}-blur)`}
      />

      {/* Flat rim, then the raised dome in the middle */}
      <circle cx="24" cy="24" r="12" fill={`url(#${id}-rim)`} />
      <circle
        cx="24"
        cy="24"
        r="12"
        fill="none"
        stroke={shade}
        strokeOpacity="0.45"
        strokeWidth="0.75"
      />
      <circle cx="24" cy="24" r="7.5" fill={shade} fillOpacity="0.35" />
      <circle cx="23.4" cy="23.4" r="7" fill={`url(#${id}-dome)`} />

      {/* Specular highlights */}
      <ellipse
        cx="20.6"
        cy="20"
        rx="2.6"
        ry="1.6"
        fill="#FFFFFF"
        fillOpacity="0.85"
        transform="rotate(-35 20.6 20)"
      />
      <path
        d="M 14.5 19 A 10.5 10.5 0 0 1 19 14.5"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.45"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Box>
  );
}

function Note({ number, title, description, theme, position }) {
  const colors = THEMES[theme] ?? THEMES.blue;
  const { rotate, ...place } = position;
  const mobileRotate = Math.sign(rotate) * 2;

  return (
    <Box
      component="article"
      sx={{
        position: { xs: "relative", md: "absolute" },
        ...Object.fromEntries(
          Object.entries(place).map(([side, value]) => [side, { md: value }])
        ),
        width: { xs: "100%", md: 280 },
        // A gentler tilt on small screens keeps the notes inside the viewport
        transform: {
          xs: `rotate(${mobileRotate}deg)`,
          md: `rotate(${rotate}deg)`
        },
        transition: "transform 0.3s ease",
        "&:hover": {
          zIndex: 30,
          transform: {
            xs: `rotate(${mobileRotate}deg) scale(1.03)`,
            md: `rotate(${rotate}deg) scale(1.05)`
          }
        }
      }}>
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          p: 1,
          borderRadius: "25px",
          border: "1px solid #F5F5F5",
          boxShadow: "0 10px 20px 0 #D3D3D3"
        }}>
        <Pin
          colors={colors.pin}
          tilt={{
            xs: `rotate(${-mobileRotate}deg)`,
            md: `rotate(${-rotate}deg)`
          }}
        />
        <Box
          sx={{
            bgcolor: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: "15px",
            p: "15px"
          }}>
          <Typography
            aria-hidden="true"
            sx={{
              color: colors.text,
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
              fontSize: "2.25rem",
              lineHeight: 1,
              mb: 2.5
            }}>
            {number}
          </Typography>
          <Typography
            component="h3"
            sx={{
              color: "#262626",
              fontSize: "1.375rem",
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              mb: 1.25
            }}>
            {title}
          </Typography>
          <Typography
            sx={{
              color: "#737373",
              fontSize: "0.875rem",
              lineHeight: 1.45,
              letterSpacing: "-0.01em"
            }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Numbered notes pinned to a ruled board, joined by an animated dashed line.
 * On desktop the notes are laid out at fixed positions; below md they stack.
 * `steps`: [{ title, description, theme: "orange" | "blue" | "purple" }]
 */
export default function HowItWorks({ steps, positions = DEFAULT_POSITIONS }) {
  const height = HEIGHTS[Math.min(steps.length, HEIGHTS.length - 1)];
  const path = SEGMENTS.slice(0, steps.length - 1).join("");

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "#FFFFFF",
        px: 4,
        pt: { xs: 5, md: 10 },
        pb: { xs: 8, md: 10 },
        overflow: "hidden"
      }}>
      {/* Ruled paper, fading out towards both sides */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          mt: "4px",
          pointerEvents: "none",
          opacity: 0.08,
          backgroundImage: "linear-gradient(#000 1px, transparent 1px)",
          backgroundSize: "100% 32px",
          maskImage:
            "linear-gradient(to right, transparent, #000 50%, transparent)"
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1000,
          mx: "auto",
          display: { xs: "flex", md: "block" },
          flexDirection: "column",
          gap: 4,
          height: { md: height }
        }}>
        {steps.length > 1 && (
          <Box
            component="svg"
            aria-hidden="true"
            viewBox={`0 0 1000 ${height}`}
            preserveAspectRatio="none"
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none"
            }}>
            <Box
              component="path"
              d={path}
              fill="none"
              stroke="#D4D4D4"
              strokeWidth="2"
              strokeDasharray="8 6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              sx={{
                animation: `${marchingAnts} 3s linear infinite`,
                "@media (prefers-reduced-motion: reduce)": { animation: "none" }
              }}
            />
          </Box>
        )}

        {steps.map((step, index) => (
          <Note
            key={step.title}
            number={String(index + 1).padStart(2, "0")}
            title={step.title}
            description={step.description}
            theme={step.theme}
            position={positions[index % positions.length]}
          />
        ))}
      </Box>
    </Box>
  );
}
