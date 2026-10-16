const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
const apiHost =
  import.meta.env.VITE_POSTHOG_API_HOST ?? "https://us.i.posthog.com";

// Same conditions as gatsby-plugin-posthog with `isEnabledDevMode: false`.
const isEnabled = import.meta.env.PROD && Boolean(apiKey);

let client;

/** Loads and initialises PostHog; the library is only downloaded when enabled. */
export function initAnalytics() {
  if (isEnabled) {
    client = import("posthog-js").then(({ default: posthog }) => {
      // page views are captured on every route change, see `capturePageview`
      posthog.init(apiKey, { api_host: apiHost, capture_pageview: false });
      return posthog;
    });
  }
}

export function capturePageview() {
  client?.then(posthog => posthog.capture("$pageview"));
}
