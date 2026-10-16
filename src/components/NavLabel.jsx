import { Box } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import "@fontsource-variable/unbounded/wght.css";

// The navbar's own typeface: wide, rounded and variable from 200 to 900
const navFont =
  '"Unbounded Variable", "Instrument Sans Variable", system-ui, sans-serif';

const REST = 420;
const ACTIVE = 680;
const HOVER = 860;

/**
 * A navbar label in Unbounded. Hovering or focusing its link swells the
 * weight and sends a wave through the letters. An invisible copy at the
 * hover weight reserves the width, so neighbouring items never shift.
 * Screen readers get the plain text, not the letters one by one.
 */
export default function NavLabel({ text, active = false, sx }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-grid",
        fontFamily: navFont,
        fontWeight: "normal",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        "@keyframes nav-wave": {
          "0%, 100%": { transform: "translateY(0)" },
          "35%": { transform: "translateY(-0.32em) rotate(-6deg)" },
          "70%": { transform: "translateY(0.06em)" }
        },
        "& .nav-letters": {
          fontVariationSettings: `'wght' ${active ? ACTIVE : REST}`,
          transition: "font-variation-settings 0.35s cubic-bezier(.2,.7,.2,1)"
        },
        "a:hover &, a:focus-visible &": {
          "& .nav-letters": { fontVariationSettings: `'wght' ${HOVER}` },
          "@media (prefers-reduced-motion: no-preference)": {
            "& .nav-letter": {
              animation: "nav-wave 0.55s cubic-bezier(.3,.7,.3,1) both",
              animationDelay: "calc(var(--i) * 32ms)"
            }
          }
        },
        "@media (prefers-reduced-motion: reduce)": {
          "& .nav-letters": { transition: "none" }
        },
        ...sx
      }}>
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          gridArea: "1 / 1",
          visibility: "hidden",
          fontVariationSettings: `'wght' ${HOVER}`
        }}>
        {text}
      </Box>
      <Box
        component="span"
        aria-hidden="true"
        className="nav-letters"
        sx={{ gridArea: "1 / 1", textAlign: "center", whiteSpace: "nowrap" }}>
        {[...text].map((letter, index) => (
          <Box
            component="span"
            key={index}
            className="nav-letter"
            style={{ "--i": index }}
            sx={{ display: "inline-block", whiteSpace: "pre" }}>
            {letter}
          </Box>
        ))}
      </Box>
      <Box component="span" sx={visuallyHidden}>
        {text}
      </Box>
    </Box>
  );
}
