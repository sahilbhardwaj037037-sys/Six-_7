"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const updateInventorySchema = z.object({
  variantId: z.string().min(1, "Variant ID is required").trim(),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be 0 or greater"),
});

export async function updateInventoryQuantity(
  variantId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const validated = updateInventorySchema.safeParse({ variantId, quantity });
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const inventory = await prisma.inventory.findUnique({
      where: { variantId: validated.data.variantId },
    });

    if (!inventory) {
      return { success: false, error: "Inventory record not found for this variant." };
    }

    if (validated.data.quantity < inventory.reserved) {
      return {
        success: false,
        error: `Quantity cannot be lower than reserved stock (${inventory.reserved} reserved).`,
      };
    }

    await prisma.inventory.update({
      where: { variantId: validated.data.variantId },
      data: {
        quantity: validated.data.quantity,
      },
    });

    revalidatePath("/admin/inventory");

    return { success: true };
  } catch (error: any) {
    console.error("[Update Inventory Quantity Error]:", error);

    if (error?.message?.includes("Unauthorized") || error?.name === "UnauthorizedError") {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    return {
      success: false,
      error: "Failed to update inventory quantity. Please try again.",
    };
  }
}
