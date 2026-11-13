# Globe Harvest

A complete, independent website for a fictional premium fresh-produce import, export
and wholesale company. Globe Harvest is a demonstration brand built to be sold as a
single source-code acquisition: it contains no original company identity and no live
credentials. Homepage photography is openly licensed and fully credited.

The site presents a ten-category B2B produce catalogue, an editorial company story,
quality and sustainability pages, illustrative market notes and a validated enquiry
form, in five languages.

> **Demonstration content.** Globe Harvest is not an operating company. Product,
> sourcing and market information is illustrative. The contact form runs in a safe
> demonstration mode until the buyer configures a delivery endpoint.

## Technology

- Next.js 16 (App Router, `src/proxy.ts` locale resolution)
- React 19 + TypeScript (strict)
- Zod for server-side form validation
- Plain CSS with design tokens (no UI framework)
- Original SVG artwork plus openly licensed editorial photography (see
  `PHOTO-CREDITS.md`)

No database, CMS, analytics or payment integration is included. This is a
business-to-business catalogue and enquiry website, not an online shop.

## Features

- **Ten produce categories, 30 products.** Avocados, mangoes, pineapples, citrus,
  bananas, berries, melons, grapes, exotic tropical fruits and fresh vegetables.
- **Catalogue search and filtering.** Client-side search by product or category,
  a sourcing-region filter, and category navigation with shareable URLs.
- **Product detail pages.** Original description, representative artwork, illustrative
  sourcing regions and a specification-request call to action.
- **Five complete language versions.** English, German, French, Italian and Spanish
  UI, catalogue copy, editorial pages and forms.
- **SEO foundation.** Locale-aware titles, descriptions and canonicals, hreflang
  alternates, generated sitemap, robots.txt, Open Graph/Twitter metadata and a
  generated social sharing image.
- **Contact form.** Server-side Zod validation, honeypot, origin check, request-size
  limit, attachment type/signature validation and honest success/failure messages.
- **Accessible, responsive UI.** Skip link, keyboard-operable mega-menu, mobile
  drawer, search dialog, visible focus styles and reduced-motion support.
- **Editorial homepage.** Photographic hero, category grid, company split, value
  strip, featured products and a full-width enquiry band, with clipped-line scroll
  reveals that degrade to static content without JavaScript.
- **Brand assets.** Original logo, emblem, favicon and app icon, plus a branded
  loading screen and 404/error states.

## Supported languages

| Code | Language | Default |
| ---- | -------- | ------- |
| `en` | English  | Yes     |
| `de` | German   |         |
| `fr` | French   |         |
| `it` | Italian  |         |
| `es` | Spanish  |         |

Every route exists under each locale prefix (`/en`, `/de`, `/fr`, `/it`, `/es`).
The language switcher preserves the current route, and the chosen language survives
navigation and page refreshes because it is part of the URL.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer

## Installation

```sh
npm install
cp .env.example .env.local
# edit .env.local with your own business details
npm run dev
```

Open <http://localhost:3000>. The root URL redirects to `/en`.

## Environment variables

All values are optional at first run; neutral placeholders are shown until they are
set. None of them are secrets, but they are server-side variables and must not be
committed.

| Variable | Purpose |
| -------- | ------- |
| `SITE_URL` | Canonical public URL, used by metadata, sitemap and robots. |
| `BUSINESS_EMAIL` | Business email in the footer and contact page. |
| `BUSINESS_PHONE` | Business telephone in the footer and contact page. |
| `BUSINESS_ADDRESS` | Postal address, rendered with line breaks. |
| `CONTACT_FORM_ENDPOINT` | Multipart form endpoint (for example a Formspree form URL). |
| `SOCIAL_LINKEDIN_URL` | Optional LinkedIn profile; hidden when empty. |
| `SOCIAL_INSTAGRAM_URL` | Optional Instagram profile; hidden when empty. |

### Contact form behaviour

- With `CONTACT_FORM_ENDPOINT` set, valid submissions are forwarded to that endpoint.
  A success message is shown only after the endpoint accepts the request.
- With no endpoint configured, the site enters **demonstration mode**: a visible
  notice explains that submission is disabled, the submit button is disabled and
  `POST /api/contact` returns HTTP 503. It never fakes a successful submission.
- Validation runs on the server: required fields, email format, URL format, privacy
  consent, maximum request size, honeypot, attachment count, MIME type, file
  signature and combined size.

## Build and run

```sh
npm run typecheck
npm run build
npm start
```

`npm run build` produces an optimised production build. `npm start` serves it on
port 3000 by default; set `PORT` to change it.

## Deployment

The project deploys as a standard Next.js application.

1. Push the repository to your Git host.
2. Import it into your hosting provider (for example Vercel) or deploy to any Node
   host that can run `npm install && npm run build && npm start`.
3. Set the environment variables above in the hosting dashboard.
4. Set `SITE_URL` to the final production domain before the first indexable deploy.
5. Point the domain at the deployment and verify `/sitemap.xml`, `/robots.txt`,
   `/manifest.webmanifest` and the contact form.

No build-time secrets are required. The default `SITE_URL` is
`https://globeharvest.example`, which is deliberately not a live domain.

## Content customisation

- Catalogue: `src/data/catalog/*.json`
- Editorial pages: `src/data/pages/*.json`
- Market notes: `src/data/news/*.json`
- UI strings and region labels: `src/lib/i18n/{en,de,fr,it,es}.ts`
- Business details and form endpoint: environment variables only
- Artwork: original SVGs in `public/art`, generated by `npm run art`
- Homepage photography: `public/photos`; credits and licences in `PHOTO-CREDITS.md`

Each JSON record contains all five locales. TypeScript checks the shape of every
dictionary and page at build time, so a missing translation fails `npm run typecheck`.

## Repository structure

```
public/
  art/            generated produce and editorial illustrations
  brand/          logo, inverse logo, emblem, favicon/app icon
  photos/         openly licensed editorial photography for the homepage
scripts/          artwork generator
PHOTO-CREDITS.md  photographer, licence and source for every homepage photo
src/
  app/            routes, metadata, sitemap, robots, manifest, OG image, contact API
  components/     header, footer, hero, catalogue, editorial pages, contact form
  data/           five-language catalogue, page and news copy
  lib/            content model, dictionaries, environment configuration
```

## Asset attribution and licensing

- **Artwork:** every image in `public/art` and `public/brand` is original vector work
  created for this project by `scripts/generate-art.mjs`. It may be redistributed
  with the project.
- **Photography:** the editorial photographs in `public/photos` are used under CC0,
  CC BY-SA 2.5, 3.0 or 4.0. Authors, licence links and Wikimedia Commons sources are
  recorded in `PHOTO-CREDITS.md`; keep that file and `public/photos/credits.json` with
  any redistribution of the photographs. Attribution-ShareAlike images must retain
  their credit when reused or modified.
- **Typefaces:** DM Serif Display and Inter are loaded from Google Fonts and licensed
  under the SIL Open Font License 1.1.
- **Code:** the application source is provided as part of the acquisition. The brand
  name and emblem are original to this demonstration project; buyers should complete
  their own name and trademark checks before commercial launch.

## Verification

```sh
npm install
npm run typecheck
npm run build
```

There is no automated test suite or lint configuration in this repository. The
production build and strict TypeScript check are the required verification steps.

## Known configuration limits

- The contact form needs a buyer-provided endpoint before it can deliver mail.
- Business details fall back to neutral placeholders until configured.
- `SITE_URL` must be set to the buyer's domain for correct canonical URLs.
- The catalogue's sourcing regions are illustrative, not supplier records.
- The included logo and emblem are original stand-ins designed for this brand; a buyer
  who owns a different logo file can replace `public/brand/*` while keeping filenames.
