import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { hairline, ink, pageColumn } from "./aboutStyles";
import NumberTicker from "./NumberTicker";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";

// Editorial serif for the reading text; optical sizing tunes it per size
const serif = '"Newsreader Variable", Georgia, "Times New Roman", serif';

// Pin the section and drive it from scroll only where both columns fit on screen
const PINNED =
  "(min-width: 900px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)";
const REDUCED = "(prefers-reduced-motion: reduce)";

// Share of the scroll each column reads over; they overlap slightly
const VISION_RANGE = [0, 0.55];
const FORMATION_RANGE = [0.45, 1];

const vision = [
  "Act as platform of “unity” to promote the",
  { em: "cause" },
  "of Computer Science. Develop a sense of belongingness amongst the pupils in the",
  { em: "impact" },
  "being created by Computer Science and its applied concepts while appreciating its inter-disciplinary nature and recognizing the unique art of developing solutions through mathematical models evolving in scale to the emerging problems of the world today. And help explore knowledge, simulate study and research of and seek opportunities in Computer Science, with special regard given to Programming, as its members pave way for their career into the future."
];

const formation = [
  "The club was formed in",
  { year: "2017" },
  "as a Computer Science and Programming Special Interest Club.",
  { name: "Mrs. B. V. Kiranmayee" },
  ",",
  { name: "Mrs. S. Nagini" },
  "and",
  { name: "Mrs. V. Baby" },
  "from the Department of CSE, VNR VJIET are recognized as its Honorary Founders. The club recognizes",
  { name: "Kalidindi Prateek Varma" },
  ", student at Department of CSE, VNR VJIET as its Founder.",
  { name: "Priya Bhandari" },
  ",",
  { name: "J. Tarun Kumar" },
  "and",
  { name: "P. Venkat" },
  "; students at Department of CSE, VNR VJIET are recognized as Co-Founders."
];

const clamp01 = value => Math.min(Math.max(value, 0), 1);
const within = (p, [start, end]) => clamp01((p - start) / (end - start));

// Plain strings become one token per word; { kind: text } stays one token.
// Punctuation at the start of a string sticks to the token before it.
function tokenize(parts) {
  return parts.flatMap(part => {
    if (typeof part !== "string") {
      const [[kind, text]] = Object.entries(part);
      return [{ text, kind }];
    }
    return part
      .split(" ")
      .filter(Boolean)
      .map((text, i) => ({ text, glue: i === 0 && /^[,;.]/.test(text) }));
  });
}

function Words({ parts, yearPlay }) {
  const words = tokenize(parts);
  return words.map(({ text, kind, glue }, i) => (
    <Fragment key={i}>
      {i > 0 && !glue && " "}
      <span
        className={kind ? `w ${kind}` : "w"}
        style={{ "--w": (i / words.length).toFixed(4) }}>
        {kind === "em" ? (
          <em>{text}</em>
        ) : kind === "year" ? (
          <NumberTicker
            value={Number(text)}
            from={1900}
            play={yearPlay}
            format={{ useGrouping: false }}
          />
        ) : (
          text
        )}
      </span>
    </Fragment>
  ));
}

// Fully lit once the column's progress has passed the word's position
const lit = "clamp(0, calc((var(--q, 1) * 1.08 - var(--w)) / 0.08), 1)";

// The founding year counts up once its word in Formation is fully lit
const formationTokens = tokenize(formation);
const yearPosition =
  formationTokens.findIndex(({ kind }) => kind === "year") /
  formationTokens.length;
const yearLitAt = (yearPosition + 0.08) / 1.08;

const paragraph = {
  color: ink,
  fontFamily: serif,
  fontOpticalSizing: "auto",
  fontSize: "clamp(1.125rem, 0.62rem + 0.85vw, 1.5rem)",
  lineHeight: 1.5,
  letterSpacing: "-0.003em",
  "& .w": {
    opacity: `max(0.16, ${lit})`,
    transition: "opacity 0.2s linear"
  },
  "& .year": { color: "primary.main", fontWeight: 600 },
  "& .name": {
    fontWeight: 600,
    backgroundImage:
      "linear-gradient(rgba(22, 101, 79, 0.6), rgba(22, 101, 79, 0.6))",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0 100%",
    backgroundSize: `calc(${lit} * 100%) 1px`,
    paddingBottom: "1px",
    transition: "opacity 0.2s linear, background-size 0.2s linear"
  }
};

function Column({ title, progress, drift, children }) {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        "--q": `var(${progress}, 1)`,
        [`@media ${PINNED}`]: {
          transform: `translateY(calc((0.5 - var(--p, 0.5)) * ${drift}px))`
        }
      }}>
      <Typography
        component="h2"
        sx={{
          position: "relative",
          zIndex: 1,
          mb: { xs: 2, md: 3 },
          color: ink,
          fontSize: "1.125rem",
          fontWeight: 600,
          letterSpacing: "-0.005em"
        }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

/**
 * "Our Vision" and "Formation" side by side. On large screens the section
 * pins while it is scrolled through and the text fills in word by word,
 * Vision first and then Formation; elsewhere the same fill follows the
 * section's position on the page. Reduced motion shows everything as is.
 */
export default function VisionFormation() {
  const ref = useRef(null);
  const [yearPlay, setYearPlay] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    const pinned = window.matchMedia(PINNED);
    const reduced = window.matchMedia(REDUCED);
    let frame = null;

    const update = () => {
      frame = null;
      let p = 1;
      if (!reduced.matches) {
        const { top, height } = el.getBoundingClientRect();
        const vh = window.innerHeight;
        p = pinned.matches
          ? -top / (height - vh)
          : (vh * 0.85 - top) / (height + vh * 0.25);
      }
      p = clamp01(p);
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--qv", within(p, VISION_RANGE).toFixed(4));
      const qf = within(p, FORMATION_RANGE);
      el.style.setProperty("--qf", qf.toFixed(4));
      if (qf >= yearLitAt) setYearPlay(true);
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    pinned.addEventListener("change", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      pinned.removeEventListener("change", schedule);
      reduced.removeEventListener("change", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        py: { xs: 5, md: 8 },
        [`@media ${PINNED}`]: { height: "260vh", py: 0 }
      }}>
      <Box
        sx={{
          [`@media ${PINNED}`]: {
            position: "sticky",
            top: 0,
            height: "100vh",
            boxSizing: "border-box",
            // Clears the floating navbar
            pt: "88px",
            display: "flex",
            alignItems: "center"
          }
        }}>
        <Box
          sx={{
            ...pageColumn,
            width: "100%",
            boxSizing: "border-box",
            position: "relative",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            columnGap: { md: 8, lg: 12 },
            rowGap: 6
          }}>
          {/* Centre rule that fills as the section is read */}
          <Box
            aria-hidden="true"
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              left: "50%",
              top: 8,
              bottom: 8,
              width: "1px",
              bgcolor: hairline,
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                bgcolor: "primary.main",
                transformOrigin: "top",
                transform: "scaleY(var(--p, 1))"
              }
            }}
          />

          <Column title="Our Vision" progress="--qv" drift={48}>
            <Typography sx={paragraph}>
              <Words parts={vision} />
            </Typography>
          </Column>

          <Column title="Formation" progress="--qf" drift={-48}>
            <Typography sx={{ ...paragraph, position: "relative", zIndex: 1 }}>
              <Words parts={formation} yearPlay={yearPlay} />
            </Typography>
          </Column>
        </Box>
      </Box>
    </Box>
  );
}
