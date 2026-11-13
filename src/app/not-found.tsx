import Link from "next/link";

export default function NotFound() {
  return (
    <main className="standalone-state">
      <span className="section-kicker">404</span>
      <h1>This page is out of season.</h1>
      <p>The page may have moved, or the link may be out of date.</p>
      <Link className="button button-primary" href="/en">
        Back to Globe Harvest
      </Link>
    </main>
  );
}
