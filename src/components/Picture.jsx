import { Box } from "@mui/material";

/**
 * Responsive image data (an image preset, see plugins/images.js) as a
 * <picture> that fills its box with `objectFit`. Lazy unless `eager`.
 */
export default function Picture({
  image,
  alt = "",
  objectFit = "cover",
  eager = false,
  sizes,
  sx,
  imgSx
}) {
  return (
    <Box component="picture" sx={{ display: "block", ...sx }}>
      {image.images.sources.map(source => (
        <source key={source.type} {...source} sizes={sizes ?? source.sizes} />
      ))}
      <Box
        component="img"
        {...image.images.fallback}
        sizes={sizes ?? image.images.fallback.sizes}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        sx={{
          display: "block",
          width: 1,
          height: 1,
          objectFit,
          ...imgSx
        }}
      />
    </Box>
  );
}
