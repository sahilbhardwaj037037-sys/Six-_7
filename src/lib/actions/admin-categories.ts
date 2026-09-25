"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .trim(),
  description: z.string().trim().optional(),
});

type CategoryInput = z.infer<typeof categorySchema>;

export async function createCategory(data: CategoryInput) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.category.create({
      data: parsed.data,
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return {
        success: false,
        error: "A category with this name or slug already exists."
      };
    }

    return {
      success: false,
      error: "Failed to create category. Please try again."
    };
  }
}

export async function updateCategory(id: string, data: CategoryInput) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return {
        success: false,
        error: "A category with this name or slug already exists."
      };
    }
    if (error?.code === "P2025") {
      return {
        success: false,
        error: "Category not found."
      };
    }

    return {
      success: false,
      error: "Failed to update category. Please try again."
    };
  }
}
