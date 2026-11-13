import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ContactPage,
  EditorialPage,
  NewsDetailPage,
  NewsPage,
  ProductPage,
  ProductsPage,
} from "@/components/ContentPages";
import { HomePage } from "@/components/HomePage";
import { SiteShell } from "@/components/SiteShell";
import {
  categories,
  categoryById,
  isLocale,
  localizedCategoryName,
  localizedProductName,
  locales,
  news,
  newsBySlug,
  pageByPath,
  pages,
  productBySlug,
  type Locale,
} from "@/lib/content";
import { t } from "@/lib/i18n";

type RouteParams = { locale: string; segments?: string[] };
type PageProps = {
  params: Promise<RouteParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ogLocales: Record<Locale, string> = {
  en: "en_GB",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  es: "es_ES",
};

const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Globe Harvest — premium fresh produce import and export",
};

function alternates(locale: Locale, path: string) {
  const suffix = path ? `/${path}` : "";
  return {
    canonical: `/${locale}${suffix}`,
    languages: {
      ...Object.fromEntries(locales.map((code) => [code, `/${code}${suffix}`])),
      "x-default": `/en${suffix}`,
    },
  };
}

function routeMetadata(locale: Locale, segments: string[]): Metadata {
  const siteDescription = t(locale, "heroCopy");

  if (!segments.length) {
    return {
      title: {
        absolute: "Globe Harvest — Premium Fresh Produce Import & Export",
      },
      description: siteDescription,
      alternates: alternates(locale, ""),
      openGraph: {
        locale: ogLocales[locale],
        url: `/${locale}`,
        title: "Globe Harvest — Premium Fresh Produce Import & Export",
        description: siteDescription,
        images: [ogImage],
      },
    };
  }

  if (segments[0] === "products") {
    const category = segments[1] ? categoryById(segments[1]) : undefined;
    const product = category && segments[2] ? productBySlug(category, segments[2]) : undefined;
    if (product) {
      return {
        title: localizedProductName(product, locale),
        description: product.note[locale],
        alternates: alternates(locale, `products/${category!.id}/${product.slug}`),
        openGraph: { locale: ogLocales[locale], type: "article", images: [ogImage] },
      };
    }
    if (category) {
      return {
        title: localizedCategoryName(category, locale),
        description: category.description[locale],
        alternates: alternates(locale, `products/${category.id}`),
        openGraph: { locale: ogLocales[locale], images: [ogImage] },
      };
    }
    return {
      title: t(locale, "products"),
      description: siteDescription,
      alternates: alternates(locale, "products"),
      openGraph: { locale: ogLocales[locale], images: [ogImage] },
    };
  }

  if (segments[0] === "news") {
    const story = segments[1] ? newsBySlug(segments[1]) : undefined;
    return {
      title: story ? story.titles[locale] : t(locale, "marketNotes"),
      description: story ? story.excerpt[locale] : t(locale, "storyCopy"),
      alternates: alternates(locale, story ? `news/${story.slug}` : "news"),
      openGraph: {
        locale: ogLocales[locale],
        type: story ? "article" : "website",
        images: [ogImage],
      },
    };
  }

  if (segments.length === 1 && segments[0] === "contact") {
    return {
      title: t(locale, "contactHeading"),
      description: t(locale, "contactIntro"),
      alternates: alternates(locale, "contact"),
      openGraph: { locale: ogLocales[locale], images: [ogImage] },
    };
  }

  const page = segments.length === 1 ? pageByPath(segments[0]) : undefined;
  if (page) {
    return {
      title: page.title[locale],
      description: page.intro[locale],
      alternates: alternates(locale, page.path),
      openGraph: { locale: ogLocales[locale], type: "article", images: [ogImage] },
    };
  }

  return { title: "Globe Harvest" };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, segments = [] } = await params;
  if (!isLocale(locale)) return {};
  return routeMetadata(locale, segments);
}

export default async function LocalizedPage({ params, searchParams }: PageProps) {
  const [{ locale: localeParam, segments = [] }, rawSearch] = await Promise.all([
    params,
    searchParams,
  ]);
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  if (!segments.length) {
    return (
      <SiteShell locale={locale}>
        <HomePage locale={locale} />
      </SiteShell>
    );
  }

  if (segments[0] === "products") {
    if (segments.length === 1) {
      return (
        <SiteShell locale={locale}>
          <ProductsPage locale={locale} />
        </SiteShell>
      );
    }
    const category = categoryById(segments[1]);
    if (!category) notFound();
    if (segments.length === 2) {
      return (
        <SiteShell locale={locale}>
          <ProductsPage locale={locale} category={category} />
        </SiteShell>
      );
    }
    if (segments.length === 3) {
      const product = productBySlug(category, segments[2]);
      if (product) {
        return (
          <SiteShell locale={locale}>
            <ProductPage locale={locale} category={category} product={product} />
          </SiteShell>
        );
      }
    }
    notFound();
  }

  if (segments[0] === "news") {
    if (segments.length === 1) {
      return (
        <SiteShell locale={locale}>
          <NewsPage locale={locale} />
        </SiteShell>
      );
    }
    if (segments.length === 2) {
      const story = newsBySlug(segments[1]);
      if (story) {
        return (
          <SiteShell locale={locale}>
            <NewsDetailPage locale={locale} story={story} />
          </SiteShell>
        );
      }
    }
    notFound();
  }

  if (segments.length === 1 && segments[0] === "contact") {
    const initialProduct =
      typeof rawSearch.product === "string" ? rawSearch.product : "";
    const initialEnquiry =
      rawSearch.enquiry === "specifications"
        ? "Product specification request"
        : "";
    return (
      <SiteShell locale={locale}>
        <ContactPage
          locale={locale}
          initialProduct={initialProduct}
          initialEnquiry={initialEnquiry}
        />
      </SiteShell>
    );
  }

  if (segments.length === 1) {
    const page = pages.find((item) => item.path === segments[0]);
    if (page) {
      return (
        <SiteShell locale={locale}>
          <EditorialPage locale={locale} page={page} />
        </SiteShell>
      );
    }
  }

  notFound();
}

export function generateStaticParams() {
  const paths: string[][] = [];
  for (const category of categories) {
    paths.push(["products", category.id]);
    for (const product of category.products) {
      paths.push(["products", category.id, product.slug]);
    }
  }
  for (const story of news) paths.push(["news", story.slug]);
  paths.push(["products"], ["news"], ["contact"]);
  for (const page of pages) paths.push([page.path]);

  return locales.flatMap((locale) => [
    { locale, segments: [] as string[] },
    ...paths.map((segments) => ({ locale, segments })),
  ]);
}
