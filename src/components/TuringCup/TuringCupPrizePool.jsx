import { Box, Typography, Card, CardContent } from "@mui/material";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import { styled } from "@mui/material/styles";
import TuringCupHeading from "./TuringCupHeading";

const PrizeCard = styled(Card)({
  background: "#101820FF",
  border: "2px solid #F2AA4CFF",
  color: "#F2AA4CFF",
  borderRadius: "15px",
  textAlign: "center",
  padding: "20px",
  boxShadow: "0 0 20px rgba(242, 170, 76, 0.6)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 0 30px rgba(242, 170, 76, 1)"
  }
});

const prizes = [
  { Icon: EmojiEvents, text: "Attractive Prizes for Top Performers" },
  { Icon: CardGiftcard, text: "Goodies for All Onsite Participants" }
];

export default function TuringCupPrizePool() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      sx={{
        background: "#101820FF",
        color: "#F2AA4CFF",
        py: 6,
        px: 5,
        borderRadius: "15px"
      }}>
      <TuringCupHeading>PRIZE POOL WORTH Rs. 75K 💰</TuringCupHeading>

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        mt={4}
        gap={8}>
        {prizes.map(({ Icon, text }) => (
          <PrizeCard sx={{ width: { xs: "90%", md: "40%" } }} key={text}>
            <Icon sx={{ fontSize: 60, color: "#F2AA4CFF" }} />
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Gruppo', cursive",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  textShadow: "0 0 10px rgba(242, 170, 76, 0.6)"
                }}>
                {text}
              </Typography>
            </CardContent>
          </PrizeCard>
        ))}
      </Box>
    </Box>
  );
}
