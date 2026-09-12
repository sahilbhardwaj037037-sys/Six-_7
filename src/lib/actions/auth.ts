"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema, RegisterInput, profileSchema, ProfileInput } from "@/lib/validations/auth";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function registerUser(data: RegisterInput) {
  try {
    const validatedData = registerSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "An error occurred during registration. Please try again." };
  }
}

export async function updateProfile(data: ProfileInput) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized. Please log in again." };
    }

    const validatedData = profileSchema.parse(data);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: validatedData.name },
    });

    revalidatePath("/account");
    revalidatePath("/account/profile");

    return { success: true };
  } catch (error) {
    console.error("[Profile Update Error]:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}
