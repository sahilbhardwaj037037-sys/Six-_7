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
