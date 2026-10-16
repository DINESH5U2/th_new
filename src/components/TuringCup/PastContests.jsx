import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Looks3OutlinedIcon from "@mui/icons-material/Looks3Outlined";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";
import Looks4OutlinedIcon from "@mui/icons-material/Looks4Outlined";
import Looks5OutlinedIcon from "@mui/icons-material/Looks5Outlined";
import { Box, Grid } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import contestdetails from "../../data/pastContests";
import winnersImages from "../../data/winnersImages";
import Image from "../Image";
import TuringCupHeading from "./TuringCupHeading";

const styles = {
  accordion: {
    color: "#F2AA4CFF",
    padding: "5px",
    backgroundColor: "#101820FF"
  },
  summary: {
    color: "#F2AA4CFF",
    borderRadius: "5px",
    border: "1px solid #F2AA4CFF"
  },
  details: {
    color: "#F2AA4CFF",
    borderRadius: "10px",
    margin: "10px",
    border: "1px solid #F2AA4CFF",
    textAlign: "center"
  },
  container: {
    margin: "auto",
    width: "75vw"
  }
};

const placeIcons = {
  first: LooksOneOutlinedIcon,
  second: LooksTwoOutlinedIcon,
  third: Looks3OutlinedIcon,
  fourth: Looks4OutlinedIcon,
  fifth: Looks5OutlinedIcon
};

const getImage = val => winnersImages[val.split(".")[0]] ?? null;

function PastContests() {
  return (
    <>
      <TuringCupHeading mt={2}>PREVIOUS EDITIONS</TuringCupHeading>
      <Grid style={styles.container} m={8}>
        {contestdetails.map(item => {
          const image = item.image !== "NA" ? getImage(item.image) : null;

          return (
            <Accordion style={styles.accordion} key={item.year}>
              <AccordionSummary
                style={styles.summary}
                expandIcon={<ExpandMoreIcon sx={{ color: "#F2AA4CFF" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <Typography
                  sx={{
                    border: "1px solid #F2AA4CFF",
                    borderRadius: "2px",
                    padding: "8.6px",
                    fontFamily: "'Gruppo', cursive"
                  }}>
                  {item.year}
                </Typography>
              </AccordionSummary>
              <AccordionDetails style={styles.details}>
                <Typography
                  sx={{ fontFamily: "'Gruppo', cursive", color: "white" }}>
                  {item.info}
                </Typography>

                {item.image !== "NA" && (
                  <Box sx={{ width: "60%", margin: "0 auto" }}>
                    {image && (
                      <Image
                        alt="winners here"
                        style={{ borderRadius: "10px" }}
                        image={image}
                      />
                    )}
                  </Box>
                )}

                {Object.entries(item.winners).map(([place, winner]) => {
                  const PlaceIcon = placeIcons[place];

                  return (
                    <Fragment key={place}>
                      {PlaceIcon ? (
                        <PlaceIcon
                          sx={{ color: "white", marginTop: "10px" }}
                          fontSize="large"
                        />
                      ) : (
                        <Typography
                          sx={{
                            fontFamily: "'Gruppo', cursive",
                            color: "white",
                            marginTop: "10px"
                          }}>
                          {place.charAt(0).toUpperCase() + place.slice(1)} Place
                        </Typography>
                      )}

                      {[winner.mem1, winner.mem2, winner.mem3]
                        .filter(mem => mem && mem.length > 0)
                        .map((mem, i) => (
                          <Typography
                            key={i}
                            sx={{ fontFamily: "'Gruppo', cursive" }}>
                            {mem}
                          </Typography>
                        ))}

                      <Typography
                        sx={{
                          fontFamily: "'Gruppo', cursive",
                          color: "white"
                        }}>
                        <i>{winner.college}</i>
                      </Typography>
                    </Fragment>
                  );
                })}

                {item.report !== "NA" && (
                  <Typography
                    sx={{ fontFamily: "'Gruppo', cursive", color: "red" }}>
                    For more details&nbsp;
                    <a target="_blank" rel="noreferrer" href={item.report}>
                      <Typography
                        component="span"
                        sx={{
                          display: "inline",
                          fontFamily: "'Gruppo', cursive",
                          color: "blue"
                        }}>
                        click here
                      </Typography>
                    </a>
                    .
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Grid>
    </>
  );
}

export default PastContests;
