"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .trim(),
  description: z.string().trim().optional(),
  basePrice: z.coerce.number().positive("Base price must be a positive number"),
  originalPrice: z.coerce.number().positive("Original price must be a positive number").optional(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX", "KIDS"], {
    message: "Invalid gender selection",
  }),
  sport: z.enum(["RUNNING", "TRAINING", "COURT", "TRAIL", "LIFESTYLE"], {
    message: "Invalid sport selection",
  }),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
});

type ProductInput = z.infer<typeof productSchema>;

export async function createProduct(data: ProductInput) {
  await requireAdmin();

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        basePrice: parsed.data.basePrice,
        originalPrice: parsed.data.originalPrice,
        gender: parsed.data.gender,
        sport: parsed.data.sport,
        brandId: parsed.data.brandId,
        categoryId: parsed.data.categoryId,
        isArchived: true, // Forces product to be a hidden draft initially
      },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return {
        success: false,
        error: "A product with this slug already exists.",
      };
    }
    if (error?.code === "P2003") {
      return {
        success: false,
        error: "Invalid Brand or Category reference.",
      };
    }

    return {
      success: false,
      error: "Failed to create product. Please try again.",
    };
  }
}

export async function updateProduct(id: string, data: ProductInput) {
  await requireAdmin();

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        basePrice: parsed.data.basePrice,
        originalPrice: parsed.data.originalPrice,
        gender: parsed.data.gender,
        sport: parsed.data.sport,
        brandId: parsed.data.brandId,
        categoryId: parsed.data.categoryId,
        // isArchived, merchandising flags, variants, and media are strictly excluded
        // to automatically preserve their existing state in the database.
      },
    });

    // Revalidate admin and global layout to ensure customer catalog updates
    revalidatePath("/admin/products");
    revalidatePath("/", "layout"); 
    
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return {
        success: false,
        error: "A product with this slug already exists.",
      };
    }
    if (error?.code === "P2003") {
      return {
        success: false,
        error: "Invalid Brand or Category reference.",
      };
    }
    if (error?.code === "P2025") {
      return {
        success: false,
        error: "Product not found.",
      };
    }

    return {
      success: false,
      error: "Failed to update product. Please try again.",
    };
  }
}
