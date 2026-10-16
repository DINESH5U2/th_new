import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useSyncExternalStore } from "react";
import { useSearchParams } from "react-router-dom";
import jsondata from "../assets/team_data.json";
import {
  getTeamImage,
  getTeamImagesVersion,
  hasTeamImage,
  loadTeamImage,
  subscribeTeamImages,
  teamYears
} from "../data/teamImages";
import TeamCard from "./TeamCard";
import StudentCoordinators from "./team/StudentCoordinators";

/**
 * Loads the photos of the given member lists and re-renders as they arrive.
 * The loaded photos are an external store: subscribing through
 * useSyncExternalStore means a photo that arrives between a render and its
 * commit (e.g. while the router renders the page in a transition) is still
 * picked up, which a "load, then set state" effect would miss.
 */
function useTeamImages(...memberLists) {
  useSyncExternalStore(subscribeTeamImages, getTeamImagesVersion);
  useEffect(() => {
    memberLists.flat().forEach(({ image }) =>
      // a failed photo keeps its placeholder
      loadTeamImage(image).catch(() => {})
    );
    // the member lists are stable module-level arrays from team_data.json
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, memberLists);
}

export default function Team() {
  const [searchParams, setSearchParams] = useSearchParams();
  // The year lives in the URL (?year=2024-2025) so a cohort can be shared
  const year = teamYears.includes(searchParams.get("year"))
    ? searchParams.get("year")
    : teamYears[0];
  useTeamImages(jsondata.faculty, jsondata.founders, jsondata.team[year]);

  const selectYear = next => {
    const params = new URLSearchParams(searchParams);
    if (next === teamYears[0]) params.delete("year");
    else params.set("year", next);
    setSearchParams(params, { replace: true, preventScrollReset: true });
  };

  const renderMembers = data => {
    return data.map(val => (
      <Grid
        item
        xs={10}
        sm={6}
        md={3}
        xl={2}
        key={`${val.name}-${val.image}`}
        sx={{ p: 2 }}>
        <TeamCard
          name={val.name}
          img={getTeamImage(val.image)}
          hasImg={hasTeamImage(val.image)}
          description={val.designation}
          twitter={val.twitter}
          github={val.github}
          linkedin={val.linkedin}
          website={val.website}
          cpprofile={val.cpprofile}
        />
      </Grid>
    ));
  };

  const faculty = renderMembers(jsondata["faculty"]);
  const founders = renderMembers(jsondata["founders"]);

  return (
    <Box sx={{ my: 4 }}>
      <Box>
        <Box sx={{ my: 2 }}>
          <Typography
            variant="h5"
            color="black"
            fontWeight={"bold"}
            sx={{ display: "inline" }}>
            Faculty&nbsp;
          </Typography>
          <Typography
            variant="h5"
            color="primary"
            fontWeight={"bold"}
            sx={{ display: "inline" }}>
            Coordinators.
          </Typography>
        </Box>
        <Grid container justifyContent={"center"}>
          {faculty}
        </Grid>
      </Box>
      <Box>
        <Box sx={{ my: 2 }}>
          <Typography
            variant="h5"
            color="black"
            fontWeight={"bold"}
            sx={{ display: "inline" }}>
            Founders&nbsp;
          </Typography>
        </Box>
        <Grid container justifyContent={"center"}>
          {founders}
        </Grid>
      </Box>
      <StudentCoordinators year={year} onYearChange={selectYear} />
    </Box>
  );
}
