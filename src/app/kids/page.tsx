import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryLandingView, CategoryLandingConfig } from "@/components/category/CategoryLandingView";
import { SHOP_PRODUCTS } from "@/data/mock-products";

export const metadata: Metadata = {
  title: "Junior Collection // Six&7 Atelier",
  description:
    "Architectural engineering scaled down for growing feet. Resilient compounds and adaptive slip-on comfort.",
};

const KIDS_CONFIG: CategoryLandingConfig = {
  slug: "kids",
  eyebrow: "Junior Atelier // Scale 01",
  title: "Junior Collection",
  subtitle:
    "Signature Six&7 industrial design language distilled into ultra-durable, adaptive silhouettes for younger paces.",
  description:
    "The Junior Collection adapts our architectural aesthetic for young explorers. Designed with reinforced toe guards, high-rebound flex soles, and effortless entry systems, each model is engineered to withstand active daily wear while sustaining developing posture.",
  heroImage:
    "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1800&q=85",
  editorialNote: "Engineered resilience for rapid development.",
  stats: [
    { label: "Durability", value: "Reinforced", description: "Abrasion-resistant compound" },
    { label: "Closure", value: "Adaptive", description: "Easy-entry slip and flex laces" },
    { label: "Footbed", value: "Anatomic", description: "Natural arch guidance support" },
  ],
  explorePills: [
    { label: "Junior Runners", href: "/shop?category=sneakers" },
    { label: "Slip-On Silhouettes", href: "/shop?category=mules" },
    { label: "All Junior Models", href: "/shop" },
  ],
};

export default function KidsPage() {
  const kidsProducts = SHOP_PRODUCTS.filter((product) => product.gender === "kids");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <CategoryLandingView config={KIDS_CONFIG} products={kidsProducts} />
      </main>
      <Footer />
    </div>
  );
}
