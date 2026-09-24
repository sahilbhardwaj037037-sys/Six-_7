"use server";

import { getProducts } from "@/lib/services/catalog";
import { Prisma } from "@/generated/prisma/client";

export async function getSearchSuggestions(query: string) {
  try {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    const where: Prisma.ProductWhereInput = {
      OR: [
        { name: { contains: trimmed, mode: "insensitive" } },
        { slug: { contains: trimmed, mode: "insensitive" } },
        { category: { name: { contains: trimmed, mode: "insensitive" } } },
      ],
    };

    // Use the existing service logic exclusively
    const products = await getProducts(where);

    // Limit to 4 results and strip unnecessary fields to keep payload tiny
    return products.slice(0, 4).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      imageUrl: p.imageUrl,
    }));
  } catch (error) {
    console.error("Search suggestion error:", error);
    return []; // Fail gracefully
  }
}
