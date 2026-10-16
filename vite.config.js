import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import { imagetoolsOptions } from "./plugins/images.js";
import teamData from "./src/assets/team_data.json" with { type: "json" };
import { teamPhotoGroups, teamPhotoName } from "./src/data/teamPhotoGroups.js";
import content from "./plugins/content.js";

const vendorChunks = {
  react: [
    "react",
    "react-dom",
    "react-router",
    "react-router-dom",
    "scheduler"
  ],
  mui: ["@mui", "@emotion", "@popperjs", "react-transition-group"]
};

function vendorChunk(id) {
  const packagePath = id.split("node_modules/").pop();
  for (const [chunk, packages] of Object.entries(vendorChunks)) {
    if (packages.some(name => packagePath.startsWith(`${name}/`))) {
      return `vendor-${chunk}`;
    }
  }
  return undefined;
}

// Team photos are loaded per year (see src/data/teamImages.js): one chunk per
// year, plus one for faculty and founders. Photos not listed in the team
// data keep the default chunking.
const teamPhotoGroupByName = teamPhotoGroups(teamData);
const TEAM_PHOTO_PATH = "/src/assets/images/team/";

function teamPhotoChunk(id) {
  const path = id.split("?")[0];
  if (!path.includes(TEAM_PHOTO_PATH)) {
    return undefined;
  }
  const name = teamPhotoName(path.slice(path.lastIndexOf("/") + 1));
  const group = teamPhotoGroupByName.get(name);
  return group && `team-${group}`;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [content(), imagetools(imagetoolsOptions), react()],
  build: {
    rolldownOptions: {
      // image processing makes the build plugin-bound by design
      checks: { pluginTimings: false },
      output: {
        manualChunks: id =>
          id.includes("node_modules") ? vendorChunk(id) : teamPhotoChunk(id)
      }
    }
  }
});
