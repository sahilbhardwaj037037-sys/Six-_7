"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const inquirySchema = z.object({
  fullName: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email address").trim(),
  orderNumber: z.string().trim().optional(),
  category: z.string().min(1, "Category is required").trim(),
  message: z.string().min(1, "Message is required").trim(),
});

type InquiryInput = z.infer<typeof inquirySchema>;

export async function submitInquiry(data: InquiryInput) {
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.inquiry.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        orderNumber: parsed.data.orderNumber || null,
        category: parsed.data.category,
        message: parsed.data.message,
        status: "PENDING",
      },
    });

    revalidatePath("/admin/customers/inquiries");
    return { success: true };
  } catch (error: any) {
    console.error("[Submit Inquiry Error]:", error);
    return { success: false, error: "Failed to transmit inquiry. Please try again." };
  }
}

export async function updateInquiryStatus(id: string, status: string) {
  try {
    await requireAdmin();

    await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/customers/inquiries");
    return { success: true };
  } catch (error: any) {
    console.error("[Update Inquiry Status Error]:", error);
    return { success: false, error: "Failed to update inquiry status." };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await requireAdmin();

    await prisma.inquiry.delete({
      where: { id },
    });

    revalidatePath("/admin/customers/inquiries");
    return { success: true };
  } catch (error: any) {
    console.error("[Delete Inquiry Error]:", error);
    return { success: false, error: "Failed to delete inquiry." };
  }
}
