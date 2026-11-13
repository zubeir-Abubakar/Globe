import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { MaskedText, Reveal } from "@/components/Motion";
import { Photo } from "@/components/Photo";
import {
  categories,
  localizedCategoryName,
  localizedProductName,
  productBySlug,
  type Locale,
} from "@/lib/content";
import { t } from "@/lib/i18n";
import { categoryPhotos, featuredLines } from "@/lib/photos";

function QualityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="9" r="5" />
      <path d="m9.2 13.4-1.1 6 3.9-2 3.9 2-1.1-6" />
      <path d="m10.3 9.1 1.2 1.2 2.3-2.4" />
    </svg>
  );
}

function SourcingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.7 12h16.6M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5S9.6 5.9 12 3.5Z" />
    </svg>
  );
}

function PartnershipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="9" cy="12" r="5.2" />
      <circle cx="15" cy="12" r="5.2" />
      <path d="M9 7.2v9.6M15 7.2v9.6" opacity=".35" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 20v-8" />
      <path d="M12 12c0-3.4 2.4-5.8 6.2-5.8 0 3.5-2.4 5.8-6.2 5.8Z" />
      <path d="M12 15.5C8.3 15.5 6 13.2 6 9.7c3.7 0 6 2.3 6 5.8Z" />
    </svg>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const values = [
    {
      title: t(locale, "valueQuality"),
      copy: t(locale, "valueQualityCopy"),
      Icon: QualityIcon,
    },
    {
      title: t(locale, "valueSourcing"),
      copy: t(locale, "valueSourcingCopy"),
      Icon: SourcingIcon,
    },
    {
      title: t(locale, "valuePartnerships"),
      copy: t(locale, "valuePartnershipsCopy"),
      Icon: PartnershipIcon,
    },
    {
      title: t(locale, "valueGrowth"),
      copy: t(locale, "valueGrowthCopy"),
      Icon: GrowthIcon,
    },
  ];

  return (
    <>
      <HomeHero locale={locale} />

      <section className="hh-section hh-catalogue">
        <div className="container">
          <div className="hh-section-head">
            <div>
              <Reveal as="span" className="section-kicker">
                {t(locale, "portfolioKicker")}
              </Reveal>
              <MaskedText as="h2">{t(locale, "portfolioTitle")}</MaskedText>
            </div>
            <Reveal className="hh-section-aside" delay={100}>
              <p>{t(locale, "portfolioCopy")}</p>
              <Link className="hh-arrow-link" href={`/${locale}/products`}>
                {t(locale, "viewAllProducts")} <span aria-hidden="true">↗</span>
              </Link>
            </Reveal>
          </div>

          <div className="hh-category-grid">
            {categories.map((category, index) => (
              <Reveal
                className="hh-category-cell"
                delay={Math.min(index * 45, 320)}
                key={category.id}
              >
                <Link
                  className="hh-category-card"
                  href={`/${locale}/products/${category.id}`}
                >
                  <Photo
                    src={categoryPhotos[category.id] ?? category.image}
                    alt={localizedCategoryName(category, locale)}
                    sizes="(max-width: 48rem) 50vw, (max-width: 68rem) 33vw, 18vw"
                    className={`hh-card-img hh-card-img--${category.id}`}
                  />
                  <span className="hh-category-shade" aria-hidden="true" />
                  <span className="hh-category-body">
                    <strong>{localizedCategoryName(category, locale)}</strong>
                    <span className="hh-category-arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="hh-section hh-company">
        <div className="container hh-company-grid">
          <Reveal className="hh-company-media reveal-media">
            <Photo
              src="/photos/company.jpg"
              alt={t(locale, "companyPhotoAlt")}
              sizes="(max-width: 60rem) 100vw, 48vw"
              className="hh-company-img"
            />
            <span className="hh-photo-tag">
              <span className="color-mark" aria-hidden="true" />
              {t(locale, "homeEyebrow")}
            </span>
          </Reveal>

          <div className="hh-company-copy">
            <Reveal as="span" className="section-kicker">
              {t(locale, "introKicker")}
            </Reveal>
            <MaskedText as="h2">{t(locale, "introTitle")}</MaskedText>
            <Reveal as="p" delay={90}>
              {t(locale, "introCopy")}
            </Reveal>
            <Reveal as="ul" className="hh-points" delay={150}>
              <li>{t(locale, "introPoint1")}</li>
              <li>{t(locale, "introPoint2")}</li>
              <li>{t(locale, "introPoint3")}</li>
            </Reveal>
            <Reveal delay={210}>
              <Link className="hh-arrow-link" href={`/${locale}/company`}>
                {t(locale, "company")} <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="hh-values">
        <div className="container">
          <div className="hh-values-grid">
            {values.map(({ title, copy, Icon }, index) => (
              <Reveal className="hh-value" delay={index * 90} key={title}>
                <span className="hh-value-icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="hh-section hh-featured">
        <div className="container">
          <div className="hh-section-head">
            <div>
              <Reveal as="span" className="section-kicker">
                {t(locale, "featuredKicker")}
              </Reveal>
              <MaskedText as="h2">{t(locale, "featuredTitle")}</MaskedText>
            </div>
            <Reveal className="hh-section-aside" delay={100}>
              <p>{t(locale, "featuredCopy")}</p>
              <Link className="hh-arrow-link" href={`/${locale}/products`}>
                {t(locale, "viewAllProducts")} <span aria-hidden="true">↗</span>
              </Link>
            </Reveal>
          </div>

          <div className="hh-featured-grid">
            {featuredLines.map((line, index) => {
              const category = categories.find((item) => item.id === line.categoryId);
              const product = category
                ? productBySlug(category, line.productSlug)
                : undefined;
              if (!category || !product) return null;
              const productName = localizedProductName(product, locale);
              const href = `/${locale}/products/${category.id}/${product.slug}`;

              return (
                <Reveal as="article" className="hh-product-card" delay={index * 80} key={product.slug}>
                  <Link className="hh-product-media" href={href} tabIndex={-1}>
                    <Photo
                      src={line.photo}
                      alt={productName}
                      sizes="(max-width: 34rem) 40vw, (max-width: 60rem) 50vw, 24vw"
                      className="hh-card-img"
                    />
                  </Link>
                  <div className="hh-product-body">
                    <span className="hh-product-category">
                      {localizedCategoryName(category, locale)}
                    </span>
                    <h3>
                      <Link href={href}>{productName}</Link>
                    </h3>
                    <p>{product.note[locale]}</p>
                    <Link className="text-link" href={href}>
                      {t(locale, "details")} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hh-cta-section">
        <div className="container">
          <Reveal className="hh-cta-frame reveal-media">
            <Photo
              src="/photos/cta.jpg"
              alt={t(locale, "ctaPhotoAlt")}
              sizes="(max-width: 48rem) 100vw, 92vw"
              className="hh-cta-img"
            />
            <div className="hh-cta-content">
              <Reveal as="span" className="hh-eyebrow">
                {t(locale, "closingKicker")}
              </Reveal>
              <MaskedText as="h2">{t(locale, "closingTitle")}</MaskedText>
              <Reveal as="p" delay={100}>
                {t(locale, "closingCopy")}
              </Reveal>
              <Reveal delay={190}>
                <Link className="button button-light" href={`/${locale}/contact`}>
                  {t(locale, "closingAction")}
                </Link>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
