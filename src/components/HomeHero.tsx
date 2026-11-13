import Link from "next/link";
import { MaskedText, Reveal } from "@/components/Motion";
import { Photo } from "@/components/Photo";
import type { Locale } from "@/lib/content";
import { t } from "@/lib/i18n";

export function HomeHero({ locale }: { locale: Locale }) {
  return (
    <section className="hh-hero">
      <div className="container">
        <div className="hh-hero-frame">
          <Photo
            src="/photos/hero.jpg"
            alt={t(locale, "heroPhotoAlt")}
            sizes="(max-width: 48rem) 100vw, 92vw"
            priority
            className="hh-hero-img"
          />
          <div className="hh-hero-content">
            <Reveal as="span" className="hh-eyebrow">
              <span className="color-mark" aria-hidden="true" />
              {t(locale, "homeEyebrow")}
            </Reveal>
            <MaskedText as="h1">{t(locale, "heroTitle")}</MaskedText>
            <Reveal as="p" delay={120}>
              {t(locale, "heroCopy")}
            </Reveal>
            <Reveal className="hh-hero-actions" delay={220}>
              <Link className="button button-primary" href={`/${locale}/products`}>
                {t(locale, "heroPrimary")}
              </Link>
              <Link className="button button-secondary" href={`/${locale}/contact`}>
                {t(locale, "heroSecondary")}
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
