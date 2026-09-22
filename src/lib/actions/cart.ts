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

const addCartItemSchema = z.object({
  productId: z.string().min(1),
  size: z.string().min(1),
  colorHex: z.string().optional(),
  color: z.string().optional(),
  colorIndex: z.number().int().nonnegative().optional(),
  quantity: z.number().int().positive().default(1),
});

const updateQuantitySchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(0),
});

const removeCartItemSchema = z.object({
  variantId: z.string().min(1),
});

const guestCartItemSchema = z.object({
  productId: z.string().min(1),
  size: z.string().min(1),
  colorHex: z.string().optional(),
  color: z.string().optional(),
  colorIndex: z.number().int().nonnegative().optional(),
  quantity: z.number().int().positive().default(1),
});

const syncGuestCartSchema = z.object({
  items: z.array(guestCartItemSchema).max(100),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type GuestCartItemInput = z.infer<typeof guestCartItemSchema>;

/**
 * Resolves a single ProductVariant from the database unambiguously.
 * Prioritizes productId + size + exact/case-insensitive colorHex or color name.
 * Never guesses from colorIndex. If multiple or zero variants match, returns null.
 */
async function resolveProductVariant(
  productId: string,
  size: string,
  colorHex?: string,
  color?: string
) {
  const conditions: Array<Record<string, unknown>> = [{ productId }, { size }];

  if (colorHex) {
    conditions.push({
      OR: [
        { colorHex: { equals: colorHex, mode: "insensitive" } },
        ...(color ? [{ color: { equals: color, mode: "insensitive" } }] : []),
      ],
    });
  } else if (color) {
    conditions.push({ color: { equals: color, mode: "insensitive" } });
  }

  const matchingVariants = await prisma.productVariant.findMany({
    where: {
      AND: conditions,
      product: { isArchived: false },
    },
    include: {
      inventory: true,
      product: {
        select: {
          id: true,
          isArchived: true,
          basePrice: true,
        },
      },
    },
  });

  // Strict check: Must resolve to exactly one active variant unambiguously
  if (matchingVariants.length === 1) {
    return matchingVariants[0];
  }

  return null;
}

export async function getUserCart() {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          where: {
            variant: {
              product: { isArchived: false },
            },
          },
          include: {
            variant: {
              include: {
                inventory: true,
                media: { orderBy: { order: "asc" } },
                product: {
                  include: {
                    media: { orderBy: { order: "asc" } },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return { success: true, items: [] };
    }

    // Format DB records to match CartItem expected by CartContext
    const items = cart.items.map((item) => {
      const v = item.variant;
      const p = v.product;

      // Authoritative media resolution (variant media first, then product media)
      const mainMedia =
        v.media.find((m) => m.isMain) ||
        v.media[0] ||
        p.media.find((m) => m.isMain) ||
        p.media[0];

      const price = v.price ? Number(v.price) : Number(p.basePrice);

      return {
        id: v.id, // Primary identifier in UI for DB-backed items
        variantId: v.id,
        productId: p.id,
        slug: p.slug,
        name: p.name,
        imageUrl: mainMedia?.url || "",
        price,
        size: v.size,
        colorIndex: 0,
        colorHex: v.colorHex || undefined,
        quantity: item.quantity,
      };
    });

    return { success: true, items };
  } catch (error) {
    console.error("[Get User Cart Error]:", error);
    return { error: "Failed to fetch cart. Please try again." };
  }
}

export async function addCartItem(input: AddCartItemInput) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const validated = addCartItemSchema.parse(input);

    // Resolve variant strictly from DB without trusting client price/media
    const variant = await resolveProductVariant(
      validated.productId,
      validated.size,
      validated.colorHex,
      validated.color
    );

    if (!variant || variant.product.isArchived) {
      return { error: "Selected product variant is unavailable." };
    }

    const availableStock = Math.max(
      0,
      (variant.inventory?.quantity ?? 0) - (variant.inventory?.reserved ?? 0)
    );

    if (availableStock <= 0) {
      return { error: "Selected item is out of stock." };
    }

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_variantId: {
            cartId: cart.id,
            variantId: variant.id,
          },
        },
      });

      const currentQty = existingItem?.quantity ?? 0;
      const targetQty = currentQty + validated.quantity;

      if (targetQty > availableStock) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      await tx.cartItem.upsert({
        where: {
          cartId_variantId: {
            cartId: cart.id,
            variantId: variant.id,
          },
        },
        update: {
          quantity: targetQty,
        },
        create: {
          cartId: cart.id,
          variantId: variant.id,
          quantity: validated.quantity,
        },
      });
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      return { error: "Cannot add more than available stock." };
    }
    console.error("[Add Cart Item Error]:", error);
    return { error: "Failed to add item to bag. Please try again." };
  }
}

export async function updateCartItemQuantity(variantId: string, quantity: number) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const validated = updateQuantitySchema.parse({ variantId, quantity });

    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!cart) return { error: "Cart not found." };

    if (validated.quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          variantId: validated.variantId,
        },
      });

      revalidatePath("/cart");
      return { success: true };
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: validated.variantId },
      include: { inventory: true, product: { select: { isArchived: true } } },
    });

    if (!variant || variant.product.isArchived) {
      return { error: "Product variant is unavailable." };
    }

    const availableStock = Math.max(
      0,
      (variant.inventory?.quantity ?? 0) - (variant.inventory?.reserved ?? 0)
    );

    if (validated.quantity > availableStock) {
      return { error: "Requested quantity exceeds available stock." };
    }

    await prisma.cartItem.update({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId: validated.variantId,
        },
      },
      data: {
        quantity: validated.quantity,
      },
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("[Update Cart Item Quantity Error]:", error);
    return { error: "Failed to update quantity. Please try again." };
  }
}

export async function removeCartItem(variantId: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const validated = removeCartItemSchema.parse({ variantId });

    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          variantId: validated.variantId,
        },
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("[Remove Cart Item Error]:", error);
    return { error: "Failed to remove item from bag. Please try again." };
  }
}

export async function clearUserCart() {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("[Clear User Cart Error]:", error);
    return { error: "Failed to clear bag. Please try again." };
  }
}

export async function syncGuestCart(guestItems: GuestCartItemInput[]) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const validated = syncGuestCartSchema.parse({ items: guestItems });

    if (validated.items.length === 0) {
      return { success: true, syncedCount: 0, skippedCount: 0, issues: [] };
    }

    // 1. PRE-TRANSACTION BATCH LOOKUP
    // Fetch all active variants for all requested productIds in a single query outside the transaction
    const distinctProductIds = Array.from(new Set(validated.items.map((i) => i.productId)));

    const candidateVariants = await prisma.productVariant.findMany({
      where: {
        productId: { in: distinctProductIds },
        product: { isArchived: false },
      },
      include: {
        inventory: true,
        product: {
          select: {
            id: true,
            isArchived: true,
            basePrice: true,
          },
        },
      },
    });

    // 2. IN-MEMORY VARIANT RESOLUTION & VALIDATION (Outside transaction)
    type ResolvedSyncItem = {
      variantId: string;
      requestedQuantity: number;
      availableStock: number;
    };

    const resolvedItems: ResolvedSyncItem[] = [];
    let skippedCount = 0;
    const issues: string[] = [];

    for (const item of validated.items) {
      const matchingVariants = candidateVariants.filter((v) => {
        if (v.productId !== item.productId || v.size !== item.size) return false;

        if (item.colorHex) {
          const matchHex =
            v.colorHex?.toLowerCase() === item.colorHex.toLowerCase();
          const matchColor =
            item.color && v.color.toLowerCase() === item.color.toLowerCase();
          return matchHex || Boolean(matchColor);
        }

        if (item.color) {
          return v.color.toLowerCase() === item.color.toLowerCase();
        }

        return true;
      });

      // Must match exactly one active variant unambiguously
      if (matchingVariants.length !== 1) {
        skippedCount++;
        issues.push(`Product ${item.productId} (${item.size}) could not be resolved or is unavailable.`);
        continue;
      }

      const variant = matchingVariants[0];

      const availableStock = Math.max(
        0,
        (variant.inventory?.quantity ?? 0) - (variant.inventory?.reserved ?? 0)
      );

      if (availableStock <= 0) {
        skippedCount++;
        issues.push(`${variant.product.id} (${variant.size}) is out of stock.`);
        continue;
      }

      resolvedItems.push({
        variantId: variant.id,
        requestedQuantity: item.quantity,
        availableStock,
      });
    }

    if (resolvedItems.length === 0) {
      return { success: true, syncedCount: 0, skippedCount, issues };
    }

    // 3. LEAN, ATOMIC TRANSACTION (Writes only; strictly using `tx`)
    let syncedCount = 0;

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      for (const item of resolvedItems) {
        const existingItem = await tx.cartItem.findUnique({
          where: {
            cartId_variantId: {
              cartId: cart.id,
              variantId: item.variantId,
            },
          },
        });

        const currentQty = existingItem?.quantity ?? 0;
        const requestedTotal = currentQty + item.requestedQuantity;
        const allowedQty = Math.min(requestedTotal, item.availableStock);

        if (allowedQty <= currentQty) {
          skippedCount++;
          issues.push(`Stock limit reached for variant ${item.variantId}.`);
          continue;
        }

        await tx.cartItem.upsert({
          where: {
            cartId_variantId: {
              cartId: cart.id,
              variantId: item.variantId,
            },
          },
          update: {
            quantity: allowedQty,
          },
          create: {
            cartId: cart.id,
            variantId: item.variantId,
            quantity: allowedQty,
          },
        });

        syncedCount++;
      }
    });

    revalidatePath("/cart");
    return { success: true, syncedCount, skippedCount, issues };
  } catch (error) {
    console.error("[Sync Guest Cart Error]:", error);
    return { error: "Failed to sync guest cart. Please try again." };
  }
}
