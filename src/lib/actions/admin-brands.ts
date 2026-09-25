"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createBrandSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .trim(),
  description: z.string().trim().optional(),
});

export async function createBrand(
  input: z.infer<typeof createBrandSchema>
) {
  // 1. Authorize (Throws if not Admin)
  await requireAdmin();

  // 2. Validate Input
  const parsed = createBrandSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    };
  }

  // 3. Mutate Database
  try {
    await prisma.brand.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
      },
    });

    // 4. Revalidate & Return Success
    revalidatePath("/admin/brands");
    return { success: true };

  } catch (error: any) {
    // 5. Handle Unique Constraint Errors
    if (error?.code === "P2002") {
      return {
        success: false,
        error: "A brand with this name or slug already exists."
      };
    }

    // Fallback Error
    return {
      success: false,
      error: "Failed to create brand. Please try again."
    };
  }
}
