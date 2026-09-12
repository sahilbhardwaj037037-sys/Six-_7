import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryLandingView, CategoryLandingConfig } from "@/components/category/CategoryLandingView";
import { SHOP_PRODUCTS } from "@/data/mock-products";

export const metadata: Metadata = {
  title: "Men's Collection // Six&7 Atelier",
  description:
    "Sculpted architectural silhouettes, technical court profiles, and monochrome luxury footwear designed for men.",
};

const MEN_CONFIG: CategoryLandingConfig = {
  slug: "men",
  eyebrow: "Atelier Masculine // Edition 03",
  title: "Men's Collection",
  subtitle:
    "Architectural geometries engineered with Italian full-grain leather, carbon-reinforced stability, and bio-foam cushioning.",
  description:
    "The Men's roster balances structural presence with effortless daily comfort. Built for urban navigators and design purists, each silhouette is calibrated to provide subtle cushioning and lasting durability.",
  heroImage:
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1800&q=85",
  editorialNote: "Calibrated for everyday architectural cadence.",
  stats: [
    { label: "Construction", value: "Bio-Composite", description: "Ultralight structural soles" },
    { label: "Materiality", value: "Italian Full-Grain", description: "Vegetable-tanned calfskin" },
    { label: "Palette", value: "Monochrome", description: "Noir, Chalk, and Slate" },
  ],
  explorePills: [
    { label: "Court Silhouettes", href: "/shop?category=court" },
    { label: "Low-Tops", href: "/shop?category=sneakers" },
    { label: "Trail & Weatherproof", href: "/shop?category=trail" },
    { label: "Derby Sneakers", href: "/shop?category=derby" },
  ],
};

export default function MenPage() {
  const menProducts = SHOP_PRODUCTS.filter(
    (product) => product.gender === "men" || product.gender === "unisex"
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <CategoryLandingView config={MEN_CONFIG} products={menProducts} />
      </main>
      <Footer />
    </div>
  );
}
