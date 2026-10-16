import { useCallback, useState } from "react";
import "../styles/image.css";

/**
 * Responsive image from an image preset (see plugins/images.js). It reserves
 * its space from the image's aspect ratio, shows the blurred placeholder and
 * fades the lazy-loaded <picture> in once it has loaded.
 */
export default function Image({
  image,
  alt,
  title,
  className,
  style,
  imgStyle
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoaded = () => setIsLoaded(true);
  // A cached image can finish loading before React commits the <img>, in
  // which case its load event never reaches `onLoad`.
  const imageRef = useCallback(img => {
    if (img?.complete) {
      setIsLoaded(true);
    }
  }, []);
  const { width, height, images, placeholder } = image;

  return (
    <span className={className ? `image ${className}` : "image"} style={style}>
      <svg
        aria-hidden="true"
        className="image-sizer"
        width={width}
        height={height}
      />
      {placeholder && (
        <img
          aria-hidden="true"
          className="image-placeholder"
          style={{ opacity: isLoaded ? 0 : 1, ...imgStyle }}
          decoding="async"
          src={placeholder}
          alt=""
        />
      )}
      <picture>
        {images.sources.map(source => (
          <source key={source.type} {...source} />
        ))}
        <img
          ref={imageRef}
          className="image-main"
          style={{ opacity: isLoaded ? 1 : 0, ...imgStyle }}
          {...images.fallback}
          decoding="async"
          loading="lazy"
          alt={alt}
          title={title}
          onLoad={handleLoaded}
          onError={handleLoaded}
        />
      </picture>
    </span>
  );
}
