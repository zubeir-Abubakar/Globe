"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { LocaleFlag } from "@/components/LocaleFlag";
import type { Locale } from "@/lib/content";
import { languageNames, t } from "@/lib/i18n";

type NavCategory = { id: string; name: string; image: string };
type SearchEntry = { title: string; description: string; href: string; kind: string };

const languageOptions: Locale[] = ["en", "de", "fr", "it", "es"];

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

export function SiteHeader({
  locale,
  categories,
  searchEntries,
}: {
  locale: Locale;
  categories: NavCategory[];
  searchEntries: SearchEntry[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const productPopoverRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  const isCurrent = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase(locale);
    if (!term) return searchEntries.slice(0, 7);
    return searchEntries
      .filter((entry) =>
        `${entry.title} ${entry.description} ${entry.kind}`
          .toLocaleLowerCase(locale)
          .includes(term),
      )
      .slice(0, 12);
  }, [locale, query, searchEntries]);

  useEffect(() => {
    if (!searchOpen && !mobileOpen && !languageOpen && !productsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const wasMobile = mobileOpen;
      setSearchOpen(false);
      setMobileOpen(false);
      setLanguageOpen(false);
      setProductsOpen(false);
      if (wasMobile) menuToggleRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [languageOpen, mobileOpen, productsOpen, searchOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document
      .querySelector<HTMLElement>("#primary-navigation a, #primary-navigation button")
      ?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!productsOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !productPopoverRef.current?.contains(event.target)
      ) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [productsOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(
      () => document.getElementById("site-search-input")?.focus(),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  function changeLanguage(nextLocale: Locale) {
    const parts = (pathname || `/${locale}`).split("/");
    parts[1] = nextLocale;
    router.push(
      `${parts.join("/") || `/${nextLocale}`}${window.location.search}${window.location.hash}`,
    );
    setLanguageOpen(false);
    setMobileOpen(false);
  }

  function closeMenus() {
    setMobileOpen(false);
    setProductsOpen(false);
    setLanguageOpen(false);
  }

  const navLinks = [
    { href: `/${locale}/company`, label: t(locale, "company") },
    { href: `/${locale}/quality`, label: t(locale, "quality") },
    { href: `/${locale}/sustainability`, label: t(locale, "sustainability") },
    { href: `/${locale}/news`, label: t(locale, "news") },
    { href: `/${locale}/careers`, label: t(locale, "careers") },
    { href: `/${locale}/contact`, label: t(locale, "contact") },
  ];

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t(locale, "skipToContent")}
      </a>
      <header className="site-header" data-scrolled={scrolled} data-mobile-open={mobileOpen}>
        <div className="container">
          <div className="nav-glass">
            <Link
              className="brand"
              href={`/${locale}`}
              aria-label="Globe Harvest"
              onClick={closeMenus}
            >
              <Image
                src="/brand/logo-horizontal.svg"
                alt=""
                width={630}
                height={160}
                priority
                unoptimized
              />
            </Link>

            <nav
              id="primary-navigation"
              className="nav-links"
              aria-label={t(locale, "siteNavigation")}
              data-open={mobileOpen}
            >
              <button className="mobile-drawer-close" type="button" onClick={closeMenus}>
                {t(locale, "closeMenu")}
              </button>

              <div className="nav-popover product-popover" ref={productPopoverRef}>
                <button
                  className="nav-link nav-products-toggle"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={productsOpen}
                  aria-controls="product-mega-menu"
                  aria-current={isCurrent(`/${locale}/products`) ? "page" : undefined}
                  onClick={() => setProductsOpen((open) => !open)}
                >
                  {t(locale, "products")}
                  <span className="products-chevron" aria-hidden="true">
                    ⌄
                  </span>
                </button>
                <div className="mega-menu" id="product-mega-menu" hidden={!productsOpen}>
                  <div className="mega-menu-heading">
                    <span className="section-kicker">{t(locale, "categories")}</span>
                    <Link
                      className="mega-menu-all"
                      href={`/${locale}/products`}
                      onClick={closeMenus}
                    >
                      {t(locale, "viewAllProducts")} <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                  <div className="mega-menu-grid">
                    {categories.map((category) => (
                      <Link
                        className="mega-menu-link"
                        href={`/${locale}/products/${category.id}`}
                        key={category.id}
                        onClick={closeMenus}
                      >
                        <Image
                          src={category.image}
                          alt=""
                          width={64}
                          height={64}
                          unoptimized
                        />
                        <strong>{category.name}</strong>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {navLinks.map((link) => (
                <Link
                  className="nav-link"
                  href={link.href}
                  key={link.href}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  onClick={closeMenus}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                className="button button-primary mobile-nav-contact"
                href={`/${locale}/contact`}
                onClick={closeMenus}
              >
                {t(locale, "getInTouch")}
              </Link>

              <div className="mobile-language">
                <span className="mobile-language-label">
                  {t(locale, "preferredLanguage")}
                </span>
                <div className="mobile-language-options">
                  {languageOptions.map((option) => (
                    <button
                      className="mobile-language-option"
                      type="button"
                      key={option}
                      aria-current={option === locale}
                      aria-label={languageNames[option]}
                      onClick={() => changeLanguage(option)}
                    >
                      <LocaleFlag locale={option} />
                      <span>{option.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            <div className="nav-actions">
              <div className="nav-popover">
                <button
                  className="nav-action nav-locale"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={languageOpen}
                  aria-controls="language-menu"
                  aria-label={`${t(locale, "preferredLanguage")}: ${languageNames[locale]}`}
                  onClick={() => setLanguageOpen((open) => !open)}
                >
                  <LocaleFlag locale={locale} />
                  {locale.toUpperCase()} <span aria-hidden="true">⌄</span>
                </button>
                <div className="language-menu" id="language-menu" hidden={!languageOpen}>
                  {languageOptions.map((option) => (
                    <button
                      className="language-option"
                      type="button"
                      key={option}
                      aria-current={option === locale}
                      onClick={() => changeLanguage(option)}
                    >
                      <LocaleFlag locale={option} />
                      <span className="language-code">{option.toUpperCase()}</span>
                      <span>{languageNames[option]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="nav-action search-trigger"
                type="button"
                aria-label={t(locale, "openSearch")}
                onClick={() => {
                  setSearchOpen(true);
                  closeMenus();
                }}
              >
                <SearchIcon />
                <span className="search-word">{t(locale, "search")}</span>
              </button>

              <Link
                className="button button-primary nav-contact"
                href={`/${locale}/contact`}
                onClick={closeMenus}
              >
                {t(locale, "getInTouch")}
              </Link>

              <button
                className="menu-toggle"
                type="button"
                id="mobile-menu-toggle"
                ref={menuToggleRef}
                aria-label={mobileOpen ? t(locale, "closeMenu") : t(locale, "openMenu")}
                aria-expanded={mobileOpen}
                aria-controls="primary-navigation"
                onClick={() => setMobileOpen((open) => !open)}
              >
                <span aria-hidden="true">{mobileOpen ? "×" : "☰"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <button
          className="mobile-nav-scrim"
          type="button"
          aria-label={t(locale, "closeMenu")}
          onClick={closeMenus}
        />
      )}

      {searchOpen && (
        <div
          className="search-dialog"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSearchOpen(false);
          }}
        >
          <section
            className="search-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-title"
          >
            <h2 className="visually-hidden" id="search-title">
              {t(locale, "search")}
            </h2>
            <div className="search-input-wrap">
              <SearchIcon />
              <input
                autoComplete="off"
                id="site-search-input"
                type="search"
                value={query}
                placeholder={t(locale, "searchPlaceholder")}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                className="icon-button"
                type="button"
                aria-label={t(locale, "closeSearch")}
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                }}
              >
                ×
              </button>
            </div>
            <div
              className="search-results"
              role="listbox"
              aria-label={t(locale, "search")}
            >
              {results.length ? (
                results.map((entry) => (
                  <Link
                    className="search-result"
                    href={entry.href}
                    key={`${entry.kind}-${entry.href}`}
                    role="option"
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                    }}
                  >
                    <strong>{entry.title}</strong>
                    <small>
                      {entry.kind}
                      {entry.description ? ` · ${entry.description}` : ""}
                    </small>
                  </Link>
                ))
              ) : (
                <p className="search-empty">{t(locale, "noProductsMatch")}</p>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
