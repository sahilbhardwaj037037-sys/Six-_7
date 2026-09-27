import { notFound } from "next/navigation";
import { getAdminProductById } from "@/lib/services/admin-catalog";
import { prisma } from "@/lib/prisma";
import { EditVariantForm } from "./EditVariantForm";

export default async function EditVariantPage({
  params,
}: {
  params: Promise<{ id: string; variantId: string }>;
}) {
  const { id: productId, variantId } = await params;

  // Validate product exists
  const product = await getAdminProductById(productId);
  if (!product) {
    notFound();
  }

  // Fetch variant strictly ensuring it belongs to this product
  const variant = await prisma.productVariant.findUnique({
    where: { 
      id: variantId,
      productId: productId,
    }
  });

  if (!variant) {
    notFound();
  }

  // Convert Decimal price to string for the client form
  const serializedVariant = {
    ...variant,
    price: variant.price ? variant.price.toString() : "",
    colorHex: variant.colorHex || "",
  };

  return <EditVariantForm productId={productId} variant={serializedVariant} />;
}
