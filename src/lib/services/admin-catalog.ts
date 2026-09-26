import { prisma } from "@/lib/prisma";

/**
 * Fetches all brands for the Admin catalog interface.
 * Ordered alphabetically by name.
 */
export async function getBrands() {
  return prisma.brand.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

/**
 * Fetches all categories for the Admin catalog interface.
 * Ordered alphabetically by name.
 */
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

/**
 * Fetches all products for the Admin catalog interface.
 * Includes archived products.
 * Includes Brand and Category relations to display their names in the listing.
 * Omits variants/inventory for the top-level listing performance.
 */
export async function getAdminProducts() {
  return prisma.product.findMany({
    include: {
      brand: {
        select: { name: true },
      },
      category: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Fetches a single product by ID for the Admin edit interface.
 * Does NOT filter by isArchived, allowing drafted products to be edited.
 */
export async function getAdminProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      brand: {
        select: { id: true, name: true },
      },
      category: {
        select: { id: true, name: true },
      },
    },
  });
}
