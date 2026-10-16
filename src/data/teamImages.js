import teamData from "../assets/team_data.json";
import { teamPhotoName } from "./teamPhotoGroups";

// One loader per photo; nothing is downloaded until a loader runs. The build
// puts the photos of each group (a year, or faculty and founders) into one
// chunk (see vite.config.js), so loading a year is a single request.
const images = import.meta.glob("../assets/images/team/*", {
  import: "default",
  query: "?preset=constrained&width=350&height=400&quality=90"
});

const placeholders = import.meta.glob("../assets/images/team/*", {
  import: "default",
  query: "?preset=placeholder&width=350&height=400&placeholderWidth=20"
});

const loaders = new Map(
  Object.keys(images).map(path => [
    teamPhotoName(path.slice(path.lastIndexOf("/") + 1)),
    () =>
      Promise.all([images[path](), placeholders[path]()]).then(
        ([image, placeholder]) => ({ ...image, placeholder })
      )
  ])
);

const pending = new Map(); // photo name -> promise of its image data
const loaded = new Map(); // photo name -> image data

// Components subscribe to the loaded photos (see `useTeamImages` in Team.jsx).
// Photos arriving together are announced as one change.
const listeners = new Set();
let version = 0;
let notifyScheduled = false;

function notifyPhotoLoaded() {
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    version++;
    listeners.forEach(listener => listener());
  });
}

/** Calls `listener` whenever photos have loaded; returns the unsubscribe. */
export function subscribeTeamImages(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Changes whenever photos have loaded (a snapshot for useSyncExternalStore). */
export function getTeamImagesVersion() {
  return version;
}

/** Width and height of a team photo (the crop of the image query above). */
export const TEAM_PHOTO_SIZE = { width: 350, height: 400 };

/** Years of student coordinators, latest first. */
export const teamYears = Object.keys(teamData.team).reverse();

/** Whether there is a photo with this name. */
export function hasTeamImage(name) {
  return loaders.has(name);
}

/** Image data of a loaded photo, or `null` (not loaded, or no such photo). */
export function getTeamImage(name) {
  return loaded.get(name) ?? null;
}

/**
 * Loads one photo, once. Resolves when it is available to `getTeamImage`;
 * a name without a photo resolves at once. A failed load is not remembered
 * here, but browsers remember a failed module import, so in practice it only
 * succeeds after a page reload.
 */
export function loadTeamImage(name) {
  if (!loaders.has(name) || loaded.has(name)) {
    return Promise.resolve();
  }
  if (!pending.has(name)) {
    const promise = loaders
      .get(name)()
      .then(
        image => {
          loaded.set(name, image);
          pending.delete(name);
          notifyPhotoLoaded();
        },
        error => {
          pending.delete(name);
          throw error;
        }
      );
    pending.set(name, promise);
  }
  return pending.get(name);
}

/** Members shown when the team page opens: faculty, founders, latest year. */
const initialTeamMembers = [
  ...teamData.faculty,
  ...teamData.founders,
  ...teamData.team[teamYears[0]]
];

/**
 * Starts loading the photos the team page opens with, without waiting for
 * them; the page shows each photo as it arrives (see `Team`).
 */
export function preloadInitialTeamImages() {
  initialTeamMembers.forEach(({ image }) =>
    loadTeamImage(image).catch(() => {})
  );
}
