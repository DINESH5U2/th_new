import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** Calls `onChange` after each client-side navigation (not on the first load). */
export default function useRouteChange(onChange) {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);
  const callback = useRef(onChange);

  useEffect(() => {
    callback.current = onChange;
  });

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return undefined;
    }
    previousPathname.current = pathname;
    // wait a frame so the new page's title is in place, as Gatsby did
    const frame = requestAnimationFrame(() => callback.current(pathname));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
}
