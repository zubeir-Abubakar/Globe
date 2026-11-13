import Image from "next/image";
import Link from "next/link";
import { FooterLanguage } from "@/components/FooterLanguage";
import {
  categories,
  localizedCategoryName,
  type Locale,
} from "@/lib/content";
import { t } from "@/lib/i18n";
import { site } from "@/lib/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const productLinks = [
    { href: `/${locale}/products`, label: t(locale, "products") },
    ...categories.slice(0, 4).map((category) => ({
      href: `/${locale}/products/${category.id}`,
      label: localizedCategoryName(category, locale),
    })),
  ];
  const companyLinks = [
    { href: `/${locale}/company`, label: t(locale, "company") },
    { href: `/${locale}/quality`, label: t(locale, "quality") },
    { href: `/${locale}/sustainability`, label: t(locale, "sustainability") },
    { href: `/${locale}/cooperation`, label: t(locale, "cooperationEnquiry") },
    { href: `/${locale}/careers`, label: t(locale, "careers") },
  ];
  const resourceLinks = [
    { href: `/${locale}/news`, label: t(locale, "news") },
    { href: `/${locale}/contact`, label: t(locale, "contact") },
    { href: `/${locale}/legal`, label: t(locale, "legal") },
    { href: `/${locale}/privacy`, label: t(locale, "privacyPolicy") },
  ];

  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link href={`/${locale}`} aria-label={site.name}>
            <Image
              src="/brand/logo-horizontal-inverse.svg"
              alt=""
              width={630}
              height={160}
              unoptimized
            />
          </Link>
          <p>{t(locale, "footerTagline")}</p>
          <p className="footer-demo">{t(locale, "demonstrationNotice")}</p>
          <FooterLanguage locale={locale} />
        </div>

        <nav className="footer-nav" aria-label={t(locale, "siteNavigation")}>
          <div>
            <h2>{t(locale, "products")}</h2>
            {productLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h2>{t(locale, "company")}</h2>
            {companyLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h2>{t(locale, "footerResources")}</h2>
            {resourceLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="footer-contact">
            <h2>{t(locale, "footerContact")}</h2>
            <a href={`mailto:${site.displayEmail}`}>{site.displayEmail}</a>
            <a href={`tel:${site.displayPhone.replace(/[^+\d]/g, "")}`}>
              {site.displayPhone}
            </a>
            <address>{site.address || t(locale, "addressPlaceholder")}</address>
            {(site.social.linkedin || site.social.instagram) && (
              <div className="footer-social">
                {site.social.linkedin && (
                  <a href={site.social.linkedin} target="_blank" rel="noreferrer">
                    {t(locale, "linkedin")} ↗
                  </a>
                )}
                {site.social.instagram && (
                  <a href={site.social.instagram} target="_blank" rel="noreferrer">
                    {t(locale, "instagram")} ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="container footer-bottom">
        <span>
          © {year} {site.name}. {t(locale, "rightsReserved")}
        </span>
        <a href="#main-content">{t(locale, "backToTop")} ↑</a>
      </div>
    </footer>
  );
}
