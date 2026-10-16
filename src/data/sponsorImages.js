import { indexByOutputName } from "../utils/imageIndex";

const images = import.meta.glob("../assets/images/sponsors26/*", {
  eager: true,
  import: "default",
  query: "?preset=constrained&width=1000&height=1000&crop=contain"
});

const placeholders = import.meta.glob("../assets/images/sponsors26/*", {
  eager: true,
  import: "default",
  query:
    "?preset=placeholder&width=1000&height=1000&crop=contain&placeholderWidth=20"
});

/** Sponsor logos keyed by the `image` name used in sponsors26.json. */
const sponsorImages = indexByOutputName(images, placeholders);

export default sponsorImages;
