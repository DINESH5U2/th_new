import { Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import useCountdown from "../../hooks/useCountdown";
import TuringCupHeading from "./TuringCupHeading";

const countdownDate = new Date("February 28, 2026 20:30:00").getTime();

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  background: "#101820FF",
  height: 100,
  color: "#F2AA4CFF",
  border: "2px solid #F2AA4CFF",
  borderRadius: "12px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  transition: "0.3s ease-in-out",
  boxShadow: "0 4px 15px rgba(242, 170, 76, 0.3)",
  "&:hover": {
    boxShadow: "0 0 20px rgba(242, 170, 76, 0.8)"
  }
}));

function Timers() {
  const { days, hours, minutes, seconds } = useCountdown(countdownDate);

  return (
    <Grid
      sx={{
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        color: "primary",
        margin: "0 auto",
        textAlign: "center",
        background: "#101820FF",
        borderRadius: "5px",
        paddingTop: "20px",
        paddingX: "5px",
        "@media (min-width: 960px)": {
          width: "75%"
        }
      }}>
      <TuringCupHeading>ROUND-1 STARTS IN</TuringCupHeading>
      <Grid
        container
        justifyContent={"space-evenly"}
        spacing={3}
        paddingX={2}
        mt={3}
        mb={5}>
        {[
          { label: "DAYS", value: days },
          { label: "HOURS", value: hours },
          { label: "MINUTES", value: minutes },
          { label: "SECONDS", value: seconds }
        ].map(item => (
          <Grid item xs={6} md={3} key={item.label}>
            <Item elevation={3}>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  margin: "0",
                  textShadow: "0 0 15px rgba(242, 170, 76, 0.8)"
                }}>
                {item.value}
              </h1>
              <h4
                style={{
                  fontFamily: "'Gruppo', cursive",
                  letterSpacing: "1px",
                  fontSize: "1.2rem",
                  margin: "0"
                }}>
                {item.label}
              </h4>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default Timers;
