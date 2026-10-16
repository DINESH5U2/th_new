import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { withTrailingSlash } from "../utils/paths";

/**
 * Internal link with the behaviour of Gatsby's `<Link>`: trailing-slash URLs
 * and `aria-current="page"` on the link to the current page. As a NavLink,
 * it also accepts a render function as children: `({ isActive }) => ...`.
 */
const Link = forwardRef(function Link({ to, ...props }, ref) {
  return <NavLink ref={ref} to={withTrailingSlash(to)} end {...props} />;
});

export default Link;
