/**
 * Editorial photography for the homepage. Files live in `public/photos` and are
 * credited in PHOTO-CREDITS.md. Catalogue routes continue to use their own art.
 */
export const categoryPhotos: Record<string, string> = {
  avocados: "/photos/avocados.jpg",
  mangoes: "/photos/mangoes.jpg",
  pineapples: "/photos/pineapples.jpg",
  citrus: "/photos/citrus.jpg",
  bananas: "/photos/bananas.jpg",
  berries: "/photos/berries.jpg",
  melons: "/photos/melons.jpg",
  grapes: "/photos/grapes.jpg",
  "tropical-fruits": "/photos/tropical.jpg",
  vegetables: "/photos/vegetables.jpg",
};

export const featuredLines = [
  {
    categoryId: "avocados",
    productSlug: "hass",
    photo: "/photos/feat-hass.jpg",
  },
  {
    categoryId: "berries",
    productSlug: "blueberries",
    photo: "/photos/feat-blueberries.jpg",
  },
  {
    categoryId: "citrus",
    productSlug: "oranges",
    photo: "/photos/feat-oranges.jpg",
  },
  {
    categoryId: "grapes",
    productSlug: "red-globe",
    photo: "/photos/feat-grapes.jpg",
  },
] as const;
