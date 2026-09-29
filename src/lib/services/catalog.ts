import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import type { ShopProduct, ProductCategory, Gender, SportType } from '@/data/mock-products';

// Define a strict type for the Prisma payload including required relations
type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    media: true;
    variants: {
      include: {
        inventory: true;
      };
    };
  };
}>;

/**
 * Adapter: Transforms PostgreSQL relational data into the existing UI ShopProduct shape.
 * Real DB variants/sizes are evaluated for stock and colors here.
 */
export function mapProductToShopProduct(product: ProductWithRelations): ShopProduct & { availableSizes?: { size: string; available: boolean; colorHex: string | null }[] } {
  // Safe media fallback
  const mainMedia = product.media.find(m => m.isMain) || product.media[0];
  const secondaryMedia = product.media.filter(m => !m.isMain).sort((a, b) => a.order - b.order)[0];

  // Filter out archived variants for customer-facing consideration
  const activeVariants = product.variants.filter(v => !v.isArchived);

  // Map active variants to unique colorways
  const uniqueColorHexes = Array.from(
    new Set(
      activeVariants
        .map(v => v.colorHex)
        .filter((hex): hex is string => hex !== null && hex !== undefined)
    )
  );

  // Resolve inventory availability strictly across active variants
  const inStock = activeVariants.some(v => v.inventory && v.inventory.quantity > 0);

  // Expose the real size inventory for the UI panel
  const availableSizes = activeVariants.map(v => ({
    size: v.size,
    colorHex: v.colorHex,
    available: v.inventory ? (v.inventory.quantity - v.inventory.reserved) > 0 : false
  }));

  // Collect all product and variant media in defined sequence
  const allMediaUrls = product.media && product.media.length > 0
    ? [...product.media].sort((a, b) => {
        if (a.isMain && !b.isMain) return -1;
        if (!a.isMain && b.isMain) return 1;
        return a.order - b.order;
      }).map(m => m.url)
    : [mainMedia?.url || ""].filter(Boolean);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category.name,
    categorySlug: product.category.slug as ProductCategory,
    gender: product.gender.toLowerCase() as Gender,
    sport: product.sport.toLowerCase() as SportType,
    price: Number(product.basePrice),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    badge: product.badge || undefined,
    imageUrl: mainMedia?.url || '',
    secondaryImageUrl: secondaryMedia?.url || undefined,
    images: allMediaUrls,
    colorways: uniqueColorHexes,
    inStock,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
    featured: product.featured,
    createdAt: product.createdAt.toISOString(),
    availableSizes,
  };
}

/**
 * Fetches all active products, optionally filtered by Prisma WhereInput.
 * Excludes archived variants from the variant relation payload.
 */
export async function getProducts(where?: Prisma.ProductWhereInput): Promise<ShopProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      ...where,
    },
    include: {
      category: true,
      media: {
        orderBy: { order: 'asc' }
      },
      variants: {
        where: { isArchived: false },
        include: { inventory: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return products.map(mapProductToShopProduct);
}

/**
 * Fetches a single active product by its unique slug.
 * Excludes archived variants from the variant relation payload.
 */
export async function getProductBySlug(slug: string): Promise<ShopProduct | null> {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      isArchived: false,
    },
    include: {
      category: true,
      media: {
        orderBy: { order: 'asc' }
      },
      variants: {
        where: { isArchived: false },
        include: { inventory: true },
      },
    },
  });

  if (!product) return null;

  return mapProductToShopProduct(product);
}
