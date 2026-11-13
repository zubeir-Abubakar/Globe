import assert from "node:assert/strict";
import { request as httpRequest } from "node:http";
import test, { after, before } from "node:test";
import { freePort, startMockForm, startNext } from "./helpers.mjs";

let server;
let mock;
let baseUrl;

function validForm(overrides = {}) {
  const form = new FormData();
  form.set("fullName", "Release Test");
  form.set("companyName", "Test Company");
  form.set("email", "test@example.com");
  form.set("country", "Germany");
  form.set("preferredLanguage", "de");
  form.set("telephone", "+49 30 1234567");
  form.set("website", "https://example.com");
  form.set("enquiryType", "General enquiry");
  form.set("productCategories", "Avocados");
  form.set("message", "This is a focused contact API integration test.");
  form.set("privacyConsent", "yes");
  for (const [key, value] of Object.entries(overrides)) form.set(key, value);
  return form;
}

function post(form, ip, origin = baseUrl) {
  return fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: {
      "x-globe-locale": "de",
      "x-forwarded-for": ip,
      ...(origin ? { origin } : {}),
    },
    body: form,
    signal: AbortSignal.timeout(15_000),
  });
}

function postWithContentLength(contentLength, ip) {
  const target = new URL("/api/contact", baseUrl);
  return new Promise((resolve, reject) => {
    const request = httpRequest(
      {
        hostname: target.hostname,
        port: target.port,
        path: target.pathname,
        method: "POST",
        headers: {
          "content-length": String(contentLength),
          "x-globe-locale": "de",
          "x-forwarded-for": ip,
        },
      },
      (response) => {
        let raw = "";
        response.on("data", (chunk) => {
          raw += chunk;
        });
        response.on("end", () => {
          resolve({
            status: response.statusCode,
            body: raw ? JSON.parse(raw) : null,
          });
        });
      },
    );
    request.on("error", reject);
    request.setTimeout(10_000, () => request.destroy(new Error("request timeout")));
    request.end();
  });
}

before(async () => {
  const appPort = await freePort();
  const mockPort = await freePort();
  mock = await startMockForm(mockPort);
  server = await startNext(appPort, {
    SITE_URL: `http://127.0.0.1:${appPort}`,
    CONTACT_FORM_ENDPOINT: mock.endpoint,
  });
  baseUrl = server.baseUrl;
});

after(async () => {
  await server?.stop();
  await mock?.stop();
});

test("contact API validates, forwards and never fakes a failed delivery", async (t) => {
  await t.test("valid multipart enquiry is delivered", async () => {
    const before = mock.received.length;
    const response = await post(validForm(), "203.0.113.10");
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.match(body.message, /Danke|received/i);
    assert.equal(mock.received.length, before + 1);
    assert.match(mock.received.at(-1).contentType, /^multipart\/form-data/);
  });

  await t.test("provider failure is not reported as success", async () => {
    mock.failNext();
    const response = await post(validForm(), "203.0.113.15");
    assert.equal(response.status, 502);
    const body = await response.json();
    assert.doesNotMatch(JSON.stringify(body), /accepted|received successfully/i);
  });

  await t.test("invalid email is rejected by server-side Zod validation", async () => {
    const response = await post(
      validForm({ email: "not-an-email" }),
      "203.0.113.11",
    );
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.ok(body.errors.email);
  });

  await t.test("oversized content length is rejected before body parsing", async () => {
    const response = await postWithContentLength(
      12 * 1024 * 1024 + 1,
      "203.0.113.16",
    );
    assert.equal(response.status, 413);
    assert.match(response.body.message, /zu gross|zu groß/i);
  });

  await t.test("honeypot submissions are rejected without delivery", async () => {
    const before = mock.received.length;
    const response = await post(
      validForm({ companyFax: "spam bot" }),
      "203.0.113.12",
    );
    assert.equal(response.status, 400);
    assert.equal(mock.received.length, before);
  });

  await t.test("cross-origin submissions are rejected", async () => {
    const response = await post(
      validForm(),
      "203.0.113.13",
      "https://evil.example",
    );
    assert.equal(response.status, 403);
  });

  await t.test("file type spoofing is rejected by signature checks", async () => {
    const form = validForm();
    form.append(
      "attachments",
      new Blob(["this is not a png"], { type: "image/png" }),
      "fake.png",
    );
    const response = await post(form, "203.0.113.14");
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.ok(body.errors.attachments);
  });

  await t.test("repeated submissions from one address are rate limited", async () => {
    const ip = "198.51.100.50";
    for (let index = 1; index <= 8; index += 1) {
      const response = await post(validForm(), ip);
      assert.equal(response.status, 200, `submission ${index}`);
    }
    const limited = await post(validForm(), ip);
    assert.equal(limited.status, 429);
    assert.ok(Number(limited.headers.get("retry-after")) > 0);
    const body = await limited.json();
    assert.match(body.message, /Zu viele Einsendungen/);
  });
});
