import { useEffect, useState } from "react";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const pad = value => String(value).padStart(2, "0");

const initialTimeLeft = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00"
};

/**
 * Counts down to `target` (a timestamp), updating once per second. Values are
 * zero-padded strings and stay at their last value once the target has passed.
 */
export default function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      const distance = target - Date.now();

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: pad(Math.floor(distance / DAY)),
        hours: pad(Math.floor((distance % DAY) / HOUR)),
        minutes: pad(Math.floor((distance % HOUR) / MINUTE)),
        seconds: pad(Math.floor((distance % MINUTE) / SECOND))
      });
    }, SECOND);

    return () => clearInterval(interval);
  }, [target]);

  return timeLeft;
}
