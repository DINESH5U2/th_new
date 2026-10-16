const HAS_FILE_EXTENSION = /\.[^/]+$/;

/**
 * Gatsby 5 serves every page with a trailing slash (`trailingSlash: "always"`)
 * and rewrites internal links accordingly. This keeps the same URLs.
 */
export function withTrailingSlash(to) {
  if (typeof to !== "string" || !to.startsWith("/")) {
    return to;
  }
  const [, pathname, suffix] = /^([^?#]*)(.*)$/.exec(to);
  if (pathname.endsWith("/") || HAS_FILE_EXTENSION.test(pathname)) {
    return to;
  }
  return `${pathname}/${suffix}`;
}

/** The Turing Cup pages use the dark theme for the layout, navbar and footer. */
export function isTuringCupPath(pathname) {
  return pathname.includes("/turingcup") || pathname.includes("/register");
}
