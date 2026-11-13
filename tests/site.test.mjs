import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import { freePort, startNext } from "./helpers.mjs";

let server;
let baseUrl;

before(async () => {
  const port = await freePort();
  server = await startNext(port, {
    SITE_URL: `http://127.0.0.1:${port}`,
    CONTACT_FORM_ENDPOINT: "",
  });
  baseUrl = server.baseUrl;
});

after(async () => {
  await server?.stop();
});

function get(pathname, init) {
  return fetch(`${baseUrl}${pathname}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
    ...init,
  });
}

test("root redirects to the default locale", async () => {
  const response = await get("/");
  assert.equal(response.status, 307);
  assert.equal(
    new URL(response.headers.get("location"), baseUrl).pathname,
    "/en",
  );
});

test("all five locales render with correct language metadata", async () => {
  for (const locale of ["en", "de", "fr", "it", "es"]) {
    const response = await get(`/${locale}`);
    assert.equal(response.status, 200, locale);
    const html = await response.text();
    assert.match(html, new RegExp(`<html lang="${locale}"`), locale);
    assert.match(html, /Globe Harvest/, locale);
    assert.match(html, /rel="canonical"/, locale);
    assert.match(html, /hreflang="x-default"/i, locale);
    assert.match(html, /twitter:card/, locale);
    assert.match(html, /og:image/, locale);
  }
});

test("catalogue, category, product and editorial routes render", async () => {
  const routes = [
    "/en/products",
    "/de/products/avocados",
    "/fr/products/avocados/hass",
    "/it/news",
    "/es/news/reading-a-mango-specification",
    "/en/company",
    "/de/quality",
    "/fr/sustainability",
    "/it/cooperation",
    "/es/careers",
    "/en/legal",
    "/de/privacy",
    "/es/contact",
  ];
  for (const route of routes) {
    const response = await get(route);
    assert.equal(response.status, 200, route);
  }
});

test("invalid products and unknown routes return a 404", async () => {
  for (const route of [
    "/en/products/avocados/not-a-product",
    "/en/no-such-page",
    "/xx",
  ]) {
    const response = await get(route);
    assert.equal(response.status, 404, route);
    const html = await response.text();
    assert.match(html, /404/, route);
  }
});

test("contact page is honest and disabled in demo mode", async () => {
  const response = await get("/en/contact");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Demonstration mode/);
  assert.match(html, /disabled/);
  assert.match(html, /CONTACT_FORM_ENDPOINT/);
});

test("contact API returns 503 in demo mode, never a fake success", async () => {
  const form = new FormData();
  form.set("fullName", "Release Test");
  form.set("companyName", "Test Company");
  form.set("email", "test@example.com");
  form.set("country", "Germany");
  form.set("preferredLanguage", "de");
  form.set("enquiryType", "General enquiry");
  form.set("message", "This is a demo-mode release test enquiry.");
  form.set("privacyConsent", "yes");

  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "x-globe-locale": "de" },
    body: form,
    signal: AbortSignal.timeout(15_000),
  });
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = await response.json();
  assert.match(body.message, /Demonstrationsmodus/);
  assert.doesNotMatch(JSON.stringify(body), /accepted|received successfully/i);
});

test("sitemap covers all locales, products and news with alternates", async () => {
  const response = await get("/sitemap.xml");
  assert.equal(response.status, 200);
  const xml = await response.text();
  for (const locale of ["en", "de", "fr", "it", "es"]) {
    assert.match(xml, new RegExp(`/${locale}/products/avocados/hass`), locale);
  }
  assert.match(xml, /news\/reading-a-mango-specification/);
  assert.match(xml, /xhtml:link/);
  assert.match(xml, /hreflang="x-default"/);
});

test("robots, manifest and social image are served correctly", async () => {
  const robots = await get("/robots.txt");
  assert.equal(robots.status, 200);
  const robotsText = await robots.text();
  assert.match(robotsText, /Disallow: \/api\//);
  assert.match(robotsText, /Sitemap: .*\/sitemap.xml/);

  const manifest = await get("/manifest.webmanifest");
  assert.equal(manifest.status, 200);
  const manifestJson = await manifest.json();
  assert.equal(manifestJson.short_name, "Globe Harvest");
  assert.ok(manifestJson.icons.length >= 3);

  const image = await get("/opengraph-image");
  assert.equal(image.status, 200);
  assert.match(image.headers.get("content-type") ?? "", /^image\/png/);
});

test("brand, photography, art and icons are reachable", async () => {
  const assets = [
    "/brand/logo2.svg",
    "/brand/logo-horizontal.svg",
    "/brand/icon.svg",
    "/brand/icon-192.png",
    "/photos/mangoes.jpg",
    "/photos/tropical.jpg",
    "/photos/feat-hass.jpg",
    "/art/avocados.svg",
  ];
  for (const asset of assets) {
    const response = await get(asset);
    assert.equal(response.status, 200, asset);
    assert.ok(
      Number(response.headers.get("content-length") ?? 1) > 0,
      `${asset} is empty`,
    );
  }
});

test("production responses do not expose the framework header", async () => {
  const response = await get("/en");
  assert.equal(response.headers.get("x-powered-by"), null);
});
