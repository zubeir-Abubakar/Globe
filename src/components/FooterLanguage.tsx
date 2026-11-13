"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocaleFlag } from "@/components/LocaleFlag";
import { locales, type Locale } from "@/lib/content";
import { languageNames, t } from "@/lib/i18n";

export function FooterLanguage({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;
  const rest = pathname.replace(/^\/(en|de|fr|it|es)(?=\/|$)/, "");

  return (
    <div className="footer-language">
      <span className="footer-language-label">{t(locale, "preferredLanguage")}</span>
      <div className="footer-language-links">
        {locales.map((code) => (
          <Link
            href={`/${code}${rest}`}
            key={code}
            aria-current={code === locale ? "true" : undefined}
            title={languageNames[code]}
            hrefLang={code}
          >
            <LocaleFlag locale={code} />
            <span>{code.toUpperCase()}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
