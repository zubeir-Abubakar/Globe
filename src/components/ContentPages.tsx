import Link from "next/link";
import { Art } from "@/components/Art";
import { MaskedText } from "@/components/Motion";
import { ProductCatalog, ProductDetail } from "@/components/ProductCatalog";
import { ContactForm } from "@/components/ContactForm";
import {
  categories,
  formatDate,
  localizedCategoryName,
  localizedProductName,
  news,
  type Category,
  type Locale,
  type NewsStory,
  type Page,
  type Product,
} from "@/lib/content";
import { t } from "@/lib/i18n";
import { site } from "@/lib/site";

function PageHero({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <div>
          <span className="section-kicker">{eyebrow}</span>
          <MaskedText as="h1">{title}</MaskedText>
        </div>
        {copy && <p>{copy}</p>}
      </div>
    </section>
  );
}

function ClosingPanel({ locale }: { locale: Locale }) {
  return (
    <section className="content-section">
      <div className="container">
        <div className="closing-panel">
          <span className="section-kicker">{t(locale, "closingKicker")}</span>
          <h2>{t(locale, "closingTitle")}</h2>
          <p>{t(locale, "closingCopy")}</p>
          <Link className="button button-primary" href={`/${locale}/contact`}>
            {t(locale, "closingAction")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProductsPage({
  locale,
  category,
}: {
  locale: Locale;
  category?: Category;
}) {
  return (
    <>
      <PageHero
        eyebrow={t(locale, "portfolioKicker")}
        title={category ? localizedCategoryName(category, locale) : t(locale, "products")}
        copy={
          category
            ? category.description[locale]
            : t(locale, "portfolioCopy")
        }
      />
      <section className="products-listing">
        <div className="container">
          <nav className="filter-list" aria-label={t(locale, "categories")}>
            <Link
              className="filter-chip"
              href={`/${locale}/products`}
              aria-current={!category ? "page" : undefined}
            >
              {t(locale, "all")}
            </Link>
            {categories.map((item) => (
              <Link
                className="filter-chip"
                href={`/${locale}/products/${item.id}`}
                key={item.id}
                aria-current={category?.id === item.id ? "page" : undefined}
              >
                {localizedCategoryName(item, locale)}
              </Link>
            ))}
          </nav>
          <ProductCatalog
            categories={categories}
            locale={locale}
            selectedCategory={category?.id}
          />
          <p className="portfolio-note">{t(locale, "sourcingNote")}</p>
        </div>
      </section>
      <ClosingPanel locale={locale} />
    </>
  );
}

export function ProductPage({
  locale,
  category,
  product,
}: {
  locale: Locale;
  category: Category;
  product: Product;
}) {
  return (
    <>
      <div className="container product-detail-wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href={`/${locale}/products`}>{t(locale, "products")}</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${locale}/products/${category.id}`}>
            {localizedCategoryName(category, locale)}
          </Link>
          <span aria-hidden="true">/</span>
          <span>{localizedProductName(product, locale)}</span>
        </nav>
        <ProductDetail category={category} product={product} locale={locale} />
      </div>

      <section className="content-section compact-section">
        <div className="container">
          <div className="rail-heading">
            <h2 className="related-title">{t(locale, "categoryDescriptionLabel")}</h2>
            <Link className="text-link" href={`/${locale}/products/${category.id}`}>
              {t(locale, "backToCategory")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="category-summary">{category.description[locale]}</p>
        </div>
      </section>
      <ClosingPanel locale={locale} />
    </>
  );
}

export function NewsPage({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        eyebrow={t(locale, "storyKicker")}
        title={t(locale, "storyTitle")}
        copy={t(locale, "storyCopy")}
      />
      <section className="archive-section">
        <div className="container">
          <p className="demo-label">{t(locale, "illustrativeNote")}</p>
          <div className="story-grid">
            {news.map((story) => (
              <article className="story-card" key={story.slug}>
                <Link className="story-image" href={`/${locale}/news/${story.slug}`}>
                  <Art src={story.image} alt="" sizes="(max-width: 48rem) 100vw, 32vw" />
                </Link>
                <div className="story-body">
                  <div className="story-meta">
                    <span>{formatDate(story.date, locale)}</span>
                  </div>
                  <h3>
                    <Link href={`/${locale}/news/${story.slug}`}>
                      {story.titles[locale]}
                    </Link>
                  </h3>
                  <p>{story.excerpt[locale]}</p>
                  <Link className="text-link" href={`/${locale}/news/${story.slug}`}>
                    {t(locale, "readMore")} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ClosingPanel locale={locale} />
    </>
  );
}

export function NewsDetailPage({
  locale,
  story,
}: {
  locale: Locale;
  story: NewsStory;
}) {
  return (
    <>
      <article className="news-article container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href={`/${locale}/news`}>{t(locale, "marketNotes")}</Link>
          <span aria-hidden="true">/</span>
          <span>{story.titles[locale]}</span>
        </nav>
        <header className="news-detail-head">
          <span className="section-kicker">
            {t(locale, "published")} · {formatDate(story.date, locale)}
          </span>
          <MaskedText as="h1">{story.titles[locale]}</MaskedText>
          <p className="news-lede">{story.excerpt[locale]}</p>
        </header>
        <div className="news-detail-image">
          <Art src={story.image} alt="" sizes="(max-width: 60rem) 100vw, 70vw" priority />
        </div>
        <div className="content-prose">
          {story.body[locale].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="demo-label">{t(locale, "illustrativeNote")}</p>
        <Link className="text-link" href={`/${locale}/news`}>
          ← {t(locale, "backToNews")}
        </Link>
      </article>
      <ClosingPanel locale={locale} />
    </>
  );
}

export function EditorialPage({ locale, page }: { locale: Locale; page: Page }) {
  return (
    <>
      <PageHero
        eyebrow={t(locale, "company")}
        title={page.title[locale]}
        copy={page.intro[locale]}
      />
      <section className="content-section compact-section">
        <div className="container editorial-page">
          <figure className="editorial-page-image">
            <Art src={page.image} alt="" sizes="(max-width: 60rem) 100vw, 45vw" />
          </figure>
          <div className="content-prose">
            {page.sections.map((section) => (
              <section key={section.heading.en}>
                <h2>{section.heading[locale]}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.en}>{paragraph[locale]}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
      <ClosingPanel locale={locale} />
    </>
  );
}

export function ContactPage({
  locale,
  initialProduct = "",
  initialEnquiry = "",
}: {
  locale: Locale;
  initialProduct?: string;
  initialEnquiry?: string;
}) {
  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: localizedCategoryName(category, locale),
  }));

  return (
    <>
      <PageHero
        eyebrow={t(locale, "contact")}
        title={t(locale, "contactHeading")}
        copy={t(locale, "contactIntro")}
      />
      <section className="contact-section">
        <div className="container">
          <ContactForm
            locale={locale}
            categories={categoryOptions}
            initialProduct={initialProduct}
            initialEnquiry={initialEnquiry}
            contactConfigured={site.contactConfigured}
            contact={{
              email: site.displayEmail,
              phone: site.displayPhone,
              address: site.address || t(locale, "addressPlaceholder"),
            }}
          />
        </div>
      </section>
    </>
  );
}
