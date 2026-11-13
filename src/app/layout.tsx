import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { defaultLocale, isLocale, locales, type Locale } from "@/lib/content";
import { t } from "@/lib/i18n";
import { site } from "@/lib/site";
import { BootSplash } from "@/components/BootSplash";
import "./globals.css";

const ogLocales: Record<Locale, string> = {
  en: "en_GB",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  es: "es_ES",
};

async function requestLocale(): Promise<Locale> {
  const value = (await headers()).get("x-globe-locale");
  return value && isLocale(value) ? value : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: "Globe Harvest — Premium Fresh Produce Import & Export",
      template: "%s — Globe Harvest",
    },
    description: t(locale, "heroCopy"),
    applicationName: site.name,
    generator: "Next.js",
    keywords: [
      "fresh produce",
      "fruit import",
      "vegetable export",
      "wholesale produce",
      "international sourcing",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((code) => [code, `/${code}`])),
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocales[locale],
      url: `/${locale}`,
      title: "Globe Harvest — Premium Fresh Produce Import & Export",
      description: t(locale, "heroCopy"),
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Globe Harvest — premium fresh produce import and export",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Globe Harvest — Premium Fresh Produce Import & Export",
      description: t(locale, "heroCopy"),
    },
    icons: {
      icon: [
        { url: "/brand/icon.svg", type: "image/svg+xml" },
        { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.webmanifest",
    robots: { index: true, follow: true },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#14352a",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await requestLocale();
  return (
    <html lang={locale}>
      <body>
        <BootSplash />
        {children}
      </body>
    </html>
  );
}
