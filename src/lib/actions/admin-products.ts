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

// Extend the schema specifically for updates to include the status & merchandising flags
const updateProductSchema = productSchema.extend({
  isArchived: z.boolean(),
  isNewArrival: z.boolean(),
  isBestSeller: z.boolean(),
  featured: z.boolean(),
});

type UpdateProductInput = z.infer<typeof updateProductSchema>;

export async function updateProduct(id: string, data: UpdateProductInput) {
  await requireAdmin();

  const parsed = updateProductSchema.safeParse(data);
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
        isArchived: parsed.data.isArchived,
        isNewArrival: parsed.data.isNewArrival,
        isBestSeller: parsed.data.isBestSeller,
        featured: parsed.data.featured,
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

const createVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required").trim(),
  size: z.string().min(1, "Size is required").trim(),
  color: z.string().min(1, "Color is required").trim(),
  colorHex: z.string().trim().optional(),
  price: z.coerce.number().positive("Price must be a positive number").optional(),
  quantity: z.coerce.number().int().nonnegative("Quantity must be 0 or greater").default(0),
});

export async function createProductVariant(productId: string, formData: FormData) {
  try {
    await requireAdmin();

    const rawPrice = formData.get("price");
    const rawColorHex = formData.get("colorHex");
    
    const rawData = {
      sku: formData.get("sku"),
      size: formData.get("size"),
      color: formData.get("color"),
      colorHex: rawColorHex && rawColorHex.toString().trim() !== "" ? rawColorHex : undefined,
      price: rawPrice && rawPrice.toString().trim() !== "" ? rawPrice : undefined,
      quantity: formData.get("quantity") || 0,
    };

    const validated = createVariantSchema.parse(rawData);

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        sku: validated.sku,
        size: validated.size,
        color: validated.color,
        colorHex: validated.colorHex,
        price: validated.price,
        inventory: {
          create: {
            quantity: validated.quantity,
            reserved: 0
          }
        }
      }
    });

    revalidatePath(`/admin/products/${productId}/variants`);
    revalidatePath(`/admin/products/${productId}/edit`);
    
    return { success: true, variantId: variant.id };
  } catch (error: any) {
    console.error("[Create Product Variant Error]:", error);

    if (error.code === "P2002") {
      const target = error.meta?.target;
      if (Array.isArray(target)) {
        if (target.includes("sku")) {
          return { error: "A variant with this SKU already exists." };
        }
        if (target.includes("productId") && target.includes("size") && target.includes("color")) {
          return { error: "This Size and Color combination already exists for this product." };
        }
      }
      return { error: "A unique constraint violation occurred (SKU or Size/Color already exists)." };
    }

    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }

    return { error: "Failed to create product variant. Please try again." };
  }
}
