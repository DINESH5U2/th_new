import { events, posterOf } from "./content";

const dateOptions = { year: "numeric", month: "short", day: "numeric" };

function statusOf(date) {
  const today = new Date().toDateString();
  if (date.toDateString() === today) return "Today";
  return date > new Date() ? "Upcoming" : null;
}

/**
 * Every event for display, newest first (so upcoming ones lead), with its
 * `poster`, a short `dateLabel` and a `status` ("Today", "Upcoming" or null).
 */
export const eventCards = events
  .map(event => {
    const date = new Date(event.date);
    return {
      ...event,
      poster: posterOf(event),
      dateLabel: date.toLocaleDateString("en-US", dateOptions),
      status: statusOf(date),
      time: date.getTime()
    };
  })
  .sort((a, b) => b.time - a.time);
