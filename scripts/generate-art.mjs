/**
 * Globe Harvest — original artwork generator.
 *
 * Produces the flat, editorial produce illustrations used across the site.
 * Every image is generated from the primitives below, so the artwork is
 * original to this project and carries no third-party image licence.
 *
 * Usage: node scripts/generate-art.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ART_DIR = join(process.cwd(), "public", "art");
mkdirSync(ART_DIR, { recursive: true });

const W = 1200;
const H = 900;


function frame(id, palette, body, angle = 0) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.bg1}"/>
      <stop offset="1" stop-color="${palette.bg2}"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="62%" cy="18%" r="78%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="clip-${id}"><rect width="${W}" height="${H}"/></clipPath>
  </defs>
  <g clip-path="url(#clip-${id})">
    <rect width="${W}" height="${H}" fill="url(#bg-${id})"/>
    <circle cx="1030" cy="120" r="330" fill="${palette.glow}" opacity="0.5"/>
    <circle cx="1030" cy="120" r="330" fill="url(#glow-${id})"/>
    <circle cx="120" cy="860" r="280" fill="none" stroke="${palette.ring}" stroke-width="1.5" opacity="0.65"/>
    <circle cx="120" cy="860" r="205" fill="none" stroke="${palette.ring}" stroke-width="1" opacity="0.45"/>
    <path d="M0 742C214 690 386 788 602 756s364-128 598-74v218H0Z" fill="${palette.hill}" opacity="0.5"/>
    <g transform="translate(${W / 2} ${H / 2 + 10}) rotate(${angle})">
      ${body}
    </g>
  </g>
</svg>`;
}

const leaf = (x, y, r, fill, rotate = 0) =>
  `<ellipse cx="${x}" cy="${y}" rx="46" ry="20" fill="${fill}" transform="rotate(${rotate} ${x} ${y})"/>`;

const motifs = {
  avocados: (p) => `
    <ellipse cx="18" cy="70" rx="210" ry="200" fill="${p.shadow}" opacity="0.35"/>
    <path d="M0-230c74 0 138 66 138 156 0 112-62 218-138 218S-138 38-138-74c0-90 64-156 138-156Z" fill="${p.skin}"/>
    <path d="M0-196c52 0 98 56 98 124 0 90-44 174-98 174s-98-84-98-174c0-68 46-124 98-124Z" fill="${p.flesh}"/>
    <path d="M0-160c34 0 62 42 62 92 0 68-28 130-62 130s-62-62-62-130c0-50 28-92 62-92Z" fill="${p.core}" opacity="0.55"/>
    <circle cx="0" cy="20" r="58" fill="${p.pit}"/>
    <circle cx="-18" cy="0" r="16" fill="#ffffff" opacity="0.16"/>
    ${leaf(112, -196, 0, p.leaf, -28)}`,
  mangoes: (p) => `
    <ellipse cx="10" cy="86" rx="214" ry="190" fill="${p.shadow}" opacity="0.32"/>
    <g transform="rotate(-16)">
      <ellipse cx="0" cy="0" rx="196" ry="146" fill="${p.skin}"/>
      <path d="M-196 6c34 74 116 122 206 96 51-15 88-50 104-88-40 30-92 44-148 38-68-7-122-34-162-46Z" fill="${p.shade}" opacity="0.5"/>
      <ellipse cx="-58" cy="-58" rx="62" ry="34" fill="#ffffff" opacity="0.22" transform="rotate(-18 -58 -58)"/>
    </g>
    <path d="M118-128c34-44 84-56 116-48-16 40-60 70-112 66Z" fill="${p.leaf}"/>
    <path d="M120-124c28-26 62-38 92-40" fill="none" stroke="${p.stem}" stroke-width="7" stroke-linecap="round"/>`,
  pineapples: (p) => `
    <ellipse cx="14" cy="86" rx="186" ry="196" fill="${p.shadow}" opacity="0.3"/>
    <g fill="none" stroke="${p.hatch}" stroke-width="9" opacity="0.7">
      ${Array.from({ length: 9 }, (_, i) => {
        const x = -170 + i * 44;
        return `<path d="M${x} -150 44 180" /><path d="M${x} 180 44-150" />`;
      }).join("")}
    </g>
    <ellipse cx="0" cy="10" rx="168" ry="196" fill="${p.body}"/>
    <g fill="none" stroke="${p.hatch}" stroke-width="8" opacity="0.75">
      ${Array.from({ length: 9 }, (_, i) => {
        const x = -150 + i * 40;
        return `<path d="M${x} -140 30 180" /><path d="M${x} 180 30-140" />`;
      }).join("")}
    </g>
    <g fill="${p.crown}">
      <path d="M-18-186-88-330l50 18 22-96 36 96 52-24-26 108Z"/>
      <path d="M6-192 0-330l-30 92Z" opacity="0.7"/>
      <path d="M34-190 92-306l-12 104Z" opacity="0.7"/>
    </g>`,
  citrus: (p) => `
    <ellipse cx="16" cy="92" rx="214" ry="188" fill="${p.shadow}" opacity="0.3"/>
    <circle cx="0" cy="0" r="192" fill="${p.skin}"/>
    <circle cx="0" cy="0" r="164" fill="${p.flesh}" opacity="0.55"/>
    <circle cx="0" cy="0" r="24" fill="${p.core}" opacity="0.8"/>
    <g stroke="${p.core}" stroke-width="6" opacity="0.45" fill="none">
      ${Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return `<path d="M0 0 ${Math.cos(a) * 160} ${Math.sin(a) * 160}"/>`;
      }).join("")}
    </g>
    <circle cx="-62" cy="-66" r="36" fill="#ffffff" opacity="0.24"/>
    ${leaf(118, -168, 0, p.leaf, -34)}
    <path d="M0-186c10-46 40-72 78-78-6 40-30 72-78 78Z" fill="${p.leaf}"/>`,
  bananas: (p) => `
    <ellipse cx="24" cy="98" rx="230" ry="170" fill="${p.shadow}" opacity="0.3"/>
    <g transform="rotate(-8)">
      <path d="M-236 96C-176 250 96 286 252 132c-92 58-232 44-286-32-28-39-70-48-120-26" fill="${p.skin}"/>
      <path d="M-222 84C-156 208 92 236 228 116c-78 36-190 20-236-42-24-32-70-44-128-18" fill="${p.light}" opacity="0.55"/>
      <path d="M-238 94c-40 16-64 44-64 76 26-20 50-28 78-26" fill="${p.tip}"/>
      <path d="M226 118c18-10 30-24 34-40-20 8-38 18-52 30Z" fill="${p.tip}"/>
    </g>`,
  berries: (p) => `
    <ellipse cx="14" cy="96" rx="212" ry="176" fill="${p.shadow}" opacity="0.28"/>
    <g>
      ${[
        [-120, 40, 70],
        [4, 74, 62],
        [104, 18, 54],
        [-30, -34, 58],
        [-150, -58, 44],
        [64, -86, 46],
        [150, -92, 34],
      ]
        .map(
          ([x, y, r]) =>
            `<circle cx="${x}" cy="${y}" r="${r}" fill="${p.berry}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.22}" fill="#ffffff" opacity="0.25"/>`,
        )
        .join("")}
    </g>
    <path d="M-4-116c46-12 92-2 118 28-42 20-92 10-118-28Z" fill="${p.leaf}"/>
    <path d="M-42-112c-8-44 10-82 46-100 16 42 0 84-46 100Z" fill="${p.leaf}" opacity="0.85"/>
    <g fill="#f2d7a0">
      ${Array.from({ length: 7 }, (_, i) => {
        const a = -0.9 + i * 0.32;
        return `<circle cx="${Math.cos(a) * 96}" cy="${Math.sin(a) * 96 + 28}" r="5"/>`;
      }).join("")}
    </g>`,
  melons: (p) => `
    <ellipse cx="18" cy="94" rx="206" ry="182" fill="${p.shadow}" opacity="0.3"/>
    <circle cx="-26" cy="0" r="178" fill="${p.rind}"/>
    <g stroke="${p.net}" stroke-width="4" fill="none" opacity="0.6">
      ${Array.from({ length: 7 }, (_, i) => {
        const y = -150 + i * 50;
        return `<path d="M-190 ${y}Q-26 ${y - 36} 140 ${y}" />`;
      }).join("")}
      ${Array.from({ length: 5 }, (_, i) => {
        const x = -160 + i * 68;
        return `<path d="M${x} -160Q${x + 40} 0 ${x} 152" />`;
      }).join("")}
    </g>
    <path d="M92-36h226a124 124 0 0 1-124 124H92Z" fill="${p.flesh}"/>
    <path d="M100-22h198a108 108 0 0 1-108 96H100Z" fill="${p.core}" opacity="0.65"/>
    ${[0, 1, 2, 3].map((i) => `<ellipse cx="${160 + i * 44}" cy="${30 + (i % 2) * 26}" rx="7" ry="12" fill="${p.seed}"/>`).join("")}
    ${leaf(-150, -140, 0, p.leaf, -26)}`,
  grapes: (p) => `
    <ellipse cx="16" cy="96" rx="196" ry="188" fill="${p.shadow}" opacity="0.3"/>
    <path d="M0-150c22-70 4-118-22-150" fill="none" stroke="${p.stem}" stroke-width="12" stroke-linecap="round"/>
    ${[
      [-84, -106],
      [0, -120],
      [84, -100],
      [-42, -60],
      [44, -56],
      [-122, -44],
      [124, -40],
      [-84, -8],
      [0, -16],
      [84, -4],
      [-44, 40],
      [44, 44],
      [0, 92],
      [-84, 84],
      [84, 86],
      [0, 148],
    ]
      .map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="52" fill="${p.grape}"/><circle cx="${x - 16}" cy="${y - 18}" r="12" fill="#ffffff" opacity="0.22"/>`,
      )
      .join("")}
    <path d="M-14-166c64-18 122-2 152 40-58 26-122 8-152-40Z" fill="${p.leaf}"/>
    <path d="M-30-160c-18-52-2-98 40-122 22 50 6 100-40 122Z" fill="${p.leaf}" opacity="0.86"/>`,
  tropical: (p) => `
    <ellipse cx="18" cy="98" rx="222" ry="176" fill="${p.shadow}" opacity="0.28"/>
    <g transform="translate(-110 10) rotate(-12)">
      <ellipse cx="0" cy="0" rx="132" ry="176" fill="${p.dragon}"/>
      <g fill="${p.scale}">
        <path d="M-116-90-166-134l28 84Z"/><path d="M-126 0-182-18l20 78Z"/>
        <path d="M-108 92-154 140l70-16Z"/><path d="M112-80 166-118l-24 92Z"/>
        <path d="M120 18 176 4l-24 78Z"/><path d="M104 100 152 146l-62-16Z"/>
      </g>
      <ellipse cx="-40" cy="-58" rx="34" ry="58" fill="#ffffff" opacity="0.16" transform="rotate(-18 -40 -58)"/>
    </g>
    <g transform="translate(128 44)">
      <circle cx="0" cy="0" r="132" fill="${p.papaya}"/>
      <circle cx="0" cy="0" r="104" fill="${p.papayaFlesh}"/>
      <g fill="${p.seed}">
        ${Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          return `<circle cx="${Math.cos(a) * 62}" cy="${Math.sin(a) * 62}" r="11"/>`;
        }).join("")}
      </g>
      ${leaf(-118, -112, 0, p.leaf, -30)}
    </g>`,
  vegetables: (p) => `
    <ellipse cx="14" cy="96" rx="224" ry="174" fill="${p.shadow}" opacity="0.28"/>
    <g transform="translate(-118 70) rotate(8)">
      <path d="M-34-110h68l-22 300h-24Z" fill="${p.carrot}"/>
      <g stroke="${p.carrotLine}" stroke-width="5" opacity="0.55" fill="none">
        <path d="M-26-58h48M-22 8h38M-18 74h30M-14 140h22"/>
      </g>
      <g fill="${p.top}">
        <path d="M-26-112c-32-58-18-108 8-140 20 48 20 96-8 140Z"/>
        <path d="M10-116c10-62 44-96 82-104-10 52-38 90-82 104Z"/>
        <path d="M-4-116c-4-58-30-92-64-108 8 48 26 84 64 108Z" opacity="0.8"/>
      </g>
    </g>
    <g transform="translate(120 30)">
      <path d="M-104-60c-16-88 30-134 92-140 62-6 112 42 118 128 6 84-42 168-102 170-62 2-96-74-108-158Z" fill="${p.pepper}"/>
      <path d="M-78-72c-8-56 20-88 62-92 44-4 78 26 82 84 4 56-26 96-68 98-42 2-70-34-76-90Z" fill="#ffffff" opacity="0.14"/>
      <path d="M-16-198c-4-30 10-52 34-64 4 30-6 52-34 64Z" fill="${p.top}"/>
      <path d="M-18-198c10-38 36-58 68-60" fill="none" stroke="${p.top}" stroke-width="12" stroke-linecap="round"/>
    </g>`,
};

const palettes = {
  avocados: [
    { bg1: "#eef2e1", bg2: "#dfe8d2", glow: "#f7f5e6", ring: "#a8b992", hill: "#c9d8b4", shadow: "#4e6a3f", skin: "#2f4f34", flesh: "#a9c46a", core: "#d8e6a8", pit: "#7c4f30", leaf: "#3f6a45" },
    { bg1: "#f4ecdc", bg2: "#e8ddc7", glow: "#fbf5e8", ring: "#c2a37d", hill: "#ddcaaa", shadow: "#5b4c33", skin: "#26402c", flesh: "#b6cf79", core: "#e2edb8", pit: "#8a5a33", leaf: "#41663f" },
    { bg1: "#e8efe3", bg2: "#d7e4d3", glow: "#f4f7eb", ring: "#93ac8d", hill: "#bed3b6", shadow: "#3f5a41", skin: "#1f3d2b", flesh: "#9db963", core: "#cfdf9c", pit: "#704527", leaf: "#35603c" },
  ],
  mangoes: [
    { bg1: "#fbeedb", bg2: "#f5dfc2", glow: "#fff8ec", ring: "#d9a870", hill: "#f0d3a8", shadow: "#a5672a", skin: "#e7a63c", shade: "#d07a24", leaf: "#3e6642", stem: "#5a4226" },
    { bg1: "#f6efdd", bg2: "#ecdcc0", glow: "#fdf7e9", ring: "#c9a97c", hill: "#e7d3ac", shadow: "#8f5b2a", skin: "#daa04a", shade: "#b8702a", leaf: "#456a43", stem: "#5c4328" },
    { bg1: "#fdf1e0", bg2: "#f7e4ca", glow: "#fffaf1", ring: "#e0b482", hill: "#f2d9b4", shadow: "#ad6b25", skin: "#eeb54d", shade: "#cf8527", leaf: "#3b633d", stem: "#54401f" },
  ],
  pineapples: [
    { bg1: "#f4ecd9", bg2: "#e9dcbe", glow: "#fdf8ea", ring: "#c9a96f", hill: "#e2d1a8", shadow: "#8a6a2c", body: "#d9a83f", hatch: "#b07f26", crown: "#3f6b45" },
    { bg1: "#f1ead6", bg2: "#e4d7ba", glow: "#fcf6e6", ring: "#b89c6c", hill: "#dcc9a1", shadow: "#7d5c25", body: "#cfa03c", hatch: "#a6761f", crown: "#486e3b" },
    { bg1: "#f6efe0", bg2: "#ecdfc6", glow: "#fffdf4", ring: "#d3b17a", hill: "#e7d5b1", shadow: "#94702e", body: "#e0b254", hatch: "#b9872b", crown: "#38613f" },
  ],
  citrus: [
    { bg1: "#fdf0da", bg2: "#f7e0bc", glow: "#fffaef", ring: "#dda969", hill: "#f2d4a4", shadow: "#a56924", skin: "#e08a33", flesh: "#f0b25a", core: "#fdf3dd", leaf: "#3f6a45" },
    { bg1: "#f7f1d9", bg2: "#ece1b9", glow: "#fffcee", ring: "#cbb978", hill: "#e4d8a8", shadow: "#91762c", skin: "#dcbc45", flesh: "#efd77a", core: "#fdf9e2", leaf: "#42683d" },
    { bg1: "#f8e4d9", bg2: "#f2cdbb", glow: "#fff7f0", ring: "#d68d73", hill: "#edc3ad", shadow: "#9b4530", skin: "#cf5f43", flesh: "#e78a63", core: "#fbeee6", leaf: "#3c6140" },
  ],
  bananas: [
    { bg1: "#f7f1de", bg2: "#eee1c0", glow: "#fffbed", ring: "#cbb47c", hill: "#e6d5ac", shadow: "#8f7a35", skin: "#e3c257", light: "#f4e29a", tip: "#6b5222" },
    { bg1: "#f2ecd8", bg2: "#e6d9b9", glow: "#fdf8e7", ring: "#bda56f", hill: "#dcc9a2", shadow: "#7f6a2d", skin: "#d4b34b", light: "#edd990", tip: "#5e4720" },
    { bg1: "#faf3e4", bg2: "#f0e4c8", glow: "#fffdf5", ring: "#d6bd86", hill: "#eadcb8", shadow: "#9a843c", skin: "#edd067", light: "#f9e9a7", tip: "#725a25" },
  ],
  berries: [
    { bg1: "#f4e7e9", bg2: "#ecd6da", glow: "#fff7f7", ring: "#cf9aa2", hill: "#e8c8cf", shadow: "#6e3a44", berry: "#b93a44", leaf: "#3d6a45" },
    { bg1: "#e9ecf1", bg2: "#dbe1ec", glow: "#f8faff", ring: "#9fabc4", hill: "#cbd4e4", shadow: "#38415c", berry: "#40507a", leaf: "#41684a" },
    { bg1: "#f1e8f0", bg2: "#e5d8e7", glow: "#fdf8fd", ring: "#bda0c4", hill: "#dcc7e0", shadow: "#4e3556", berry: "#6c4b7c", leaf: "#446a45" },
  ],
  melons: [
    { bg1: "#eef1e2", bg2: "#e0e6ce", glow: "#fbfcef", ring: "#a7b489", hill: "#cfd9b2", shadow: "#5b6738", rind: "#9aab5c", net: "#7e8f45", flesh: "#e6a05a", core: "#f2c99a", seed: "#5b4023", leaf: "#3f6a45" },
    { bg1: "#f3eee1", bg2: "#e8dfc9", glow: "#fdfaf0", ring: "#c0ab84", hill: "#ddd0b0", shadow: "#6f5c33", rind: "#b9a85f", net: "#8f7f40", flesh: "#e8994f", core: "#f5c58d", seed: "#4f3a20", leaf: "#446a42" },
    { bg1: "#e9efe8", bg2: "#d9e4d8", glow: "#f9fcf5", ring: "#9cb39a", hill: "#c3d5bd", shadow: "#476348", rind: "#8f9f68", net: "#748552", flesh: "#dfa36a", core: "#f0caa3", seed: "#54402a", leaf: "#3a6340" },
  ],
  grapes: [
    { bg1: "#efe8ef", bg2: "#e2d7e5", glow: "#fbf6fc", ring: "#b49cb9", hill: "#d8c6dc", shadow: "#4b3653", grape: "#5b4667", leaf: "#436a45", stem: "#5a4a35" },
    { bg1: "#e9eeea", bg2: "#d9e3dc", glow: "#f8fcf8", ring: "#9db2a4", hill: "#c2d3c8", shadow: "#33493c", grape: "#3f5c4a", leaf: "#3d6540", stem: "#4b4131" },
    { bg1: "#f6ebe6", bg2: "#ecd9d2", glow: "#fff9f6", ring: "#cfa496", hill: "#e5c8bd", shadow: "#6d3d33", grape: "#8a4a4e", leaf: "#43663f", stem: "#5c4637" },
  ],
  tropical: [
    { bg1: "#fbe9e3", bg2: "#f5d5cc", glow: "#fff8f5", ring: "#dda294", hill: "#f0c5b8", shadow: "#8c4a3e", dragon: "#d9536b", scale: "#8fa84f", papaya: "#d98a32", papayaFlesh: "#f0a94e", seed: "#3f3129", leaf: "#3f6a45" },
    { bg1: "#f7efdc", bg2: "#eddfc4", glow: "#fffbf0", ring: "#cdb182", hill: "#e5d1ac", shadow: "#7f5c2f", dragon: "#c65a4f", scale: "#7f9a4a", papaya: "#cf7d2c", papayaFlesh: "#e79a42", seed: "#3b2f26", leaf: "#426a42" },
    { bg1: "#fae8e8", bg2: "#f3d3d6", glow: "#fff7f8", ring: "#d99aa4", hill: "#eec1c4", shadow: "#833d48", dragon: "#c94863", scale: "#86a050", papaya: "#df9a3f", papayaFlesh: "#f2b562", seed: "#42342a", leaf: "#3d6642" },
  ],
  vegetables: [
    { bg1: "#e9efe1", bg2: "#dbe5cf", glow: "#f9fcf1", ring: "#9fb78c", hill: "#c8d9b4", shadow: "#4c6138", carrot: "#dd8035", carrotLine: "#a95c22", top: "#45693f", pepper: "#b8452f" },
    { bg1: "#f1eee0", bg2: "#e6dfc7", glow: "#fcfaf0", ring: "#c0b189", hill: "#ded2b0", shadow: "#685c39", carrot: "#cf7734", carrotLine: "#9d5622", top: "#4a6a3d", pepper: "#c05a33" },
    { bg1: "#e7efe6", bg2: "#d7e4d5", glow: "#f7fcf4", ring: "#95ad91", hill: "#c0d3ba", shadow: "#415940", carrot: "#e08a40", carrotLine: "#b06326", top: "#3c633c", pepper: "#a63f2c" },
  ],
};

const products = {
  avocados: ["hass", "fuerte", "reed"],
  mangoes: ["kent", "keitt", "palmer"],
  pineapples: ["smooth-cayenne", "md2", "queen"],
  citrus: ["oranges", "lemons", "grapefruit"],
  bananas: ["cavendish", "lady-finger", "plantain"],
  berries: ["blueberries", "raspberries", "blackberries"],
  melons: ["cantaloupe", "honeydew", "watermelon"],
  grapes: ["white-seedless", "red-globe", "crimson"],
  tropical: ["dragon-fruit", "papaya", "passion-fruit"],
  vegetables: ["carrots", "peppers", "leafy-greens"],
};

const editorial = [
  {
    file: "field",
    id: "field",
    palette: { bg1: "#173c2d", bg2: "#0f2b21", glow: "#3f6a4f", ring: "#6f9578", hill: "#24513c" },
    body: `<g opacity="0.92">
      <circle cx="250" cy="-180" r="150" fill="#e8dcc0" opacity="0.9"/>
      ${Array.from({ length: 9 }, (_, i) => {
        const y = 40 + i * 46;
        return `<path d="M-560 ${y}Q0 ${y - 90 + i * 8} 560 ${y}" fill="none" stroke="#8fae8d" stroke-width="${2 + i * 0.3}" opacity="${0.55 - i * 0.03}"/>`;
      }).join("")}
      <path d="M-560 200Q0 90 560 180v340H-560Z" fill="#2f5d45" opacity="0.55"/>
    </g>`,
  },
  {
    file: "quality",
    id: "quality",
    palette: { bg1: "#f2ecdf", bg2: "#e5dac4", glow: "#fdf9ee", ring: "#c3ab84", hill: "#dbcaa9" },
    body: `<g>
      <ellipse cx="0" cy="120" rx="330" ry="90" fill="#c9b48c" opacity="0.5"/>
      <g>
        ${[
          [-210, 20, 84],
          [-70, -20, 96],
          [86, 26, 78],
        ]
          .map(
            ([x, y, r]) =>
              `<circle cx="${x}" cy="${y}" r="${r}" fill="#e08a33"/><path d="M${x} ${y - r}A${r} ${r} 0 0 1 ${x + r} ${y}" stroke="#c0742a" stroke-width="3" fill="none" opacity="0.6"/>`,
          )
          .join("")}
      </g>
      <path d="M-250-150h500v96h-500Z" fill="#14352a"/>
      <path d="M-250-64h500v28h-500Z" fill="#c08a3e"/>
      <g fill="#faf7ef" opacity="0.9">
        <rect x="-206" y="-128" width="120" height="42" rx="6"/>
        <rect x="-60" y="-128" width="160" height="42" rx="6"/>
      </g>
    </g>`,
  },
  {
    file: "orchard",
    id: "orchard",
    palette: { bg1: "#eef0e0", bg2: "#dfe6cd", glow: "#fbfcf1", ring: "#a9b985", hill: "#cbd9ad" },
    body: `<g>
      <circle cx="260" cy="-210" r="120" fill="#e3c257" opacity="0.8"/>
      ${Array.from({ length: 5 }, (_, i) => {
        const x = -400 + i * 200;
        return `<g transform="translate(${x} ${i % 2 ? 40 : 0})">
          <rect x="-9" y="-20" width="18" height="240" fill="#7c6034"/>
          <circle cx="0" cy="-70" r="120" fill="${i % 2 ? "#3f6a45" : "#4b7449"}"/>
          <circle cx="-60" cy="-110" r="66" fill="#5b8154" opacity="0.7"/>
          <circle cx="66" cy="-60" r="46" fill="#2f5d3f" opacity="0.55"/>
        </g>`;
      }).join("")}
      <path d="M-620 330Q0 210 620 330v180H-620Z" fill="#9fb884" opacity="0.55"/>
    </g>`,
  },
  {
    file: "news-1",
    id: "news1",
    palette: { bg1: "#f5ece0", bg2: "#ecdccb", glow: "#fff9f2", ring: "#cdaa84", hill: "#e3cbb0" },
    body: `<g>
      <rect x="-250" y="-150" width="500" height="320" rx="20" fill="#14352a"/>
      <g stroke="#c08a3e" stroke-width="3" opacity="0.85" fill="none">
        <path d="M-200-90h400M-200-30h400M-200 30h400M-200 90h400"/>
      </g>
      <circle cx="180" cy="70" r="82" fill="#e08a33"/>
      <circle cx="40" cy="86" r="58" fill="#a9c46a"/>
      <path d="M-200 130Q0 40 200 130" stroke="#faf7ef" stroke-width="5" fill="none"/>
    </g>`,
  },
  {
    file: "news-2",
    id: "news2",
    palette: { bg1: "#e9efe6", bg2: "#dae5d6", glow: "#f8fcf4", ring: "#9fb497", hill: "#c5d6be" },
    body: `<g>
      ${Array.from({ length: 4 }, (_, i) => {
        const x = -270 + i * 180;
        return `<rect x="${x}" y="-120" width="130" height="230" rx="12" fill="${i % 2 ? "#c08a3e" : "#2f5d45"}"/>
        <rect x="${x + 20}" y="-88" width="90" height="52" rx="6" fill="#faf7ef" opacity="0.85"/>
        <path d="M${x + 20} 10h90M${x + 20} 42h64" stroke="#faf7ef" stroke-width="5" opacity="0.75"/>`;
      }).join("")}
      <circle cx="330" cy="160" r="86" fill="#b4553f" opacity="0.75"/>
    </g>`,
  },
  {
    file: "news-3",
    id: "news3",
    palette: { bg1: "#f7eedb", bg2: "#efe0c4", glow: "#fffbf0", ring: "#cbae7c", hill: "#e6d3aa" },
    body: `<g>
      <path d="M-300 120Q-120-190 80-40T360-160" fill="none" stroke="#2f5d45" stroke-width="10" opacity="0.7"/>
      <g fill="#c08a3e">
        ${[
          [-230, 26],
          [-90, -96],
          [60, -10],
          [210, -90],
          [320, -186],
        ]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="34"/>`)
          .join("")}
      </g>
      <path d="M-300 230h660" stroke="#8a7449" stroke-width="3" stroke-dasharray="10 14"/>
    </g>`,
  },
];

for (const [category, space] of Object.entries(products)) {
  space.forEach((product, index) => {
    const palette = palettes[category][index % 3];
    const svg = frame(
      `${category}-${product}`,
      palette,
      motifs[category](palette),
      [-6, 4, -2][index % 3],
    );
    writeFileSync(join(ART_DIR, `${category}-${product}.svg`), svg);
  });
  const cover = frame(
    category,
    palettes[category][0],
    motifs[category](palettes[category][0]),
    0,
  );
  writeFileSync(join(ART_DIR, `${category}.svg`), cover);
}

for (const item of editorial) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img">
  <defs>
    <linearGradient id="bg-${item.id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${item.palette.bg1}"/>
      <stop offset="1" stop-color="${item.palette.bg2}"/>
    </linearGradient>
    <radialGradient id="g-${item.id}" cx="70%" cy="10%" r="80%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="c-${item.id}"><rect width="${W}" height="${H}"/></clipPath>
  </defs>
  <g clip-path="url(#c-${item.id})">
    <rect width="${W}" height="${H}" fill="url(#bg-${item.id})"/>
    <rect width="${W}" height="${H}" fill="url(#g-${item.id})"/>
    <g transform="translate(${W / 2} ${H / 2})">${item.body}</g>
  </g>
</svg>`;
  writeFileSync(join(ART_DIR, `${item.file}.svg`), svg);
}

console.log("Artwork written to public/art.");
