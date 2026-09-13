import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { SHOP_PRODUCTS } from '../src/data/mock-products';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Six&7 Catalog Foundation...');

  const brand = await prisma.brand.upsert({
    where: { slug: 'six-and-7' },
    update: {},
    create: {
      name: 'Six&7 Atelier',
      slug: 'six-and-7',
      description: 'Premium architectural footwear and bio-composite runners.',
    },
  });
  console.log(`- Brand created: ${brand.name}`);

  const uniqueCategorySlugs = Array.from(new Set(SHOP_PRODUCTS.map((p) => p.categorySlug)));
  const categoryMap = new Map<string, string>();

  for (const slug of uniqueCategorySlugs) {
    const name = slug.charAt(0).toUpperCase() + slug.slice(1);
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    categoryMap.set(slug, category.id);
  }
  console.log(`- Created ${categoryMap.size} Categories`);

  for (const mockProduct of SHOP_PRODUCTS) {
    const genderEnum = mockProduct.gender.toUpperCase() as "MEN" | "WOMEN" | "UNISEX" | "KIDS";
    const sportEnum = mockProduct.sport.toUpperCase() as "RUNNING" | "TRAINING" | "COURT" | "TRAIL" | "LIFESTYLE";

    const product = await prisma.product.upsert({
      where: { slug: mockProduct.slug },
      update: {},
      create: {
        slug: mockProduct.slug,
        name: mockProduct.name,
        description: 'Architectural silhouette engineered for precision.',
        basePrice: mockProduct.price,
        originalPrice: mockProduct.originalPrice || null,
        badge: mockProduct.badge || null,
        gender: genderEnum,
        sport: sportEnum,
        isNewArrival: mockProduct.isNewArrival || false,
        isBestSeller: mockProduct.isBestSeller || false,
        featured: mockProduct.featured || false,
        brandId: brand.id,
        categoryId: categoryMap.get(mockProduct.categorySlug)!,
      },
    });

    // Create Main Image
    const existingMainMedia = await prisma.productMedia.findFirst({
      where: { productId: product.id, url: mockProduct.imageUrl }
    });
    
    if (!existingMainMedia) {
      await prisma.productMedia.create({
        data: {
          url: mockProduct.imageUrl,
          isMain: true,
          order: 0,
          productId: product.id,
        }
      });
    }

    // Create Secondary Image if it exists
    if (mockProduct.secondaryImageUrl) {
      const existingSecondaryMedia = await prisma.productMedia.findFirst({
        where: { productId: product.id, url: mockProduct.secondaryImageUrl }
      });
      
      if (!existingSecondaryMedia) {
        await prisma.productMedia.create({
          data: {
            url: mockProduct.secondaryImageUrl,
            isMain: false,
            order: 1,
            productId: product.id,
          }
        });
      }
    }

    const sizes = ["9", "10", "11"];
    
    for (const hexColor of mockProduct.colorways) {
      for (const size of sizes) {
        const sku = `${mockProduct.slug}-${hexColor.replace('#', '')}-${size}`.toUpperCase();
        
        await prisma.productVariant.upsert({
          where: { sku },
          update: {},
          create: {
            sku,
            size,
            color: hexColor, 
            colorHex: hexColor,
            productId: product.id,
            inventory: {
              create: {
                quantity: 15,
              }
            }
          }
        });
      }
    }
  }

  console.log(`- Inserted ${SHOP_PRODUCTS.length} Products with Variants and Media`);
  console.log('Seeding completed successfully! 🚀');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
