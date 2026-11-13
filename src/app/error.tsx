"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/lib/content";
import { t } from "@/lib/i18n";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const first = pathname?.split("/")[1] ?? "";
  const locale: Locale = isLocale(first) ? first : defaultLocale;

  return (
    <main className="standalone-state">
      <span className="section-kicker">{t(locale, "errorTitle")}</span>
      <h1>{t(locale, "errorTitle")}</h1>
      <p>{t(locale, "errorCopy")}</p>
      <div className="hero-actions">
        <button className="button button-primary" type="button" onClick={reset}>
          {t(locale, "tryAgain")}
        </button>
        <Link className="button button-secondary" href={`/${locale}`}>
          {t(locale, "backHome")}
        </Link>
      </div>
      {error.digest && (
        <p className="field-hint">
          Reference: {error.digest}. {t(locale, "errorHint")}
        </p>
      )}
    </main>
  );
}
