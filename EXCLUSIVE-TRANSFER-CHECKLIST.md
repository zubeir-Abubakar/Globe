# Globe Harvest — Exclusive Transfer Checklist

This is a practical handover checklist, **not a legally binding agreement**. The
exclusive transfer should be documented in a separate written agreement prepared or
reviewed by a qualified lawyer. Complete the seller decisions below before the buyer
relies on exclusivity.

## 1. Source-code delivery

- [ ] Deliver the clean snapshot described in the release report, not the old Git
      repository or its history.
- [ ] Confirm the package contains no `.git`, `.next`, `node_modules`, `.env`,
      credentials, caches, OS files or historical company material.
- [ ] Preserve `package-lock.json` and the declared Node/npm versions.
- [ ] Provide a SHA-256 checksum for the delivered archive.
- [ ] Record the delivered version/date and the file count.
- [ ] Confirm the buyer receives the source, not a compiled-only package.
- [ ] Agree whether future updates, support and bug fixes are included.

## 2. Project setup and dependencies

- [ ] Buyer installs Node.js 20.9+ and npm 10+.
- [ ] Run `npm ci` from the delivered directory.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm run build` and `npm test`.
- [ ] Confirm the tests start temporary servers and use only a local mock form
      receiver.
- [ ] Do not commit `node_modules`, `.next`, local environment files or generated
      test output.
- [ ] Review the dependency licences and advisories in `LICENSING.md`.

## 3. Environment configuration

- [ ] Copy `.env.example` to `.env.local` for local development.
- [ ] Set `SITE_URL` to the final `https://` origin.
- [ ] Set the buyer's public `BUSINESS_EMAIL`, `BUSINESS_PHONE` and
      `BUSINESS_ADDRESS`.
- [ ] Leave `CONTACT_FORM_ENDPOINT` empty until the buyer has a delivery provider.
- [ ] Set optional social URLs only if the buyer wants them shown.
- [ ] Never create a `NEXT_PUBLIC_*` copy of the contact endpoint.
- [ ] Confirm no real credentials are committed or included in screenshots.

## 4. Domain and SEO

- [ ] Choose the production domain and set `SITE_URL` without a trailing slash.
- [ ] Update the buyer's business name, legal notice, privacy policy and contact
      details.
- [ ] Rebuild after changing `SITE_URL`.
- [ ] Check canonical URLs and hreflang for all five locales.
- [ ] Check `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`,
      `/opengraph-image` and the favicon/app icons.
- [ ] Submit the final sitemap to the buyer's search-engine accounts if desired.
- [ ] Review the privacy policy for the buyer's jurisdiction and actual data flows.

## 5. Hosting and deployment

- [ ] Buyer creates and owns the hosting account; no seller account is transferred.
- [ ] Use Node.js 20.9+ or the platform's supported Next.js runtime.
- [ ] Install with `npm ci`; build with `npm run build`; run with `npm start`.
- [ ] Add all environment variables in the host's secret manager.
- [ ] Configure a custom domain and HTTPS.
- [ ] Confirm the platform supplies a trusted client-IP header for rate limiting.
- [ ] Configure platform-level rate limiting/WAF for `/api/contact` before launch.
- [ ] Verify the site with JavaScript enabled and with reduced motion enabled.

## 6. Contact form and lead delivery

- [ ] Buyer chooses a provider that accepts multipart form data (or their own
      endpoint).
- [ ] Set `CONTACT_FORM_ENDPOINT` only in the server environment.
- [ ] Do not reuse any endpoint found in historical repository material; the seller
      must rotate or deactivate it with its owner.
- [ ] Test a valid enquiry with non-sensitive sample data.
- [ ] Test invalid fields, the honeypot, a cross-origin request, an invalid
      attachment and the 503 demo state.
- [ ] Confirm the provider receives the enquiry before the UI shows success.
- [ ] Decide whether attachments are allowed and whether the provider scans them.
- [ ] Confirm the provider's data-processing terms and retention policy.
- [ ] Keep the in-process rate limit and add edge/WAF protection for production.

## 7. Brand customisation and ownership

- [ ] Seller confirms in writing whether the supplied `public/brand/logo2.svg` and
      derived assets are owned by the seller and can be assigned.
- [ ] If ownership is unconfirmed, choose one path: obtain a written assignment,
      commission a replacement, or exclude the brand assets from the sale.
- [ ] Buyer replaces the logo, icons, manifest metadata and Open Graph branding if
      rebranding.
- [ ] Check the new name and logo for trademark conflicts in the buyer's markets.
- [ ] Do not describe the brand as registered or cleared without evidence.

## 8. Product catalogue customisation

- [ ] Replace the illustrative 10 categories and 30 products with the buyer's real
      range.
- [ ] Update names, notes, regions and descriptions in all five locale fields.
- [ ] Replace the generated catalogue artwork or regenerate it from
      `scripts/generate-art.mjs`.
- [ ] Replace homepage photography or keep the credited CC0 files.
- [ ] Remove demonstration claims that do not apply to the buyer.
- [ ] Re-run content checks, lint, typecheck, build and tests after data changes.

## 9. Language customisation

- [ ] Review all five dictionaries in `src/lib/i18n/`.
- [ ] Review every localized JSON field in `src/data/`.
- [ ] Have a native or professional reviewer check the buyer's commercial copy.
- [ ] If adding/removing a language, update the locale array, proxy, metadata maps,
      Open Graph locales, flags and dictionaries as described in the README.
- [ ] Check the mobile language switcher and route preservation.

## 10. Asset licences and attribution

- [ ] Keep `PHOTO-CREDITS.md` and `public/photos/credits.json` with the package.
- [ ] Confirm all photographs remain CC0/public domain and non-exclusive.
- [ ] Do not claim exclusive rights to the photographs.
- [ ] Replace any photograph whose provenance cannot be verified.
- [ ] Keep the SIL OFL notices if self-hosting DM Serif Display or Inter.
- [ ] Retain third-party dependency licence notices, including `caniuse-lite`
      CC-BY-4.0 and the LGPL libvips obligations in `LICENSING.md`.
- [ ] Do not add an open-source project licence unless the sale agreement permits it.

## 11. Third-party accounts and credentials

- [ ] No provider account, API key, domain, hosting plan or analytics property is
      included in the source package.
- [ ] Buyer creates and owns the domain, hosting, form-provider and any future
      analytics/monitoring accounts.
- [ ] Seller rotates/deactivates any credential ever exposed in historical material.
- [ ] Transfer only accounts that the parties expressly agree to transfer.
- [ ] Record all credentials in the buyer's secret manager, never in the repository.

## 12. Final ownership and transfer agreement

- [ ] Identify the legal seller and buyer.
- [ ] Define the delivered source, assets, documentation and acceptance criteria.
- [ ] State the source-code licence/assignment and whether it is exclusive.
- [ ] Address brand ownership, trademark risk and third-party asset exclusions.
- [ ] Confirm the photographs are included on a non-exclusive CC0/public-domain
      basis.
- [ ] Confirm no real customers, suppliers, volumes, certifications, revenue or
      trading history are being sold or represented.
- [ ] Allocate responsibility for hosting, security, privacy, backups and ongoing
      maintenance.
- [ ] Set the purchase price, payment terms, support period and refund/acceptance
      terms.
- [ ] Confirm that the old repository history is not part of the delivered package.
- [ ] Have the final agreement reviewed by qualified legal counsel.

## Suggested acceptance test

From the delivered directory:

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npm test
```

Then start a production preview, check all five locales, the catalogue, a product
page, the mobile menu, the language switcher, the contact demo state and the SEO
files. Record the results and any buyer-specific changes in the handover record.
