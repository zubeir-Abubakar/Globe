import { NextResponse } from "next/server";
import { z } from "zod";
import { checkContactRateLimit, clientAddress } from "@/lib/contact-rate-limit";
import { isLocale, type Locale } from "@/lib/content";
import { t } from "@/lib/i18n";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const maxFileSize = 5 * 1024 * 1024;
const maxRequestSize = 12 * 1024 * 1024;
const allowedTypes = new Map([
  [".pdf", "application/pdf"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [
    ".docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
]);
const enquiryValues = [
  "Product enquiry",
  "Buyer / distributor enquiry",
  "Grower / exporter enquiry",
  "Partnership / cooperation",
  "Product specification request",
  "Quality and documentation enquiry",
  "General enquiry",
  "Other",
] as const;

const formSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  country: z.string().trim().min(2).max(100),
  preferredLanguage: z.enum(["en", "de", "fr", "it", "es"]),
  telephone: z.string().trim().max(50),
  website: z.union([z.literal(""), z.string().trim().url().max(240)]),
  enquiryType: z.enum(enquiryValues),
  productCategories: z.array(z.string().trim().max(100)).max(12),
  productRange: z.string().trim().max(1200),
  productNames: z.string().trim().max(1200),
  origin: z.string().trim().max(300),
  quantity: z.string().trim().max(200),
  deliveryPeriod: z.string().trim().max(200),
  packaging: z.string().trim().max(400),
  specifications: z.string().trim().max(3000),
  message: z.string().trim().min(10).max(6000),
  privacyConsent: z.literal("yes"),
});

function isFile(value: FormDataEntryValue | null): value is File {
  return typeof value !== "string" && value !== null;
}

class RequestTooLargeError extends Error {}

async function readBoundedFormData(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing contact form body");
  const chunks: Buffer[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxRequestSize) {
        await reader.cancel().catch(() => undefined);
        throw new RequestTooLargeError();
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }

  const headers = new Headers(request.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  const boundedRequest = new Request(request.url, {
    method: "POST",
    headers,
    body: Buffer.concat(chunks, total),
  });
  return boundedRequest.formData();
}

async function hasExpectedSignature(file: File, extension: string) {
  const signature = Buffer.from(await file.slice(0, 12).arrayBuffer());
  if (extension === ".pdf") return signature.subarray(0, 5).toString() === "%PDF-";
  if (extension === ".jpeg") {
    return signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff;
  }
  if (extension === ".png") {
    return signature
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (extension === ".docx") {
    return signature[0] === 0x50 && signature[1] === 0x4b;
  }
  return false;
}

function json(
  message: string,
  status: number,
  errors?: Record<string, string>,
  headers: Record<string, string> = {},
) {
  return NextResponse.json(
    { message, ...(errors ? { errors } : {}) },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

export async function POST(request: Request) {
  const localeHeader = request.headers.get("x-globe-locale");
  const responseLocale: Locale =
    localeHeader && isLocale(localeHeader) ? localeHeader : "en";

  // Demonstration mode: never fake a successful submission.
  if (!site.contactConfigured) {
    return json(t(responseLocale, "demoModeNotice"), 503);
  }

  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const requestHost = host ?? new URL(request.url).host;
      if (originHost !== requestHost) {
        return json(t(responseLocale, "invalidOrigin"), 403);
      }
    } catch {
      return json(t(responseLocale, "invalidOrigin"), 403);
    }
  }

  const address = clientAddress(request);
  if (address) {
    const rateLimit = checkContactRateLimit(address);
    if (rateLimit.limited) {
      return json(t(responseLocale, "rateLimited"), 429, undefined, {
        "Retry-After": String(rateLimit.retryAfter),
      });
    }
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxRequestSize) {
    return json(t(responseLocale, "requestTooLarge"), 413);
  }

  let formData: FormData;
  try {
    formData = await readBoundedFormData(request);
  } catch (error) {
    if (error instanceof RequestTooLargeError) {
      return json(t(responseLocale, "requestTooLarge"), 413);
    }
    return json(t(responseLocale, "formUnreadable"), 400);
  }

  if (String(formData.get("companyFax") ?? "").trim()) {
    return json(t(responseLocale, "invalidSubmission"), 400);
  }

  const submittedLocale = formData.get("locale");
  const locale: Locale =
    typeof submittedLocale === "string" && isLocale(submittedLocale)
      ? submittedLocale
      : "en";

  const parsed = formSchema.safeParse({
    fullName: formData.get("fullName"),
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    country: formData.get("country"),
    preferredLanguage: formData.get("preferredLanguage"),
    telephone: formData.get("telephone") ?? "",
    website: formData.get("website") ?? "",
    enquiryType: formData.get("enquiryType"),
    productCategories: formData.getAll("productCategories"),
    productRange: formData.get("productRange") ?? "",
    productNames: formData.get("productNames") ?? "",
    origin: formData.get("origin") ?? "",
    quantity: formData.get("quantity") ?? "",
    deliveryPeriod: formData.get("deliveryPeriod") ?? "",
    packaging: formData.get("packaging") ?? "",
    specifications: formData.get("specifications") ?? "",
    message: formData.get("message"),
    privacyConsent: formData.get("privacyConsent"),
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !errors[field]) {
        errors[field] = t(locale, "invalidFields");
      }
    }
    return json(t(locale, "invalidFields"), 400, errors);
  }

  const files = formData
    .getAll("attachments")
    .filter(isFile)
    .filter((file) => file.size > 0);

  if (files.length > 4) {
    return json(t(locale, "attachmentCount"), 400, {
      attachments: t(locale, "attachmentCount"),
    });
  }

  let attachmentBytes = 0;
  for (const file of files) {
    const dot = file.name.lastIndexOf(".");
    const extension = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
    const expectedType = allowedTypes.get(extension);
    if (
      !expectedType ||
      file.type !== expectedType ||
      file.size > maxFileSize ||
      !(await hasExpectedSignature(file, extension))
    ) {
      return json(t(locale, "attachmentInvalid"), 400, {
        attachments: t(locale, "attachmentInvalid"),
      });
    }
    attachmentBytes += file.size;
  }

  if (attachmentBytes > 10 * 1024 * 1024) {
    return json(t(locale, "attachmentCombined"), 400, {
      attachments: t(locale, "attachmentCombined"),
    });
  }

  const data = parsed.data;
  const outboundData = new FormData();
  outboundData.set("fullName", data.fullName);
  outboundData.set("companyName", data.companyName);
  outboundData.set("email", data.email);
  outboundData.set("_replyto", data.email);
  outboundData.set("_subject", `[Globe Harvest] ${data.enquiryType}`);
  outboundData.set("country", data.country);
  outboundData.set("preferredLanguage", data.preferredLanguage);
  outboundData.set("telephone", data.telephone);
  outboundData.set("website", data.website);
  outboundData.set("enquiryType", data.enquiryType);
  outboundData.set("productCategories", data.productCategories.join(", "));
  outboundData.set("productRange", data.productRange);
  outboundData.set("productNames", data.productNames);
  outboundData.set("origin", data.origin);
  outboundData.set("quantity", data.quantity);
  outboundData.set("deliveryPeriod", data.deliveryPeriod);
  outboundData.set("packaging", data.packaging);
  outboundData.set("specifications", data.specifications);
  outboundData.set("message", data.message);
  outboundData.set("locale", locale);
  for (const file of files) {
    outboundData.append("attachments", file, file.name);
  }

  try {
    const response = await fetch(site.formEndpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: outboundData,
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      console.error("Contact delivery failed with status:", response.status);
      return json(t(locale, "formFailed"), 502);
    }
  } catch (error) {
    console.error(
      "Contact delivery failed:",
      error instanceof Error ? error.message : "Unknown network error",
    );
    return json(t(locale, "formFailed"), 502);
  }

  return json(t(locale, "accepted"), 200);
}
