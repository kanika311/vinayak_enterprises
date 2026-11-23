import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase } from '../config/database';
import Product from '../models/Product';
import Category from '../models/Category';

async function syncCategoryActive() {
  await connectDatabase();
  console.log('Connected to MongoDB');

  // Find all category IDs referenced by at least 1 published product
  const publishedCategoryIds = await Product.distinct('category', { status: 'published' });
  console.log('Category IDs with published products:', publishedCategoryIds.map((id) => id.toString()));

  // Deactivate categories with no published products
  const deactiveRes = await Category.updateMany(
    { _id: { $nin: publishedCategoryIds } },
    { $set: { isActive: false } }
  );
  console.log('Deactivated categories without products:', deactiveRes.modifiedCount);

  // Activate categories with published products
  const activeRes = await Category.updateMany(
    { _id: { $in: publishedCategoryIds } },
    { $set: { isActive: true } }
  );
  console.log('Activated categories with products:', activeRes.modifiedCount);

  // Print current status
  const allCats = await Category.find({}).sort({ order: 1, name: 1 }).lean();
  console.log('\n--- Current Category Status in DB ---');
  for (const c of allCats) {
    const productCount = await Product.countDocuments({ category: c._id, status: 'published' });
    console.log(
      `${c.name.padEnd(35)} | slug: ${c.slug.padEnd(30)} | isActive: ${String(c.isActive).padEnd(5)} | products: ${productCount}`
    );
  }

  process.exit(0);
}

syncCategoryActive().catch((err) => {
  console.error('Error syncing categories:', err);
  process.exit(1);
});
