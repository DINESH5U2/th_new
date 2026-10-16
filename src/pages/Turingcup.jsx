import { Box, Typography, Button } from "@mui/material";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import { Seo } from "../components/Seo";
import About from "../components/TuringCup/About";
import Faqs from "../components/TuringCup/Faqs";
import PastContests from "../components/TuringCup/PastContests";
import RegisterForm from "../components/TuringCup/RegisterForm";
import Timelinee from "../components/TuringCup/Timelinee";
import Timers from "../components/TuringCup/Timers";
import Landingpage2 from "../components/TuringCup/Landingpage2";
import TuringCupPrizePool from "../components/TuringCup/TuringCupPrizePool";
import TuringCupSponsors from "../components/TuringCup/TuringCupSponsors";
import { goldButtonStyle } from "../components/TuringCup/styles";
import { registrationUrl, turingCupSections } from "../data/turingCup";

function Turingcup() {
  return (
    <div>
      <Seo routename={"Turing Cup"} />
      <Box
        sx={{
          backgroundColor: "#101820FF",
          color: "#F2AA4CFF",
          fontFamily: "'Gruppo', cursive"
        }}>
        <Landingpage2 />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              textAlign: "left",
              fontFamily: "'Gruppo', cursive",
              fontWeight: "bold",
              letterSpacing: "1px",
              textShadow: "0 0 15px rgba(242, 170, 76, 0.8)"
            }}></Typography>
          {turingCupSections.registerButton && (
            <Button
              sx={goldButtonStyle()}
              variant="contained"
              href={registrationUrl}
              target="_blank"
              startIcon={<HowToRegRoundedIcon />}>
              Register
            </Button>
          )}
          {turingCupSections.registrationForm && <RegisterForm />}
        </div>

        <About />
        {turingCupSections.timers && <Timers />}
        {turingCupSections.timeline && <Timelinee />}
        {turingCupSections.prizePool && <TuringCupPrizePool />}
        {turingCupSections.sponsors && <TuringCupSponsors />}
        <Box sx={{ height: "50px" }} />
        <PastContests />
        <Faqs />
      </Box>
    </div>
  );
}

export default Turingcup;
