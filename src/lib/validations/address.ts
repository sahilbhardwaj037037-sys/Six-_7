import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  phone: z.string().min(5, { message: "A valid phone number is required." }),
  addressLine1: z.string().min(3, { message: "Address is required." }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State/Province is required." }),
  postalCode: z.string().min(2, { message: "Postal code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  isDefault: z.boolean().default(false).optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
