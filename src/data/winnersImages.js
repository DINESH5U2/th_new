import { indexByName } from "../utils/imageIndex";

const images = import.meta.glob("../assets/images/turingcup-winners/*", {
  eager: true,
  import: "default",
  query: "?preset=constrained&width=600&height=400"
});

const placeholders = import.meta.glob("../assets/images/turingcup-winners/*", {
  eager: true,
  import: "default",
  query: "?preset=placeholder&width=600&height=400&placeholderWidth=20"
});

/** Turing Cup winners photos (600x400, cropped) keyed by file name without extension. */
const winnersImages = indexByName(images, placeholders);

export default winnersImages;
