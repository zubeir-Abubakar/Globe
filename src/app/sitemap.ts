import type { MetadataRoute } from "next";
import { categories, locales, news, pages } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set<string>([
    "",
    "products",
    "news",
    "contact",
    ...pages.map((page) => page.path),
    ...categories.map((category) => `products/${category.id}`),
    ...categories.flatMap((category) =>
      category.products.map((product) => `products/${category.id}/${product.slug}`),
    ),
    ...news.map((story) => `news/${story.slug}`),
  ]);

  return locales.flatMap((locale) =>
    [...paths].map((path) => ({
      url: `${site.url}/${locale}${path ? `/${path}` : ""}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path.startsWith("products") ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((code) => [code, `${site.url}/${code}${path ? `/${path}` : ""}`]),
        ),
      },
    })),
  );
}
