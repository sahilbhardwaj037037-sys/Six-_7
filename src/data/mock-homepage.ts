export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  imageUrl: string;
  colorways: string[];
}

export interface Collection {
  id: string;
  title: string;
  tagline: string;
  slug: string;
  imageUrl: string;
  itemCount: number;
}

export const HERO_SLIDES = [
  {
    id: "hero-1",
    eyebrow: "Autumn / Winter 2026 Collection",
    title: "Sculpted Velocity",
    subtitle: "Precision engineering meets monochromatic luxury. Handcrafted Italian leather upper paired with our bespoke structural dampening sole.",
    ctaText: "Explore Collection",
    ctaLink: "/shop",
    secondaryCta: "View Editorial",
    secondaryLink: "#story",
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1800&q=85",
  },
];

export const FEATURED_COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    title: "Atelier Monochrome",
    tagline: "Ultra-clean silhouettes tailored for everyday architectural cadence.",
    slug: "atelier-monochrome",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80",
    itemCount: 14,
  },
  {
    id: "col-2",
    title: "Vanguard Trail",
    tagline: "Weatherproof membrane with hyper-dense lug geometries.",
    slug: "vanguard-trail",
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80",
    itemCount: 8,
  },
  {
    id: "col-3",
    title: "Studio Runners",
    tagline: "Zero-drag propulsion engineered with bio-foam composites.",
    slug: "studio-runners",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    itemCount: 12,
  },
];

export const NEW_ARRIVALS: Product[] = [
  {
    id: "prod-1",
    slug: "v1-phantom-low-noir",
    name: "Six&7 V1 Phantom Low",
    category: "Sculpted Low-Top",
    price: 320,
    badge: "Limited Drop",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    colorways: ["#111111", "#E5E5E5", "#8A8A8E"],
  },
  {
    id: "prod-2",
    slug: "aeroform-kinetic-high",
    name: "Aeroform Kinetic High",
    category: "Architectural Court",
    price: 380,
    badge: "New Silhouette",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    colorways: ["#1A1A1A", "#FFFFFF"],
  },
  {
    id: "prod-3",
    slug: "strata-minimalist-runner",
    name: "Strata Minimalist Runner",
    category: "Bio-Foam Athletic",
    price: 260,
    imageUrl: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80",
    colorways: ["#2B2D42", "#8D99AE", "#EDF2F4"],
  },
  {
    id: "prod-4",
    slug: "nadir-leather-derby",
    name: "Nadir Leather Derby Sneaker",
    category: "Smart Footwear",
    price: 410,
    badge: "Handmade",
    imageUrl: "https://images.unsplash.com/photo-1617606002779-51d866bdd1d1?auto=format&fit=crop&w=800&q=80",
    colorways: ["#111111", "#3D2B1F"],
  },
];

export const BEST_SELLERS: Product[] = [
  {
    id: "prod-5",
    slug: "apex-monolith-slip-on",
    name: "Apex Monolith Slip-On",
    category: "Seamless Ergonomic",
    price: 290,
    badge: "Core Icon",
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    colorways: ["#171717", "#D4D4D8"],
  },
  {
    id: "prod-6",
    slug: "echo-matrix-runner-02",
    name: "Echo Matrix Runner 02",
    category: "Performance Cushion",
    price: 340,
    originalPrice: 390,
    badge: "Featured",
    imageUrl: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80",
    colorways: ["#0A0A0A", "#FAFAFA"],
  },
  {
    id: "prod-7",
    slug: "forma-off-grid-mule",
    name: "Forma Off-Grid Mule",
    category: "Hybrid Casual",
    price: 230,
    imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
    colorways: ["#E4E4E7", "#71717A"],
  },
  {
    id: "prod-8",
    slug: "kinesis-track-low",
    name: "Kinesis Track Low",
    category: "Track & Field Lifestyle",
    price: 275,
    badge: "Bestseller",
    imageUrl: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80",
    colorways: ["#1F2937", "#9CA3AF"],
  },
];

export const BRAND_PILLARS = [
  {
    number: "01",
    title: "Structural Purity",
    description:
      "Every curve and seam serves ergonomic load dissipation. We eliminate superfluous trims to expose the natural geometry of high-performance footwear.",
  },
  {
    number: "02",
    title: "Tuscan Leather Sourcing",
    description:
      "Full-grain hides vegetable-tanned in small batches outside Florence, delivering a patina that matures distinctly with your gait.",
  },
  {
    number: "03",
    title: "Closed-Loop Poly-Foam",
    description:
      "Our proprietary mid-soles utilize 64% post-industrial recycled polymers with zero loss in spring-rate longevity or energy return.",
  },
];
