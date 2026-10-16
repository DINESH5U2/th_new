// Events and newsletters: one JSON file per post in src/content (see README).
const metas = import.meta.glob("../content/{events,newsletters}/*.json", {
  eager: true,
  import: "default",
  query: "?meta"
});
const loaders = import.meta.glob("../content/{events,newsletters}/*.json", {
  import: "default"
});

// Local images, keyed by their path relative to src/assets ("images/…").
const contentImages = import.meta.glob(
  "../assets/images/{events,newsletter}/*.{jpg,jpeg,png,webp}",
  { import: "default", query: "?preset=content" }
);
const heroImages = import.meta.glob(
  "../assets/images/{events,newsletter}/*.{jpg,jpeg,png,webp}",
  { import: "default", query: "?preset=constrained" }
);
const placeholders = import.meta.glob(
  "../assets/images/{events,newsletter}/*.{jpg,jpeg,png,webp}",
  { import: "default", query: "?preset=placeholder&placeholderWidth=20" }
);
// Posters on the events page: only their URLs are bundled, so all of them are
// at hand for the slider without loading every post.
const posterImages = import.meta.glob(
  "../assets/images/events/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
    query: "?preset=constrained&width=520"
  }
);
// Covers in the newsletter archive (3:2), URLs only as for the posters
const coverImages = import.meta.glob(
  "../assets/images/newsletter/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
    query: "?preset=constrained&width=560&height=373"
  }
);
// The stock image most newsletters name as their `image`; it says nothing
// about the edition, so it is not shown
const GENERIC_NEWSLETTER_IMAGE = "images/newsletter/img.jpeg";

const assetPath = src => `../assets/${src}`;
const collectionOf = path => path.split("/").at(-2);

const posts = Object.entries(metas).map(([path, meta]) => ({
  ...meta,
  slug: String(meta.slug),
  collection: collectionOf(path),
  path
}));

/** Metadata (everything but the body) of every event. */
export const events = posts.filter(post => post.collection === "events");

/** Metadata (everything but the body) of every newsletter. */
export const newsletters = posts.filter(
  post => post.collection === "newsletters"
);

/** Responsive data of an event's poster (its `image`), or `null`. */
export const posterOf = event =>
  (event.image && posterImages[assetPath(event.image)]) ?? null;

/** A newsletter's own picture: its `image` unless generic, else its first local image. */
export const coverOf = newsletter =>
  newsletter.image && newsletter.image !== GENERIC_NEWSLETTER_IMAGE
    ? newsletter.image
    : newsletter.summary.leadImage;

/**
 * Newsletters as numbered editions, latest first, each with `number` and its
 * `cover` (responsive data for the archive, or `null`).
 */
export const editions = newsletters
  .map(newsletter => {
    const cover = coverOf(newsletter);
    return {
      ...newsletter,
      number: Number(newsletter.slug),
      cover: (cover && coverImages[assetPath(cover)]) ?? null
    };
  })
  .sort((a, b) => b.number - a.number);

/** The slug of every post, events and newsletters. */
export const postSlugs = posts.map(post => post.slug);

async function loadImage(images, src) {
  const path = assetPath(src);
  if (!images[path]) {
    return null;
  }
  const [image, placeholder] = await Promise.all([
    images[path](),
    placeholders[path]()
  ]);
  return { ...image, placeholder };
}

/** Sources of the images a post body shows. */
function imageSources(body) {
  return body.flatMap(block => {
    switch (block.type) {
      case "image":
        return [block.src];
      case "gallery":
        return block.images.map(image => image.src);
      case "cards":
        return block.items.map(card => card.image).filter(Boolean);
      default:
        return [];
    }
  });
}

/**
 * Loads the post with the given slug: its metadata, `body`, the responsive
 * data of its local images (`images`, by source) and its `heroImage`.
 */
export async function loadPost(slug) {
  const { path, ...meta } = posts.find(post => post.slug === slug);
  const { body } = await loaders[path]();
  const sources = [...new Set(imageSources(body))];
  const [heroImage, ...images] = await Promise.all([
    meta.image && meta.image !== GENERIC_NEWSLETTER_IMAGE
      ? loadImage(heroImages, meta.image)
      : null,
    ...sources.map(src => loadImage(contentImages, src))
  ]);
  return {
    ...meta,
    body,
    heroImage,
    images: Object.fromEntries(
      sources.map((src, index) => [src, images[index]]).filter(([, i]) => i)
    )
  };
}
