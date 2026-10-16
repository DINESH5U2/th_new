import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import sponsordata from "../../assets/sponsors26.json";
import sponsorImages from "../../data/sponsorImages";
import SponsorCard from "./OurSponsors";
import TuringCupHeading from "./TuringCupHeading";

const Item = styled(Paper)({
  textAlign: "center",
  backgroundColor: "#101820FF"
});

export default function TuringCupSponsors() {
  return (
    <Box
      sx={{
        margin: "50px auto"
      }}>
      <TuringCupHeading>OUR SPONSORS</TuringCupHeading>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-around"
        alignItems="center">
        {sponsordata["sponsors"].map((sponsor, i) => (
          <Item key={i}>
            <SponsorCard
              name={sponsor.name}
              img={sponsorImages[sponsor.image]}
              desc={sponsor.details}
              link={sponsor.link}
            />
          </Item>
        ))}
      </Stack>
    </Box>
  );
}
