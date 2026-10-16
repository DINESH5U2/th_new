const fileName = path => path.slice(path.lastIndexOf("/") + 1);
const baseName = path => fileName(path).replace(/\.[^.]+$/, "");

const withPlaceholders = (images, placeholders) =>
  Object.entries(images).map(([path, image]) => [
    path,
    { ...image, placeholder: placeholders[path] }
  ]);

/**
 * Indexes processed images by the file name Gatsby emitted for them
 * (`<name>.jpg` for any JPEG source, `<name>.png` for PNG), which is the name
 * the JSON data files reference.
 */
export function indexByOutputName(images, placeholders) {
  return Object.fromEntries(
    withPlaceholders(images, placeholders).map(([path, image]) => [
      `${baseName(path)}.${image.format}`,
      image
    ])
  );
}

/** Indexes processed images by file name without extension (Gatsby's `File.name`). */
export function indexByName(images, placeholders) {
  return Object.fromEntries(
    withPlaceholders(images, placeholders).map(([path, image]) => [
      baseName(path),
      image
    ])
  );
}

/** Indexes plain asset URLs by file name. */
export function indexByFileName(urls) {
  return Object.fromEntries(
    Object.entries(urls).map(([path, url]) => [fileName(path), url])
  );
}
