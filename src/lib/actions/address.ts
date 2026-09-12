"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { addressSchema, AddressInput } from "@/lib/validations/address";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user.id;
}

export async function addAddress(data: AddressInput) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const validatedData = addressSchema.parse(data);

    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    await prisma.address.create({
      data: { ...validatedData, userId, isDefault: validatedData.isDefault ?? false },
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("[Add Address Error]:", error);
    return { error: "Failed to add address. Please try again." };
  }
}

export async function updateAddress(addressId: string, data: AddressInput) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) return { error: "Address not found or unauthorized." };

    const validatedData = addressSchema.parse(data);

    if (validatedData.isDefault && !existing.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    await prisma.address.update({
      where: { id: addressId },
      data: { ...validatedData, isDefault: validatedData.isDefault ?? false },
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("[Update Address Error]:", error);
    return { error: "Failed to update address. Please try again." };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) return { error: "Address not found or unauthorized." };

    await prisma.address.delete({ where: { id: addressId } });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("[Delete Address Error]:", error);
    return { error: "Failed to delete address. Please try again." };
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Unauthorized." };

    const existing = await prisma.address.findUnique({ where: { id: addressId } });
    if (!existing || existing.userId !== userId) return { error: "Address not found or unauthorized." };

    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error("[Set Default Address Error]:", error);
    return { error: "Failed to set default address. Please try again." };
  }
}
