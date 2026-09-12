import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryLandingView, CategoryLandingConfig } from "@/components/category/CategoryLandingView";
import { SHOP_PRODUCTS } from "@/data/mock-products";

export const metadata: Metadata = {
  title: "Women's Collection // Six&7 Atelier",
  description:
    "Minimalist runners, sculptural off-grid mules, and refined court profiles curated for women.",
};

const WOMEN_CONFIG: CategoryLandingConfig = {
  slug: "women",
  eyebrow: "Atelier Feminine // Series 02",
  title: "Women's Collection",
  subtitle:
    "Sculptural lines, featherweight cushioning, and refined ergonomics designed for intentional movement.",
  description:
    "The Women's edit highlights streamlined profiles, glove-soft leather linings, and minimalist contours. From architectural slip-ons to studio-engineered runners, each pair emphasizes fluid poise without compromising on support.",
  heroImage:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85",
  editorialNote: "Proportioned for fluid poise and lightweight grace.",
  stats: [
    { label: "Profile", value: "Zero-Drag", description: "Featherweight composite foam" },
    { label: "Lining", value: "Micro-Suede", description: "Seamless interior ergonomics" },
    { label: "Form", value: "Sculpted", description: "Clean lines and beveled soles" },
  ],
  explorePills: [
    { label: "Minimalist Runners", href: "/shop?category=running" },
    { label: "Off-Grid Mules", href: "/shop?category=mules" },
    { label: "Court Minimal", href: "/shop?category=court" },
    { label: "Slip-On Silhouettes", href: "/shop?category=sneakers" },
  ],
};

export default function WomenPage() {
  const womenProducts = SHOP_PRODUCTS.filter(
    (product) => product.gender === "women" || product.gender === "unisex"
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <CategoryLandingView config={WOMEN_CONFIG} products={womenProducts} />
      </main>
      <Footer />
    </div>
  );
}
