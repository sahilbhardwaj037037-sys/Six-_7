import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShopClient } from "@/components/shop/ShopClient";
import { getProducts } from "@/lib/services/catalog";

export const metadata = {
  title: "All Footwear // Six&7 Atelier",
  description:
    "Explore the permanent catalog of Six&7 footwear. Architectural sneakers, bio-composite runners, and handcrafted Italian leather silhouettes.",
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Navbar />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                Loading Catalog...
              </span>
            </div>
          }
        >
          <ShopClient initialProducts={products} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
