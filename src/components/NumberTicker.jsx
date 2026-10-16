import { useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import { visuallyHidden } from "@mui/utils";

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

// Digits after the decimal point, so 12.5 counts in tenths rather than in noisy thousandths
function decimalsOf(value) {
  if (!Number.isFinite(value)) return 0;
  const [, fraction = ""] = String(value).split(".");
  return Math.min(fraction.length, 20);
}

// Without digit settings of their own, plain numbers keep the precision of
// `value` and `from` on every frame, so the width does not jump
function formatOptions(value, from, format) {
  const style = format?.style ?? "decimal";
  const hasDigits = [
    "minimumFractionDigits",
    "maximumFractionDigits",
    "minimumSignificantDigits",
    "maximumSignificantDigits"
  ].some(key => format?.[key] !== undefined);
  if (hasDigits || (style !== "decimal" && style !== "unit")) return format;
  const decimals = Math.max(decimalsOf(value), decimalsOf(from));
  return {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...format
  };
}

const easeOutCubic = t => 1 - (1 - t) ** 3;

/**
 * A number that counts from `from` to `value` with an ease-out, writing
 * straight to the text once per frame instead of re-rendering. It starts
 * when it scrolls into view, or when `play` turns true if `play` is given.
 * Screen readers only hear the final value, and with reduced motion the
 * final value just shows. Digits are tabular, so the width holds still.
 */
export default function NumberTicker({
  value,
  from = 0,
  duration = 1600,
  delay = 0,
  locale = "en-US",
  format,
  play,
  once = true,
  sx,
  ...props
}) {
  const root = useRef(null);
  const output = useRef(null);
  const [inView, setInView] = useState(false);
  const controlled = play !== undefined;

  useEffect(() => {
    if (controlled) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting && once) observer.disconnect();
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [controlled, once]);

  const running = controlled ? play : inView;

  // A new `format` object on every render must not restart the count
  const optionsKey = JSON.stringify(formatOptions(value, from, format) ?? null);
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, JSON.parse(optionsKey) ?? undefined),
    [locale, optionsKey]
  );
  const finalText = formatter.format(value);

  useEffect(() => {
    const node = output.current;
    // Change React's own text node rather than replacing it
    const write = text => {
      const child = node.firstChild;
      if (child?.nodeType === Node.TEXT_NODE) child.nodeValue = text;
      else node.textContent = text;
    };
    const settle = () => write(formatter.format(value));
    if (prefersReducedMotion()) return settle();
    write(formatter.format(from));
    if (!running) return;

    const length = Math.max(duration, 1);
    let start;
    let id = 0;
    const tick = now => {
      start ??= now + delay;
      const progress = Math.min(Math.max((now - start) / length, 0), 1);
      if (progress >= 1) return settle();
      write(formatter.format(from + (value - from) * easeOutCubic(progress)));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [running, formatter, value, from, duration, delay]);

  return (
    <Box
      component="span"
      ref={root}
      sx={{ display: "inline-block", fontVariantNumeric: "tabular-nums", ...sx }}
      {...props}>
      <span style={visuallyHidden}>{finalText}</span>
      <span ref={output} aria-hidden="true">
        {finalText}
      </span>
    </Box>
  );
}
