import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Globe Harvest — Premium Fresh Produce",
    short_name: "Globe Harvest",
    description:
      "Globe Harvest is a B2B fresh produce import, export and wholesale brand for premium fruit and vegetables.",
    start_url: "/en",
    display: "standalone",
    background_color: "#faf7ef",
    theme_color: "#14352a",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/brand/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      { name: "Catalogue", url: "/en/products" },
      { name: "Contact", url: "/en/contact" },
    ],
  };
}
