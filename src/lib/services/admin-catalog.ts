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
