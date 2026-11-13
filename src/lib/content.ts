import avocados from "@/data/catalog/avocados.json";
import mangoes from "@/data/catalog/mangoes.json";
import pineapples from "@/data/catalog/pineapples.json";
import citrus from "@/data/catalog/citrus.json";
import bananas from "@/data/catalog/bananas.json";
import berries from "@/data/catalog/berries.json";
import melons from "@/data/catalog/melons.json";
import grapes from "@/data/catalog/grapes.json";
import tropicalFruits from "@/data/catalog/tropical-fruits.json";
import vegetables from "@/data/catalog/vegetables.json";

import company from "@/data/pages/company.json";
import quality from "@/data/pages/quality.json";
import sustainability from "@/data/pages/sustainability.json";
import cooperation from "@/data/pages/cooperation.json";
import careers from "@/data/pages/careers.json";
import legal from "@/data/pages/legal.json";
import privacy from "@/data/pages/privacy.json";

import mangoNote from "@/data/news/mango-specification.json";
import berryNote from "@/data/news/cold-chain-berries.json";
import citrusNote from "@/data/news/citrus-planning.json";

export const locales = ["en", "de", "fr", "it", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type Localized = Record<Locale, string>;

export type RegionKey =
  | "latin-america"
  | "southern-europe"
  | "oceania"
  | "north-africa"
  | "west-africa"
  | "south-asia"
  | "southeast-asia"
  | "caribbean"
  | "southern-africa";

export type Product = {
  slug: string;
  name: Localized;
  note: Localized;
  image: string;
  regions: RegionKey[];
};

export type Category = {
  id: string;
  names: Localized;
  description: Localized;
  image: string;
  products: Product[];
};

export type PageSection = { heading: Localized; body: Localized[] };

export type Page = {
  id: string;
  path: string;
  image: string;
  title: Localized;
  intro: Localized;
  sections: PageSection[];
};

export type NewsStory = {
  slug: string;
  date: string;
  image: string;
  titles: Localized;
  excerpt: Localized;
  body: Record<Locale, string[]>;
};

export const categories = [
  avocados,
  mangoes,
  pineapples,
  citrus,
  bananas,
  berries,
  melons,
  grapes,
  tropicalFruits,
  vegetables,
] as unknown as Category[];

export const pages = [
  company,
  quality,
  sustainability,
  cooperation,
  careers,
  legal,
  privacy,
] as unknown as Page[];

export const news = [
  mangoNote,
  berryNote,
  citrusNote,
] as unknown as NewsStory[];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localizedName(item: { name: Localized }, locale: Locale) {
  return item.name[locale] ?? item.name.en;
}

export function localizedCategoryName(category: Category, locale: Locale) {
  return category.names[locale] ?? category.names.en;
}

export function localizedProductName(product: Product, locale: Locale) {
  return product.name[locale] ?? product.name.en;
}

export function categoryById(id: string) {
  return categories.find((category) => category.id === id);
}

export function productBySlug(category: Category, slug: string) {
  return category.products.find((product) => product.slug === slug);
}

export function pageByPath(path: string) {
  return pages.find((page) => page.path === path);
}

export function newsBySlug(slug: string) {
  return news.find((story) => story.slug === slug);
}

export function totalProducts() {
  return categories.reduce((sum, category) => sum + category.products.length, 0);
}

const regionKeys: RegionKey[] = [
  "latin-america",
  "southern-europe",
  "oceania",
  "north-africa",
  "west-africa",
  "south-asia",
  "southeast-asia",
  "caribbean",
  "southern-africa",
];

export function allRegionKeys() {
  const used = new Set<RegionKey>();
  for (const category of categories) {
    for (const product of category.products) {
      product.regions.forEach((region) => used.add(region));
    }
  }
  return regionKeys.filter((region) => used.has(region));
}

export type SearchEntry = {
  title: string;
  description: string;
  href: string;
  kind: string;
};

/** Search entries are built once per locale on the server. */
export function searchEntries(
  locale: Locale,
  labels: { categories: string; products: string; marketNotes: string; company: string },
): SearchEntry[] {
  return [
    ...categories.map((category) => ({
      title: localizedCategoryName(category, locale),
      description: `${category.products.length} ${labels.products}`,
      href: `/${locale}/products/${category.id}`,
      kind: labels.categories,
    })),
    ...categories.flatMap((category) =>
      category.products.map((product) => ({
        title: localizedProductName(product, locale),
        description: localizedCategoryName(category, locale),
        href: `/${locale}/products/${category.id}/${product.slug}`,
        kind: labels.products,
      })),
    ),
    ...pages.map((page) => ({
      title: page.title[locale] ?? page.title.en,
      description: page.intro[locale] ?? page.intro.en,
      href: `/${locale}/${page.path}`,
      kind: labels.company,
    })),
    ...news.map((story) => ({
      title: story.titles[locale] ?? story.titles.en,
      description: story.excerpt[locale] ?? story.excerpt.en,
      href: `/${locale}/news/${story.slug}`,
      kind: labels.marketNotes,
    })),
  ];
}

export function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
