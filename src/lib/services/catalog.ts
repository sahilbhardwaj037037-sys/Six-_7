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
 * Real DB variants/sizes are evaluated for stock and colors here, but kept in DB 
 * for future DB-backed Cart & Checkout phases.
 */
export function mapProductToShopProduct(product: ProductWithRelations): ShopProduct {
  // Safe media fallback
  const mainMedia = product.media.find(m => m.isMain) || product.media[0];
  const secondaryMedia = product.media.filter(m => !m.isMain).sort((a, b) => a.order - b.order)[0];

  // Map variants to unique colorways
  const uniqueColorHexes = Array.from(
  new Set(
    product.variants
      .map(v => v.colorHex)
      .filter((hex): hex is string => hex !== null && hex !== undefined)
  )
);

  // Resolve inventory availability across all variants
  const inStock = product.variants.some(v => v.inventory && v.inventory.quantity > 0);

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
    colorways: uniqueColorHexes,
    inStock,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
    featured: product.featured,
    createdAt: product.createdAt.toISOString(),
  };
}

/**
 * Fetches all active products, optionally filtered by Prisma WhereInput.
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
        include: { inventory: true },
      },
    },
  });

  if (!product) return null;

  return mapProductToShopProduct(product);
}
