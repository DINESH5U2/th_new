import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { capturePageview } from "../utils/analytics";

/** Captures a page view on every route change, like gatsby-plugin-posthog's `onRouteUpdate`. */
export default function usePageviewTracking() {
  const location = useLocation();

  useEffect(() => {
    capturePageview();
  }, [location.pathname, location.search]);
}
