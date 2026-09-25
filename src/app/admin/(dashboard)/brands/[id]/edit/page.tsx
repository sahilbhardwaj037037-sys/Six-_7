import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import EditBrandForm from "./edit-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: PageProps) {
  await requireAdmin();

  const resolvedParams = await params;

  const brand = await prisma.brand.findUnique({
    where: { id: resolvedParams.id },
    select: { id: true, name: true, slug: true, description: true }
  });

  if (!brand) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Edit Brand
        </h1>
      </div>
      <EditBrandForm brand={brand} />
    </div>
  );
}
