import Link from "next/link";
import { headers } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "@/lib/content";
import { t } from "@/lib/i18n";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { categories, localizedCategoryName } from "@/lib/content";

export default async function LocaleNotFound() {
  const value = (await headers()).get("x-globe-locale");
  const locale: Locale = value && isLocale(value) ? value : defaultLocale;
  const navCategories = categories.map((category) => ({
    id: category.id,
    name: localizedCategoryName(category, locale),
    image: category.image,
  }));

  return (
    <div className="site-shell">
      <SiteHeader locale={locale} categories={navCategories} searchEntries={[]} />
      <main id="main-content" className="container not-found">
        <span className="section-kicker">404</span>
        <h1>{t(locale, "notFoundTitle")}</h1>
        <p>{t(locale, "notFoundCopy")}</p>
        <div className="hero-actions">
          <Link className="button button-primary" href={`/${locale}`}>
            {t(locale, "backHome")}
          </Link>
          <Link className="button button-secondary" href={`/${locale}/products`}>
            {t(locale, "products")}
          </Link>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
