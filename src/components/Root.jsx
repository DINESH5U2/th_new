import { useRef, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import usePageviewTracking from "../hooks/usePageviewTracking";
import useRouteChange from "../hooks/useRouteChange";

const announcerStyle = {
  position: "absolute",
  top: 0,
  width: 1,
  height: 1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};

/**
 * Top of the route tree: what Gatsby's router did on every page. It resets
 * scroll, tracks page views and, after each navigation, moves keyboard focus
 * to the page wrapper and announces the new page to screen readers.
 */
export default function Root() {
  const wrapperRef = useRef(null);
  const [announcement, setAnnouncement] = useState("");

  usePageviewTracking();
  useRouteChange(pathname => {
    wrapperRef.current.focus({ preventScroll: true });
    const pageName =
      document.title ||
      wrapperRef.current.querySelector("h1")?.textContent ||
      `new page at ${pathname}`;
    setAnnouncement(`Navigated to ${pageName}`);
  });

  return (
    <>
      <ScrollRestoration />
      <div ref={wrapperRef} tabIndex={-1} style={{ outline: "none" }}>
        <Outlet />
      </div>
      <div
        style={announcerStyle}
        aria-live="assertive"
        aria-atomic="true">
        {announcement}
      </div>
    </>
  );
}
