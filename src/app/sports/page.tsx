import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryLandingView, CategoryLandingConfig } from "@/components/category/CategoryLandingView";
import { SHOP_PRODUCTS } from "@/data/mock-products";

export const metadata: Metadata = {
  title: "Sports & Performance // Six&7 Atelier",
  description:
    "Bio-mechanic footwear calibrated for road running, court performance, technical trails, and athletic conditioning.",
};

const SPORTS_CONFIG: CategoryLandingConfig = {
  slug: "sports",
  eyebrow: "Performance Division // Dynamic Systems",
  title: "Sports & Disciplines",
  subtitle:
    "Biomechanically calibrated instruments engineered for responsive rebound, multi-surface friction, and torsional control.",
  description:
    "Our Performance Division strips away non-functional aesthetics to isolate pure athletic leverage. Whether covering ultra-distance road miles, executing high-impact court cuts, or tackling technical off-grid ascents, each model integrates proprietary dampening plates and breathable mono-mesh uppers.",
  heroImage:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=85",
  editorialNote: "Engineered output through calculated mechanics.",
  stats: [
    { label: "Energy Return", value: "88% Rebound", description: "Bespoke nitrogen-infused foam" },
    { label: "Stability", value: "Carbon Chassis", description: "Torsional midfoot control plate" },
    { label: "Compound", value: "Multi-Traction", description: "Zonal high-abrasion rubber" },
  ],
  explorePills: [
    { label: "Road Running", href: "/shop?category=running" },
    { label: "Court Performance", href: "/shop?category=court" },
    { label: "Trail & Outdoor", href: "/shop?category=trail" },
    { label: "Athletic Conditioning", href: "/shop?category=sneakers" },
  ],
};

export default function SportsPage() {
  const sportsProducts = SHOP_PRODUCTS.filter((product) => product.sport !== "lifestyle");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <CategoryLandingView config={SPORTS_CONFIG} products={sportsProducts} />
      </main>
      <Footer />
    </div>
  );
}
