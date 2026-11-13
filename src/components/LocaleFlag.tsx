import type { Locale } from "@/lib/content";

export function LocaleFlag({ locale }: { locale: Locale }) {
  return (
    <svg
      className="locale-flag"
      viewBox="0 0 24 16"
      aria-hidden="true"
      focusable="false"
    >
      {locale === "en" && (
        <>
          <rect width="24" height="16" fill="#012169" />
          <path d="M0 0 24 16 M24 0 0 16" stroke="#fff" strokeWidth="4.8" />
          <path d="M0 0 24 16 M24 0 0 16" stroke="#C8102E" strokeWidth="1.9" />
          <path d="M12 0v16 M0 8h24" stroke="#fff" strokeWidth="6.4" />
          <path d="M12 0v16 M0 8h24" stroke="#C8102E" strokeWidth="3.4" />
        </>
      )}
      {locale === "de" && (
        <>
          <rect width="24" height="5.34" fill="#000" />
          <rect y="5.33" width="24" height="5.34" fill="#DD0000" />
          <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
        </>
      )}
      {locale === "fr" && (
        <>
          <rect width="24" height="16" fill="#fff" />
          <rect width="8" height="16" fill="#0055A4" />
          <rect x="16" width="8" height="16" fill="#EF4135" />
        </>
      )}
      {locale === "it" && (
        <>
          <rect width="24" height="16" fill="#fff" />
          <rect width="8" height="16" fill="#009246" />
          <rect x="16" width="8" height="16" fill="#CE2B37" />
        </>
      )}
      {locale === "es" && (
        <>
          <rect width="24" height="16" fill="#AA151B" />
          <rect y="4" width="24" height="8" fill="#F1BF00" />
        </>
      )}
    </svg>
  );
}
