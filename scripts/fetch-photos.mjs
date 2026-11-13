import fs from "node:fs";
import path from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const OUT = "/tmp/photo-candidates4";
const SLOTS = {
  hero: "fruit vegetables market stall",
  avocados: "avocado hass fruit",
  mangoes: "mango fruit",
  pineapples: "pineapple fruit",
  citrus: "oranges fruit",
  bananas: "banana bunch fruit",
  berries: "blueberries fruit",
  melons: "watermelon fruit",
  grapes: "grapes bunch fruit",
  tropical: "papaya fruit",
  vegetables: "vegetables market",
  company: "apple orchard trees",
  cta: "vegetable field landscape",
  "feat-hass": "avocado halves",
  "feat-mango": "mango slices",
  "feat-blueberries": "blueberries bowl",
  "feat-oranges": "orange slices",
};
const ALLOWED = /^(CC0|Public domain|CC BY 2\.0|CC BY 2\.5|CC BY 3\.0|CC BY 4\.0|CC BY-SA 2\.0|CC BY-SA 2\.5|CC BY-SA 3\.0|CC BY-SA 4\.0)$/;
const UA = { "User-Agent": "GlobeHarvestDemo/1.0 (buyer preview build)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (t = "") => t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

async function request(params, attempt = 0) {
  const res = await fetch(`${API}?${new URLSearchParams({ action: "query", format: "json", ...params })}`, {
    headers: UA, signal: AbortSignal.timeout(20000),
  });
  if (res.status === 429 && attempt < 3) {
    await sleep(6000 * (attempt + 1));
    return request(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function search(term, quality) {
  const data = await request({
    generator: "search",
    gsrsearch: `filetype:bitmap ${term}${quality ? ' incategory:"Quality images"' : ""}`,
    gsrnamespace: "6", gsrlimit: "14",
    prop: "imageinfo", iiprop: "url|extmetadata|size|mime", iiurlwidth: "1400",
  });
  return Object.values(data?.query?.pages ?? {});
}

const index = {};
for (const [slot, term] of Object.entries(SLOTS)) {
  try {
    let pages = (await search(term, true)).filter((p) => p.imageinfo?.[0]?.thumburl);
    if (pages.length < 2) pages = await search(term, false);
    const usable = pages
      .map((page) => ({ page, info: page.imageinfo?.[0] }))
      .filter(({ page, info }) => {
        if (!info?.thumburl || !/^image\/(jpeg|png)$/.test(info.mime ?? "")) return false;
        if (/(map|diagram|logo|drawing|illustration|chart|poster|sign|market in|festival)\b/i.test(page.title)) return false;
        if (!ALLOWED.test(info.extmetadata?.LicenseShortName?.value ?? "")) return false;
        return (info.width ?? 0) >= 1100 && (info.height ?? 0) >= 650;
      })
      .slice(0, 3);
    index[slot] = [];
    for (const [i, { page, info }] of usable.entries()) {
      const res = await fetch(info.thumburl, { headers: UA, signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`image HTTP ${res.status}`);
      const file = path.join(OUT, `${slot}-${i + 1}.jpg`);
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      index[slot].push({
        n: i + 1, file,
        title: page.title.replace(/^File:/, ""),
        creator: strip(info.extmetadata?.Artist?.value ?? "Unknown"),
        license: info.extmetadata?.LicenseShortName?.value ?? "",
        licenseUrl: info.extmetadata?.LicenseUrl?.value ?? "",
        source: info.descriptionurl,
        width: info.width, height: info.height,
      });
    }
    console.log(slot, index[slot].map((x) => `${x.n}:${x.title.slice(0, 44)}`).join(" | ") || "NONE");
  } catch (error) {
    console.error(slot, "FAILED", error.message);
    index[slot] = [];
  }
  await sleep(2200);
}
fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2));

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const entries = Object.entries(index);
for (const [sheet, group] of [["a", entries.slice(0, 9)], ["b", entries.slice(9)]]) {
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#f5f1e6;font:12px/1.35 Arial;color:#20342a;padding:16px}
    h2{font:600 13px Arial;margin:14px 0 5px;text-transform:uppercase;letter-spacing:.08em}
    .row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    figure{margin:0;background:#fff;border:1px solid #d8d0bd;border-radius:6px;overflow:hidden}
    img{width:100%;height:150px;object-fit:cover;display:block;background:#ddd}
    figcaption{padding:5px 7px;font-size:10px;line-height:1.3}
    b{display:block;font-size:11px}
  </style>${group.map(([slot, items]) => `<h2>${slot}</h2><div class="row">${items.map((x) => `<figure><img src="file://${x.file}"><figcaption><b>${x.n}. ${esc(x.title.slice(0, 60))}</b>${esc(x.creator)} · ${esc(x.license)}</figcaption></figure>`).join("")}</div>`).join("")}`;
  fs.writeFileSync(`/tmp/photo-sheet-${sheet}.html`, html);
}
