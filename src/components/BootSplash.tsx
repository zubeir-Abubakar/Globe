import Image from "next/image";

/**
 * A brief, decorative brand splash on first load. It is CSS-only, has no
 * pointer interaction and disappears after ~1.4s even if JavaScript fails.
 */
export function BootSplash() {
  return (
    <div className="gh-loader" aria-hidden="true">
      <span className="gh-loader__glow" />
      <span className="gh-loader__stage">
        <Image
          className="gh-loader__logo"
          src="/brand/logo.svg"
          alt=""
          width={498}
          height={492}
          priority
          unoptimized
        />
        <span className="gh-loader__track">
          <span />
        </span>
      </span>
    </div>
  );
}
