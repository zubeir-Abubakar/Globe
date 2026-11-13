/**
 * Buyer configuration.
 *
 * All values are server-side environment variables described in .env.example.
 * Nothing here is secret: these are public business details. The contact form
 * endpoint is only exposed to the server route, never to the client bundle.
 */
const clean = (value: string | undefined) => value?.trim() ?? "";

function safeUrl(value: string) {
  if (!value) return "https://globeharvest.example";
  try {
    return new URL(value).origin;
  } catch {
    return "https://globeharvest.example";
  }
}

const email = clean(process.env.BUSINESS_EMAIL);
const phone = clean(process.env.BUSINESS_PHONE);
const address = clean(process.env.BUSINESS_ADDRESS);
const formEndpoint = clean(process.env.CONTACT_FORM_ENDPOINT);

export const site = {
  name: "Globe Harvest",
  url: safeUrl(clean(process.env.SITE_URL)),
  email,
  phone,
  address,
  /** Neutral, obviously editable fallbacks instead of fake real details. */
  displayEmail: email || "hello@your-company.com",
  displayPhone: phone || "+00 000 000 000",
  formEndpoint,
  contactConfigured: Boolean(formEndpoint),
  social: {
    linkedin: clean(process.env.SOCIAL_LINKEDIN_URL),
    instagram: clean(process.env.SOCIAL_INSTAGRAM_URL),
  },
} as const;
