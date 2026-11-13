import Image from "next/image";

/**
 * Local SVG illustrations are vector assets: they are served as-is rather than
 * passing through the raster image optimiser.
 */
export function Art({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 48rem) 100vw, 50vw"}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}
