import { Box, Toolbar, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import useIsTuringCupPage from "../hooks/useIsTuringCupPage";
import theme from "../utils/theme";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Gatsby merged every stylesheet imported by a page into one sheet and inlined
// it on the pages that import CSS, which is every page using this layout. The
// pages without the layout (/register and the 404 page) do not get it when
// opened directly. Importing the same sheets here, in the same order, keeps
// that behaviour: they load with the layout and stay loaded afterwards.
import "../styles/global.css";
import "./TuringCup/turingcup.css";
import "./TuringCup/SponsorsCard.css";
import "./TuringCup/LandingPage2.css";
import "react-vertical-timeline-component/style.min.css";

export default function Layout() {
  const is_turingcup_page = useIsTuringCupPage();
  const bgcol = is_turingcup_page ? "#101820FF" : "white";

  return (
    <ThemeProvider theme={theme}>
      <Grid
        sx={{
          display: "flex",
          bgcolor: `${bgcol}`,
          margin: is_turingcup_page ? "0px" : "8px"
        }}>
        <Navbar />
        <Box component="main" sx={{ width: 1, margin: 0 }}>
          <Toolbar sx={{ minHeight: { xs: "60px !important", md: "70px !important" } }} />
          <Outlet />
          <Footer />
        </Box>
      </Grid>
    </ThemeProvider>
  );
}
