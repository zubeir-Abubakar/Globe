"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Art } from "@/components/Art";
import {
  allRegionKeys,
  localizedCategoryName,
  localizedProductName,
  type Category,
  type Locale,
  type Product,
} from "@/lib/content";
import { regionLabel, t } from "@/lib/i18n";
import { MaskedText } from "@/components/Motion";

function RegionList({
  regions,
  locale,
}: {
  regions: Product["regions"];
  locale: Locale;
}) {
  return (
    <ul className="region-list">
      {regions.map((region) => (
        <li key={region}>{regionLabel(locale, region)}</li>
      ))}
    </ul>
  );
}

function ProductTile({
  product,
  category,
  locale,
}: {
  product: Product;
  category: Category;
  locale: Locale;
}) {
  const name = localizedProductName(product, locale);
  return (
    <article className="product-card">
      <Link
        className="product-photo"
        href={`/${locale}/products/${category.id}/${product.slug}`}
        aria-label={`${name} — ${t(locale, "details")}`}
      >
        <Art
          src={product.image}
          alt={name}
          sizes="(max-width: 48rem) 50vw, (max-width: 62rem) 48vw, 32vw"
        />
      </Link>
      <div className="product-card-content">
        <div className="product-title-row">
          <MaskedText as="h2">{name}</MaskedText>
          <span className="product-category-label">
            {localizedCategoryName(category, locale)}
          </span>
        </div>
        <div className="product-origin">
          <span>{t(locale, "sourcingRegions")}</span>
          <RegionList regions={product.regions} locale={locale} />
        </div>
        <Link
          className="text-link product-card-link"
          href={`/${locale}/products/${category.id}/${product.slug}`}
        >
          {t(locale, "details")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export function ProductCatalog({
  categories,
  locale,
  selectedCategory,
}: {
  categories: Category[];
  locale: Locale;
  selectedCategory?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const regions = useMemo(() => allRegionKeys(), []);

  const filtered = useMemo(() => {
    const normalize = (value: string) => value.normalize("NFC").toLocaleLowerCase(locale);
    const term = normalize(query.trim());
    return categories.flatMap((category) =>
      category.products
        .filter((product) => {
          const matchesTerm =
            !term ||
            [
              localizedProductName(product, locale),
              localizedCategoryName(category, locale),
            ].some((value) => normalize(value).includes(term));
          const matchesRegion =
            !region || product.regions.includes(region as Product["regions"][number]);
          const matchesCategory = !selectedCategory || category.id === selectedCategory;
          return matchesTerm && matchesRegion && matchesCategory;
        })
        .map((product) => ({ category, product })),
    );
  }, [categories, locale, query, region, selectedCategory]);

  return (
    <>
      <div className="catalog-toolbar">
        <div className="catalog-filters">
          <label className="catalog-search">
            <span className="visually-hidden">{t(locale, "searchProducts")}</span>
            <input
              type="search"
              value={query}
              placeholder={t(locale, "searchProducts")}
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="catalog-select">
            <span className="visually-hidden">{t(locale, "filterRegion")}</span>
            <select value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="">
                {t(locale, "filterRegion")}: {t(locale, "all")}
              </option>
              {regions.map((key) => (
                <option value={key} key={key}>
                  {regionLabel(locale, key)}
                </option>
              ))}
            </select>
          </label>
          <label className="catalog-select">
            <span className="visually-hidden">{t(locale, "categories")}</span>
            <select
              value={selectedCategory ?? ""}
              onChange={(event) => {
                const next = event.target.value;
                router.push(
                  next ? `/${locale}/products/${next}` : `/${locale}/products`,
                );
              }}
            >
              <option value="">
                {t(locale, "categories")}: {t(locale, "all")}
              </option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {localizedCategoryName(category, locale)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <span className="catalog-count" aria-live="polite">
          {filtered.length} {t(locale, "productsCount")}
        </span>
      </div>

      {filtered.length ? (
        <div className="product-grid">
          {filtered.map(({ category, product }) => (
            <ProductTile
              key={`${category.id}-${product.slug}`}
              product={product}
              category={category}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <p>{t(locale, "noProductsMatch")}</p>
          <button
            className="text-link"
            type="button"
            onClick={() => {
              setQuery("");
              setRegion("");
              if (selectedCategory) router.push(`/${locale}/products`);
            }}
          >
            {t(locale, "clearFilters")}
          </button>
        </div>
      )}
    </>
  );
}

export function ProductDetail({
  category,
  product,
  locale,
}: {
  category: Category;
  product: Product;
  locale: Locale;
}) {
  const images = [
    { src: product.image, alt: localizedProductName(product, locale) },
    { src: category.image, alt: localizedCategoryName(category, locale) },
  ];
  const [activeImage, setActiveImage] = useState(0);
  const active = images[activeImage];
  const name = localizedProductName(product, locale);

  return (
    <section className="product-detail">
      <div className="detail-gallery">
        <div className="detail-main-image">
          <Art
            src={active.src}
            alt={active.alt}
            sizes="(max-width: 48rem) 100vw, 55vw"
            priority
          />
        </div>
        <div className="product-gallery" aria-label={name}>
          {images.map((image, index) => (
            <button
              type="button"
              key={image.src}
              aria-label={`${name} ${index + 1}`}
              aria-pressed={index === activeImage}
              onClick={() => setActiveImage(index)}
            >
              <span className="product-gallery-image">
                <Art src={image.src} alt="" sizes="80px" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="detail-copy">
        <span className="section-kicker">{localizedCategoryName(category, locale)}</span>
        <MaskedText as="h1">{name}</MaskedText>
        <p className="detail-note">{t(locale, "productNoteLabel")}</p>
        <p className="detail-description">{product.note[locale] ?? product.note.en}</p>

        <div className="availability-row">
          <strong>{t(locale, "sourcingRegions")}</strong>
          <RegionList regions={product.regions} locale={locale} />
        </div>
        <p className="detail-disclaimer">{t(locale, "sourcingNote")}</p>

        <div className="detail-actions">
          <Link
            className="button button-primary"
            href={`/${locale}/contact?enquiry=specifications&product=${encodeURIComponent(name)}`}
          >
            {t(locale, "requestSpecifications")}
          </Link>
          <Link className="text-link" href={`/${locale}/products/${category.id}`}>
            ← {t(locale, "backToCategory")}
          </Link>
        </div>
      </div>
    </section>
  );
}
