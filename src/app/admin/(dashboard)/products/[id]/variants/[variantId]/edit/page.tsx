export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getAdminProductById } from "@/lib/services/admin-catalog";
import { prisma } from "@/lib/prisma";
import { EditVariantForm } from "./EditVariantForm";
import { ProductMediaManager } from "@/components/admin/ProductMediaManager";

export default async function EditVariantPage({
  params,
}: {
  params: Promise<{ id: string; variantId: string }>;
}) {
  const { id: productId, variantId } = await params;

  const product = await getAdminProductById(productId);
  if (!product) {
    notFound();
  }

  const variant = await prisma.productVariant.findUnique({
    where: { 
      id: variantId,
      productId: productId,
    },
    include: {
      media: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!variant) {
    notFound();
  }

  const serializedVariant = {
    ...variant,
    price: variant.price ? variant.price.toString() : "",
    colorHex: variant.colorHex || "",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <EditVariantForm productId={productId} variant={serializedVariant} />
      <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
        <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
          Variant Media ({variant.sku})
        </h2>
        <ProductMediaManager
          productId={productId}
          variantId={variantId}
          media={variant.media}
        />
      </div>
    </div>
  );
}
