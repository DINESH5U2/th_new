import {
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import navItems from "../data/navItems";
import useIsTuringCupPage from "../hooks/useIsTuringCupPage";
import Link from "./Link";
import NavDrawerContent from "./NavDrawerContent";
import NavLabel from "./NavLabel";

const drawerWidth = 280;
// Scroll distance (px) over which the navbar shrinks from full to compact size
const SHRINK_DISTANCE = 500;

const turingCupButtonStyle = isActive => ({
  color: isActive ? "#F2AA4D" : "rgba(255, 255, 255, 0.85)",
  bgcolor: isActive ? "rgba(242, 170, 76, 0.22)" : "transparent",
  fontWeight: isActive ? 700 : 500,
  fontSize: { md: "0.74rem", lg: "0.8rem" },
  borderRadius: "9999px",
  px: { md: 2.2, lg: 3.2 },
  py: 0.75,
  letterSpacing: "-0.01em",
  textTransform: "none",
  border: isActive
    ? "1px solid rgba(242, 170, 76, 0.5)"
    : "1px solid transparent",
  boxShadow: isActive
    ? "0 0 18px rgba(242, 170, 76, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3)"
    : "none",
  backdropFilter: isActive ? "blur(12px)" : "none",
  WebkitBackdropFilter: isActive ? "blur(12px)" : "none",
  transition: "all 0.22s cubic-bezier(0.25, 1, 0.5, 1)",
  "&:hover": {
    bgcolor: isActive ? "rgba(242, 170, 76, 0.3)" : "rgba(255, 255, 255, 0.12)",
    color: "#F2AA4C",
    transform: "translateY(-1.5px)",
    boxShadow: isActive
      ? "0 0 24px rgba(242, 170, 76, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4)"
      : "0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)"
  },
  "&:active": {
    transform: "translateY(0.5px)"
  }
});

const defaultButtonStyle = isActive => ({
  color: isActive ? "#000000" : "rgba(20, 20, 24, 0.85)",
  bgcolor: isActive ? "rgba(255, 255, 255, 0.55)" : "transparent",
  fontWeight: isActive ? 700 : 500,
  fontSize: { md: "0.74rem", lg: "0.8rem" },
  borderRadius: "9999px",
  px: { md: 2.2, lg: 3.2 },
  py: 0.75,
  letterSpacing: "-0.01em",
  textTransform: "none",
  border: isActive
    ? "1px solid rgba(255, 255, 255, 0.85)"
    : "1px solid transparent",
  boxShadow: isActive
    ? "0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1.5px 1px rgba(255, 255, 255, 1)"
    : "none",
  backdropFilter: isActive ? "blur(12px)" : "none",
  WebkitBackdropFilter: isActive ? "blur(12px)" : "none",
  transition: "all 0.22s cubic-bezier(0.25, 1, 0.5, 1)",
  "&:hover": {
    bgcolor: isActive
      ? "rgba(255, 255, 255, 0.7)"
      : "rgba(255, 255, 255, 0.45)",
    color: "#000000",
    transform: "translateY(-1.5px)",
    boxShadow: isActive
      ? "0 6px 18px rgba(0, 0, 0, 0.1), inset 0 1.5px 1px rgba(255, 255, 255, 1)"
      : "0 4px 14px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.95)"
  },
  "&:active": {
    transform: "translateY(0.5px)",
    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)"
  }
});

export default function Navbar() {
  const isTuringCupPage = useIsTuringCupPage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      const progress = Math.min(window.scrollY / SHRINK_DISTANCE, 1);
      // Written straight to the element so the size tracks scroll without re-rendering
      navRef.current?.style.setProperty("--nav-shrink", progress.toFixed(3));
      setScrolled(window.scrollY > 15);
    };
    const handleScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const buttonStyle = isTuringCupPage
    ? turingCupButtonStyle
    : defaultButtonStyle;

  return (
    <div>
      <Box>
        <AppBar
          ref={navRef}
          component="nav"
          elevation={0}
          sx={{
            position: "fixed",
            // --nav-shrink goes 0 -> 1 over SHRINK_DISTANCE px of scroll
            top: {
              xs: "calc(8px - 2px * var(--nav-shrink, 0))",
              sm: "calc(12px - 4px * var(--nav-shrink, 0))",
              md: "calc(16px - 6px * var(--nav-shrink, 0))"
            },
            left: 0,
            right: 0,
            zIndex: 1200,
            width: {
              xs: "calc(100% - 20px - 12px * var(--nav-shrink, 0))",
              sm: "calc(100% - 32px - 32px * var(--nav-shrink, 0))",
              md: "calc(100% - 48px - 72px * var(--nav-shrink, 0))"
            },
            maxWidth: "calc(1240px - 280px * var(--nav-shrink, 0))",
            mx: "auto",
            borderRadius: { xs: "24px", sm: "32px", md: "9999px" },
            overflow: "hidden",
            // Hyper-translucent, refractive water-glass background
            bgcolor: isTuringCupPage
              ? scrolled
                ? "rgba(16, 24, 32, 0.55)"
                : "rgba(16, 24, 32, 0.35)"
              : scrolled
                ? "rgba(255, 255, 255, 0.38)"
                : "rgba(255, 255, 255, 0.25)",
            backgroundImage: isTuringCupPage
              ? scrolled
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(20, 28, 40, 0.45) 40%, rgba(16, 24, 32, 0.65) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(20, 28, 40, 0.3) 40%, rgba(16, 24, 32, 0.45) 100%)"
              : scrolled
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.25) 35%, rgba(225, 242, 255, 0.35) 70%, rgba(255, 255, 255, 0.5) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.18) 35%, rgba(220, 240, 255, 0.28) 70%, rgba(255, 255, 255, 0.4) 100%)",
            // Deep frosted glass blur + intense vibrancy & brightness
            backdropFilter: scrolled
              ? "blur(28px) saturate(220%) brightness(108%) contrast(92%)"
              : "blur(24px) saturate(210%) brightness(108%) contrast(90%)",
            WebkitBackdropFilter: scrolled
              ? "blur(28px) saturate(220%) brightness(108%) contrast(92%)"
              : "blur(24px) saturate(210%) brightness(108%) contrast(90%)",
            // Specular perimeter highlight border (water meniscus)
            border: isTuringCupPage
              ? "1px solid rgba(255, 255, 255, 0.15)"
              : "1px solid rgba(255, 255, 255, 0.7)",
            // Beveled inner glass refraction + glowing water drop shadow
            boxShadow: isTuringCupPage
              ? scrolled
                ? "0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(242, 170, 76, 0.1), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.25), inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.5)"
                : "0 14px 38px -10px rgba(0, 0, 0, 0.6), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.2), inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.4)"
              : scrolled
                ? "0 20px 45px -12px rgba(15, 23, 42, 0.14), 0 0 30px rgba(255, 255, 255, 0.4), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px 0 rgba(255, 255, 255, 0.4)"
                : "0 12px 35px -10px rgba(15, 23, 42, 0.1), 0 0 25px rgba(255, 255, 255, 0.35), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.9), inset 0 -1.5px 2px 0 rgba(255, 255, 255, 0.35)",
            transition:
              "background-color 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1), backdrop-filter 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
            // Liquid surface curved highlight reflection
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "55%",
              background: isTuringCupPage
                ? "linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.02) 80%, rgba(255, 255, 255, 0) 100%)"
                : "linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.18) 70%, rgba(255, 255, 255, 0) 100%)",
              pointerEvents: "none",
              borderRadius: "inherit"
            }
          }}>
          <Toolbar
            sx={{
              px: { xs: 2, sm: 3, md: 4 },
              minHeight: { xs: 54, md: 62 },
              width: "100%",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: { xs: "flex-start", md: "space-around" }
            }}>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                display: { md: "none" },
                color: isTuringCupPage ? "#ffffff" : "#1d1d1f",
                bgcolor: isTuringCupPage
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(255, 255, 255, 0.5)",
                borderRadius: "12px",
                border: isTuringCupPage
                  ? "1px solid rgba(255, 255, 255, 0.18)"
                  : "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow:
                  "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 2px 8px rgba(0,0,0,0.06)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                p: 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isTuringCupPage
                    ? "rgba(255, 255, 255, 0.22)"
                    : "rgba(255, 255, 255, 0.75)"
                }
              }}>
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "space-around",
                width: "100%"
              }}>
              {navItems.map(item => (
                <Link
                  key={item.text}
                  to={item.path}
                  style={{ textDecoration: "none" }}>
                  {({ isActive }) => (
                    <Button sx={buttonStyle(isActive)}>
                      <NavLabel text={item.text} active={isActive} />
                    </Button>
                  )}
                </Link>
              ))}
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: isTuringCupPage
                ? "linear-gradient(180deg, rgba(24, 32, 44, 0.88) 0%, rgba(16, 24, 32, 0.92) 100%)"
                : "linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(248, 250, 252, 0.85) 100%)",
              backdropFilter: "blur(28px) saturate(190%) contrast(95%)",
              WebkitBackdropFilter: "blur(28px) saturate(190%) contrast(95%)",
              borderRight: isTuringCupPage
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(255, 255, 255, 0.6)",
              boxShadow: isTuringCupPage
                ? "15px 0 35px rgba(0, 0, 0, 0.6), inset -1px 0 0 rgba(255, 255, 255, 0.05)"
                : "15px 0 35px rgba(0, 0, 0, 0.08), inset -1px 0 0 rgba(255, 255, 255, 0.8)"
            }
          }}>
          <NavDrawerContent
            items={navItems}
            onClick={handleDrawerToggle}
            isTuringCupPage={isTuringCupPage}
          />
        </Drawer>
      </Box>
    </div>
  );
}
