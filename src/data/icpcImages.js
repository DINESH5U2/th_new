import { indexByFileName } from "../utils/imageIndex";

// Shown 280px wide on larger screens and up to ~400px wide (200px tall) on
// phones, so 800px covers 2x screens. Smaller images are not upscaled.
const urls = import.meta.glob("../assets/images/icpc/*", {
  eager: true,
  import: "default",
  query: "?w=800&format=webp"
});

// The untouched source files, for viewing a photo at its original size.
// `?url` carries no image directives, so imagetools leaves the file as is.
const originalUrls = import.meta.glob("../assets/images/icpc/*", {
  eager: true,
  import: "default",
  query: "?url"
});

/** ICPC photos keyed by file name, as referenced by the timeline data. */
const icpcImages = indexByFileName(urls);

/** The same photos at their original size, keyed the same way. */
export const icpcOriginalImages = indexByFileName(originalUrls);

export default icpcImages;
