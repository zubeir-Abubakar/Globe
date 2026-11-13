import type { Locale } from "@/lib/content";
import { en } from "./i18n/en";
import { de } from "./i18n/de";
import { fr } from "./i18n/fr";
import { it } from "./i18n/it";
import { es } from "./i18n/es";

export type TranslationKey = keyof typeof en;

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  en,
  de,
  fr,
  it,
  es,
};

export function t(locale: Locale, key: TranslationKey): string {
  return dictionaries[locale]?.[key] ?? en[key];
}

export function regionLabel(locale: Locale, region: string) {
  const key = `region-${region}` as TranslationKey;
  return en[key] ? t(locale, key) : region;
}

export function enquiryOptions(locale: Locale) {
  return [
    { value: "Product enquiry", label: t(locale, "productEnquiry") },
    { value: "Buyer / distributor enquiry", label: t(locale, "buyerEnquiry") },
    { value: "Grower / exporter enquiry", label: t(locale, "supplierEnquiry") },
    { value: "Partnership / cooperation", label: t(locale, "cooperationEnquiry") },
    { value: "Product specification request", label: t(locale, "specificationEnquiry") },
    { value: "Quality and documentation enquiry", label: t(locale, "qualityEnquiry") },
    { value: "General enquiry", label: t(locale, "generalEnquiry") },
    { value: "Other", label: t(locale, "otherEnquiry") },
  ] as const;
}

export const languageNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  es: "Español",
};
