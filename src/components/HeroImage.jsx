import Image from "./Image";

// Tallest a hero may be; taller (portrait) images are shown narrower instead.
const MAX_HEIGHT = 480;

/**
 * The image at the top of an event or newsletter, shown whole: its box keeps
 * the image's own aspect ratio, so nothing is cropped. It is as wide as the
 * page allows, but never wider than the image itself (no blurry upscaling)
 * and never taller than MAX_HEIGHT; it is centred when narrower than the page.
 * With `fullWidth` it always spans the page, scaling the image up if needed.
 */
export default function HeroImage({ image, alt, fullWidth = false }) {
  const aspectRatio = image.width / image.height;
  const maxWidth = fullWidth
    ? "none"
    : Math.min(image.width, Math.round(MAX_HEIGHT * aspectRatio));

  return (
    <Image
      className="hero-image"
      style={{ maxWidth }}
      image={image}
      alt={alt}
    />
  );
}
