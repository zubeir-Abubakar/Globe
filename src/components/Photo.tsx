import Image from "next/image";

export function Photo({
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
      className={className}
    />
  );
}
