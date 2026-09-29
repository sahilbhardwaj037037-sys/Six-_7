"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadProductMedia(formData: FormData) {
  try {
    await requireAdmin();

    const productId = formData.get("productId") as string;
    const variantIdRaw = formData.get("variantId") as string | null;
    const variantId = variantIdRaw && variantIdRaw.trim() !== "" ? variantIdRaw.trim() : null;
    const altText = (formData.get("altText") as string | null)?.trim() || null;
    const isMainRequested = formData.get("isMain") === "true";
    const file = formData.get("file") as File | null;

    if (!productId) {
      return { success: false, error: "Product ID is required." };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, slug: true },
    });

    if (!product) {
      return { success: false, error: "Product not found." };
    }

    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId, productId },
        select: { id: true },
      });
      if (!variant) {
        return { success: false, error: "Selected variant does not belong to this product." };
      }
    }

    if (!file || file.size === 0) {
      return { success: false, error: "Please select an image file to upload." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Image file exceeds the 5MB size limit." };
    }

    const ext = ALLOWED_MIME_TYPES[file.type];
    if (!ext) {
      return {
        success: false,
        error: "Invalid file type. Allowed formats: JPEG, PNG, WebP, GIF.",
      };
    }

    const randomHex = crypto.randomBytes(4).toString("hex");
    const safeFilename = `prod_${productId.slice(-6)}_${Date.now()}_${randomHex}${ext}`;

    const uploadDir = path.resolve(process.cwd(), "public", "uploads", "products");
    await fs.mkdir(uploadDir, { recursive: true });

    const destPath = path.resolve(uploadDir, safeFilename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(destPath, buffer);

    const publicUrl = `/uploads/products/${safeFilename}`;

    const existingCount = await prisma.productMedia.count({
      where: { productId },
    });

    const isMain = isMainRequested || existingCount === 0;

    if (isMain) {
      await prisma.productMedia.updateMany({
        where: { productId, isMain: true },
        data: { isMain: false },
      });
    }

    const createdMedia = await prisma.productMedia.create({
      data: {
        url: publicUrl,
        altText: altText || product.name,
        isMain,
        order: existingCount,
        productId,
        variantId,
      },
    });

    revalidatePath(`/admin/products/${productId}/edit`);
    revalidatePath(`/admin/products/${productId}/variants`);
    if (variantId) {
      revalidatePath(`/admin/products/${productId}/variants/${variantId}/edit`);
    }
    revalidatePath(`/admin/products`);
    revalidatePath(`/product/${product.slug}`);
    revalidatePath(`/shop`);
    revalidatePath(`/`);

    return { success: true, media: createdMedia };
  } catch (error: any) {
    console.error("[Upload Product Media Error]:", error);
    return {
      success: false,
      error: error?.message || "Failed to upload product media.",
    };
  }
}

export async function deleteProductMedia(productId: string, mediaId: string) {
  try {
    await requireAdmin();

    const media = await prisma.productMedia.findUnique({
      where: { id: mediaId },
      include: { product: { select: { slug: true } } },
    });

    if (!media || media.productId !== productId) {
      return { success: false, error: "Media not found for this product." };
    }

    // Safely remove local disk file ONLY if it resides in the intended upload directory
    if (media.url.startsWith("/uploads/products/")) {
      const filename = path.basename(media.url);
      const safeDir = path.resolve(process.cwd(), "public", "uploads", "products");
      const filePath = path.resolve(safeDir, filename);

      // Path traversal guard
      if (filePath.startsWith(safeDir)) {
        await fs.unlink(filePath).catch(() => {});
      }
    }

    await prisma.productMedia.delete({
      where: { id: mediaId },
    });

    if (media.isMain) {
      const nextMedia = await prisma.productMedia.findFirst({
        where: { productId },
        orderBy: { order: "asc" },
      });
      if (nextMedia) {
        await prisma.productMedia.update({
          where: { id: nextMedia.id },
          data: { isMain: true },
        });
      }
    }

    revalidatePath(`/admin/products/${productId}/edit`);
    revalidatePath(`/admin/products/${productId}/variants`);
    if (media.variantId) {
      revalidatePath(`/admin/products/${productId}/variants/${media.variantId}/edit`);
    }
    revalidatePath(`/admin/products`);
    if (media.product?.slug) {
      revalidatePath(`/product/${media.product.slug}`);
    }
    revalidatePath(`/shop`);
    revalidatePath(`/`);

    return { success: true };
  } catch (error: any) {
    console.error("[Delete Product Media Error]:", error);
    return {
      success: false,
      error: error?.message || "Failed to delete product media.",
    };
  }
}

export async function setMainProductMedia(productId: string, mediaId: string) {
  try {
    await requireAdmin();

    const media = await prisma.productMedia.findUnique({
      where: { id: mediaId },
      include: { product: { select: { slug: true } } },
    });

    if (!media || media.productId !== productId) {
      return { success: false, error: "Media not found for this product." };
    }

    await prisma.$transaction([
      prisma.productMedia.updateMany({
        where: { productId, isMain: true },
        data: { isMain: false },
      }),
      prisma.productMedia.update({
        where: { id: mediaId },
        data: { isMain: true },
      }),
    ]);

    revalidatePath(`/admin/products/${productId}/edit`);
    revalidatePath(`/admin/products/${productId}/variants`);
    if (media.variantId) {
      revalidatePath(`/admin/products/${productId}/variants/${media.variantId}/edit`);
    }
    revalidatePath(`/admin/products`);
    if (media.product?.slug) {
      revalidatePath(`/product/${media.product.slug}`);
    }
    revalidatePath(`/shop`);
    revalidatePath(`/`);

    return { success: true };
  } catch (error: any) {
    console.error("[Set Main Media Error]:", error);
    return {
      success: false,
      error: error?.message || "Failed to set main product media.",
    };
  }
}
