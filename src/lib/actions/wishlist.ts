"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user.id;
}

const actionSchema = z.object({
  productId: z.string().min(1),
});

const syncWishlistSchema = z.object({
  productIds: z.array(z.string().min(1)).max(100),
});

export async function addWishlistItem(productId: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const validatedData = actionSchema.parse({ productId });

    // Verify product exists and is not archived
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product || product.isArchived) {
      return { error: "Product is unavailable." };
    }

    await prisma.$transaction(async (tx) => {
      const wishlist = await tx.wishlist.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      await tx.wishlistItem.upsert({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId: validatedData.productId,
          },
        },
        update: {},
        create: {
          wishlistId: wishlist.id,
          productId: validatedData.productId,
        },
      });
    });

    revalidatePath("/wishlist");
    return { success: true };
  } catch (error) {
    console.error("[Add Wishlist Item Error]:", error);
    return { error: "Failed to add item to wishlist. Please try again." };
  }
}

export async function removeWishlistItem(productId: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const validatedData = actionSchema.parse({ productId });

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (wishlist) {
      await prisma.wishlistItem.deleteMany({
        where: {
          wishlistId: wishlist.id,
          productId: validatedData.productId,
        },
      });
    }

    revalidatePath("/wishlist");
    return { success: true };
  } catch (error) {
    console.error("[Remove Wishlist Item Error]:", error);
    return { error: "Failed to remove item from wishlist. Please try again." };
  }
}

export async function clearUserWishlist() {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (wishlist) {
      await prisma.wishlistItem.deleteMany({
        where: { wishlistId: wishlist.id },
      });
    }

    revalidatePath("/wishlist");
    return { success: true };
  } catch (error) {
    console.error("[Clear User Wishlist Error]:", error);
    return { error: "Failed to clear wishlist. Please try again." };
  }
}

export async function toggleWishlist(productId: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const validatedData = actionSchema.parse({ productId });

    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product || product.isArchived) {
      return { error: "Product is unavailable." };
    }

    const result = await prisma.$transaction(async (tx) => {
      const wishlist = await tx.wishlist.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      const existingItem = await tx.wishlistItem.findUnique({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId: validatedData.productId,
          },
        },
      });

      if (existingItem) {
        await tx.wishlistItem.delete({ where: { id: existingItem.id } });
        return { isWishlisted: false };
      } else {
        await tx.wishlistItem.create({
          data: {
            wishlistId: wishlist.id,
            productId: validatedData.productId,
          },
        });
        return { isWishlisted: true };
      }
    });

    revalidatePath("/wishlist");
    return { success: true, isWishlisted: result.isWishlisted };
  } catch (error) {
    console.error("[Toggle Wishlist Error]:", error);
    return { error: "Failed to update wishlist. Please try again." };
  }
}

export async function syncGuestWishlist(productIds: string[]) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const validatedData = syncWishlistSchema.parse({ productIds });

    if (validatedData.productIds.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    const validProducts = await prisma.product.findMany({
      where: {
        id: { in: validatedData.productIds },
        isArchived: false,
      },
      select: { id: true },
    });

    const validProductIds = validProducts.map((p) => p.id);

    if (validProductIds.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    const result = await prisma.$transaction(async (tx) => {
      const wishlist = await tx.wishlist.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      const createResult = await tx.wishlistItem.createMany({
        data: validProductIds.map((id) => ({
          wishlistId: wishlist.id,
          productId: id,
        })),
        skipDuplicates: true,
      });

      return createResult.count;
    });

    revalidatePath("/wishlist");
    return { success: true, syncedCount: result };
  } catch (error) {
    console.error("[Sync Guest Wishlist Error]:", error);
    return { error: "Failed to sync wishlist. Please try again." };
  }
}

export async function getUserWishlist() {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          where: {
            product: { isArchived: false },
          },
          include: {
            product: {
              include: {
                media: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!wishlist || wishlist.items.length === 0) {
      return { success: true, items: [] };
    }

    const formattedItems = wishlist.items.map((item) => {
      const p = item.product;
      const mainImage = p.media.find((m) => m.isMain) || p.media[0];

      return {
        productId: p.id,
        slug: p.slug,
        name: p.name,
        imageUrl: mainImage?.url || "",
        price: Number(p.basePrice),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
        badge: p.badge || undefined,
      };
    });

    return { success: true, items: formattedItems };
  } catch (error) {
    console.error("[Get User Wishlist Error]:", error);
    return { error: "Failed to fetch wishlist. Please try again." };
  }
}
