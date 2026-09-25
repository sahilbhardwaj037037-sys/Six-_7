"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required").trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .trim(),
  description: z.string().trim().optional(),
});

type BrandInput = z.infer<typeof brandSchema>;

export async function createBrand(data: BrandInput) {
  await requireAdmin();

  const parsed = brandSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.brand.create({
      data: parsed.data,
    });

    revalidatePath("/admin/brands");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return {
        success: false,
        error: "A brand with this name or slug already exists."
      };
    }

    return {
      success: false,
      error: "Failed to create brand. Please try again."
    };
  }
}

export async function updateBrand(id: string, data: BrandInput) {
  await requireAdmin();

  const parsed = brandSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.brand.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/admin/brands");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return {
        success: false,
        error: "Another brand with this name or slug already exists."
      };
    }
    if (error?.code === "P2025") {
      return {
        success: false,
        error: "Brand not found. It may have been deleted."
      };
    }

    return {
      success: false,
      error: "Failed to update brand. Please try again."
    };
  }
}
