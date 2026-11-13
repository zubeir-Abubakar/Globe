import type { ReactNode } from "react";
import {
  categories,
  localizedCategoryName,
  searchEntries,
  type Locale,
} from "@/lib/content";
import { t } from "@/lib/i18n";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const navCategories = categories.map((category) => ({
    id: category.id,
    name: localizedCategoryName(category, locale),
    image: category.image,
  }));

  const entries = searchEntries(locale, {
    categories: t(locale, "categories"),
    products: t(locale, "productsCount"),
    marketNotes: t(locale, "newsKind"),
    company: t(locale, "pageKind"),
  });

  return (
    <div className="site-shell">
      <SiteHeader locale={locale} categories={navCategories} searchEntries={entries} />
      <main id="main-content">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
