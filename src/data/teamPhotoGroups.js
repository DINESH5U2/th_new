// Plain module (no Vite features): used by the app and by vite.config.js.

const JPEG_EXTENSION = /\.(jpe?g)$/i;

/**
 * Name team_data.json uses for a photo file: the file name, with `.jpg` for
 * any JPEG (`a.jpeg`, `a.JPG` -> `a.jpg`), as Gatsby named its output.
 */
export function teamPhotoName(fileName) {
  return fileName.replace(JPEG_EXTENSION, ".jpg");
}

/** Group of the always-visible faculty and founders. */
const CORE_GROUP = "core";

/**
 * Maps every photo name in the team data to the group it is loaded with:
 * `core` for faculty and founders, otherwise the latest year listing it.
 */
export function teamPhotoGroups(teamData) {
  const groups = new Map();
  for (const [year, members] of Object.entries(teamData.team)) {
    members.forEach(({ image }) => image && groups.set(image, year));
  }
  [...teamData.faculty, ...teamData.founders].forEach(
    ({ image }) => image && groups.set(image, CORE_GROUP)
  );
  return groups;
}
