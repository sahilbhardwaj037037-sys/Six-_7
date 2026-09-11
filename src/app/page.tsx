import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CollectionsGrid } from "@/components/home/CollectionsGrid";
import { ProductGridSection } from "@/components/home/ProductGridSection";
import { BrandStorySection } from "@/components/home/BrandStorySection";
import { PromotionalCtaSection } from "@/components/home/PromotionalCtaSection";
import { NEW_ARRIVALS, BEST_SELLERS } from "@/data/mock-homepage";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Featured Collections / Categories */}
        <CollectionsGrid />

        {/* 3. New Arrivals */}
        <ProductGridSection
          id="new-arrivals"
          eyebrow="Drop 03 // 2026"
          title="New Arrivals"
          description="Newly released architectural silhouettes and bio-composite sneakers."
          products={NEW_ARRIVALS}
          viewAllHref="/shop?filter=new"
        />

        {/* 4. Brand & Craftsmanship Story */}
        <BrandStorySection />

        {/* 5. Best Sellers */}
        <ProductGridSection
          id="best-sellers"
          eyebrow="Studio Icons"
          title="Best Sellers"
          description="Permanent collection silhouettes celebrated for everyday cadence."
          products={BEST_SELLERS}
          viewAllHref="/shop?filter=bestsellers"
        />

        {/* 6. Promotional Offer & Strong CTA */}
        <PromotionalCtaSection />
      </main>

      {/* 7. Editorial Footer */}
      <Footer />
    </div>
  );
}
