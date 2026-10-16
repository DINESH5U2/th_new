/**
 * Presets for vite-imagetools. They keep the image sizes, crops, formats and
 * srcsets the site had under Gatsby (gatsby-plugin-sharp).
 *
 * Usage (query string on an image import):
 *   ?preset=constrained[&width=350][&height=400][&crop=cover|contain][&quality=90]
 *       -> responsive image data for <Image> (see `responsiveOutput`)
 *   ?preset=placeholder&placeholderWidth=20[&width=..][&height=..][&crop=..]
 *       -> base64 data URI of the blurred placeholder (same crop as above)
 *   ?preset=content
 *       -> responsive image data sized for images inside a post (event, newsletter)
 *          (max width 1200, quality 90, source format only)
 *
 * Imports without a preset take plain imagetools directives, e.g. `?w=80&format=webp`.
 */

const PIXEL_DENSITIES = [0.25, 0.5, 1, 2];
const DEFAULT_QUALITY = 50;
const CONTENT_MAX_WIDTH = 1200;
const CONTENT_QUALITY = 90;

const sortNumeric = (a, b) => a - b;

const toNumber = value => (value ? Number(value) : undefined);

/** Output files are named by format, with `jpeg` shortened to `jpg`. */
const normalizeFormat = format => (format === "jpeg" ? "jpg" : format);

/** Widths and layout box of a constrained image (gatsby-plugin-image's `responsiveImageSizes`). */
function constrainedSizes(source, { width, height, fit = "cover" }) {
  const requestedWidth = width;
  let aspectRatio = source.width / source.height;

  if (width && height) {
    if (fit === "contain") {
      const ratio = Math.min(width / source.width, height / source.height);
      width = Math.round(source.width * ratio);
      height = Math.round(source.height * ratio);
    }
    aspectRatio = width / height;
  }

  width = width && Math.min(width, source.width);
  height = height && Math.min(height, source.height);

  if (!width && !height) {
    width = source.width;
    height = source.height;
  }
  if (!width) {
    width = height * aspectRatio;
  }

  const presentationWidth = width;
  if (source.width < width || source.height < height) {
    width = source.width;
  }
  width = Math.round(width);

  const sizes = PIXEL_DENSITIES.map(density =>
    Math.round(density * width)
  ).filter(size => size <= source.width);
  if (!sizes.includes(width)) {
    sizes.push(width);
  }

  // The wrapper is laid out at the requested width (or the fallback image's
  // width), with the aspect ratio of the generated fallback image.
  const layoutWidth = requestedWidth || presentationWidth;
  const fallbackHeight = Math.round(width / aspectRatio);

  return {
    sizes: sizes.sort(sortNumeric),
    aspectRatio,
    presentationWidth,
    layoutWidth,
    layoutHeight: layoutWidth / (width / fallbackHeight),
    fallbackWidth: width
  };
}

/** Widths and layout box of an image inside a post (gatsby-plugin-sharp's `fluid()`). */
function fluidSizes(source, maxWidth) {
  const presentationWidth = Math.min(maxWidth, source.width);
  const sizes = [
    maxWidth / 4,
    maxWidth / 2,
    maxWidth,
    maxWidth * 1.5,
    maxWidth * 2
  ]
    .filter(size => size < source.width)
    .concat(source.width)
    .sort(sortNumeric);

  // the aspect ratio is taken from the smallest generated image
  const smallest = sizes[0];
  const smallestHeight = Math.round(smallest / (source.width / source.height));

  return {
    sizes,
    presentationWidth,
    layoutWidth: presentationWidth,
    layoutHeight: presentationWidth * (smallestHeight / smallest),
    fallbackWidth: sizes.includes(maxWidth) ? maxWidth : source.width
  };
}

/** `defaultDirectives` hook: expands a `preset` into concrete imagetools directives. */
async function presetDirectives(url, getMetadata) {
  const params = url.searchParams;
  const preset = params.get("preset");
  if (!preset) {
    return new URLSearchParams();
  }

  const metadata = await getMetadata();
  const source = {
    width: metadata.autoOrient?.width ?? metadata.width,
    height: metadata.autoOrient?.height ?? metadata.height
  };
  const { format } = metadata;
  const directives = { allowUpscale: "true" };

  if (preset === "constrained" || preset === "placeholder") {
    const requested = {
      width: toNumber(params.get("width")),
      height: toNumber(params.get("height")),
      fit: params.get("crop") ?? "cover"
    };
    const layout = constrainedSizes(source, requested);

    directives.aspect = String(layout.aspectRatio);
    if (requested.width && requested.height && requested.fit === "cover") {
      directives.fit = "cover";
      // crop around the most interesting region, as gatsby-plugin-sharp did
      directives.position = "attention";
    }

    if (preset === "placeholder") {
      directives.w = params.get("placeholderWidth");
      directives.format = format === "png" ? "png" : "jpeg";
      directives.inline = "";
      return new URLSearchParams(directives);
    }

    return new URLSearchParams({
      ...directives,
      w: layout.sizes.join(";"),
      format: format === "webp" ? "webp" : `webp;${format}`,
      quality: params.get("quality") ?? String(DEFAULT_QUALITY),
      as: "responsive",
      layoutWidth: String(layout.layoutWidth),
      layoutHeight: String(layout.layoutHeight),
      fallbackWidth: String(layout.fallbackWidth),
      sizes: `(min-width: ${layout.presentationWidth}px) ${layout.presentationWidth}px, 100vw`
    });
  }

  if (preset === "content") {
    const layout = fluidSizes(source, CONTENT_MAX_WIDTH);
    return new URLSearchParams({
      ...directives,
      w: layout.sizes.join(";"),
      format,
      quality: String(CONTENT_QUALITY),
      as: "responsive",
      layoutWidth: String(layout.layoutWidth),
      layoutHeight: String(layout.layoutHeight),
      fallbackWidth: String(layout.fallbackWidth),
      sizes: `(max-width: ${layout.presentationWidth}px) 100vw, ${layout.presentationWidth}px`
    });
  }

  throw new Error(`Unknown image preset "${preset}" in ${url.pathname}`);
}

const toSrcSet = images =>
  images.map(image => `${image.src} ${image.info.width}w`).join(", ");

/**
 * Output format `as=responsive`: `{ width, height, format, images }`, where
 * `images.fallback` is the source-format <img> and `images.sources` the
 * <source> elements for the other formats.
 */
const responsiveOutput = () => metadatas => {
  const { layoutWidth, layoutHeight, fallbackWidth, sizes } =
    metadatas[0].config;
  const byFormat = Map.groupBy(metadatas, metadata =>
    normalizeFormat(metadata.transforms.format)
  );
  for (const images of byFormat.values()) {
    images.sort((a, b) => a.info.width - b.info.width);
  }

  // the fallback is the source format; webp is only a fallback for webp sources
  const fallbackFormat =
    [...byFormat.keys()].find(format => format !== "webp") ?? "webp";
  const fallbackImages = byFormat.get(fallbackFormat);
  const fallback =
    fallbackImages.find(image => image.info.width === Number(fallbackWidth)) ??
    fallbackImages.at(-1);

  return {
    width: Number(layoutWidth),
    height: Number(layoutHeight),
    format: fallbackFormat,
    images: {
      fallback: { src: fallback.src, srcSet: toSrcSet(fallbackImages), sizes },
      sources: [...byFormat.entries()]
        .filter(([format]) => format !== fallbackFormat)
        .map(([format, images]) => ({
          srcSet: toSrcSet(images),
          type: `image/${format}`,
          sizes
        }))
    }
  };
};

export const imagetoolsOptions = {
  // also match upper-case extensions such as `.JPG`
  include: /^[^?]+\.(avif|heif|jpeg|jpg|png|tiff|webp)(\?.*)?$/i,
  defaultDirectives: presetDirectives,
  extendOutputFormats: builtins => ({
    ...builtins,
    responsive: responsiveOutput
  })
};
