import { NextRequest, NextResponse } from "next/server";
import {
  categories,
  defaultLocale,
  isLocale,
  news,
  pages,
  type Locale,
} from "@/lib/content";
import { t } from "@/lib/i18n";

const supportedLocales = new Set(["en", "de", "fr", "it", "es"]);

const knownPaths = new Set<string>([
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

function notFoundPage(locale: Locale) {
  const copy = {
    title: t(locale, "notFoundTitle"),
    body: t(locale, "notFoundCopy"),
    home: t(locale, "backHome"),
    products: t(locale, "products"),
  };
  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>404 — Globe Harvest</title>
<style>
  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:2rem;background:#14352a;color:#faf7ef;font-family:Helvetica,Arial,sans-serif}
  main{max-width:36rem}.brand{letter-spacing:.32em;font-family:Georgia,serif;font-size:.95rem;color:#eddfc2;margin-bottom:3rem}
  .kicker{color:#b9853c;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase}
  h1{font-family:Georgia,serif;font-weight:400;font-size:clamp(2.4rem,7vw,3.6rem);line-height:1.05;margin:.8rem 0 1rem}
  p{color:#d9e3d0;line-height:1.7;margin:0 0 2rem}
  a{display:inline-block;padding:.8rem 1.2rem;border-radius:999px;background:#faf7ef;color:#14352a;text-decoration:none;font-size:.9rem;font-weight:600;margin-right:.5rem}
  a.secondary{background:transparent;border:1px solid rgba(250,247,239,.4);color:#faf7ef}
</style>
</head>
<body><main>
  <div class="brand">GLOBE HARVEST</div>
  <span class="kicker">404</span>
  <h1>${copy.title}</h1>
  <p>${copy.body}</p>
  <a href="/${locale}">${copy.home}</a>
  <a class="secondary" href="/${locale}/products">${copy.products}</a>
</main></body>
</html>`;
  return new NextResponse(html, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const normalized = pathname.replace(/\/+$/, "") || "/";

  if (normalized === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url), 307);
  }

  const segments = normalized.split("/").filter(Boolean);
  const requestedLocale = segments[0];

  if (!supportedLocales.has(requestedLocale)) {
    return notFoundPage(defaultLocale);
  }

  const locale: Locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const routePath = segments.slice(1).join("/");

  if (!knownPaths.has(routePath)) {
    return notFoundPage(locale);
  }

  const headers = new Headers(request.headers);
  headers.set("x-globe-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/((?!api|_next|art|brand|photos|opengraph-image|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml|favicon\\.ico).*)",
  ],
};
