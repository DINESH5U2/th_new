import { Button, Grid, Stack } from "@mui/material";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded";
import { atcb_action } from "add-to-calendar-button";
import { useRef } from "react";
import { goldButtonStyle } from "./styles";

const deadline = new Date("April 7, 2025 15:10:00");

const calendarConfig = {
  name: "[Reminder] Turing Cup 2K25 Round - 1",
  description: "Check your mail for the Contest Links",
  startDate: "2025-04-07",
  startTime: "20:00",
  endTime: "22:00",
  options: ["Google", "Apple", "Outlook.com"],
  timeZone: "Asia/Calcutta"
};

function Landingpage2() {
  const calendarButtonRef = useRef(null);
  const now = new Date();

  const handleClick = () => {
    atcb_action(calendarConfig, calendarButtonRef.current);
  };

  return (
    <Grid className="fullpage" style={{ fontFamily: "'Gruppo', cursive" }}>
      <svg viewBox="0 0 1300 300">
        <text
          x="50%"
          y="70%"
          fill="transparent"
          textAnchor="middle"
          className="bigh">
          TURING CUP
        </text>
      </svg>
      <svg viewBox="0 0 1300 200">
        <text
          x="50%"
          y="26%"
          fill="transparent"
          textAnchor="middle"
          className="smallh">
          ONE TEAM , ONE DREAM!
        </text>
      </svg>

      {now < deadline && (
        <Stack
          className="StackBtns"
          style={{ marginTop: "-70px" }}
          sx={{ p: 5, justifyContent: "center" }}
          direction={{ xs: "column", md: "row" }}
          spacing={2}>
          <Button
            sx={goldButtonStyle()}
            variant="contained"
            href="https://unstop.com/hackathons/turing-cup-2k25-vallurupalli-nageswara-rao-vignana-jyothi-institute-of-engineering-technology-telangana-1433278"
            target="__blank"
            startIcon={<HowToRegRoundedIcon />}>
            Register
          </Button>

          <Button
            sx={goldButtonStyle()}
            id="add-to-calendar-btn"
            ref={calendarButtonRef}
            onClick={handleClick}
            variant="contained"
            endIcon={<InsertInvitationRoundedIcon />}>
            Add to Calendar
          </Button>
        </Stack>
      )}
    </Grid>
  );
}

export default Landingpage2;
