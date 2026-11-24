import Product from '../models/Product';
import Category from '../models/Category';
import { AppError, generateSlug, getPagination, buildSort } from '../utils/helpers';
import mongoose, { FilterQuery } from 'mongoose';

export const getProducts = async (query: Record<string, string>) => {
  const { page, limit, skip } = getPagination({ query } as never);
  const filter: FilterQuery<typeof Product> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.category && query.category.trim()) {
    const catVal = query.category.trim();
    if (mongoose.Types.ObjectId.isValid(catVal)) {
      filter.category = catVal;
    } else {
      const catDoc = await Category.findOne({ slug: catVal }).select('_id').lean();
      if (catDoc) {
        filter.category = catDoc._id;
      }
    }
  }

  if (query.search && query.search.trim()) {
    const rawSearch = query.search.trim();
    const escaped = rawSearch.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    filter.$or = [
      { name: regex },
      { description: regex },
      { shortDescription: regex },
      { sku: regex },
      { subcategory: regex },
      { 'specifications.value': regex },
      { features: regex },
    ];
  }

  const sort = buildSort(query.sortBy, query.order);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return { products, total, page, limit, pages: Math.ceil(total / limit) };
};

export const getProductBySlug = async (slug: string) => {
  let product = await Product.findOne({
    slug,
    $or: [{ status: 'published' }, { status: { $exists: false } }],
  }).populate('category', 'name slug');

  if (!product) {
    product = await Product.findOne({ slug }).populate('category', 'name slug');
  }

  if (!product) throw new AppError('Product not found', 404);
  product.views = (product.views || 0) + 1;
  await product.save();
  return product;
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id).populate('category', 'name slug');
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

export const createProduct = async (data: Record<string, unknown>) => {
  if (!data.slug) data.slug = generateSlug(data.name as string);
  const existing = await Product.findOne({
    $or: [{ slug: data.slug }, { sku: data.sku }],
  });
  if (existing) throw new AppError('Product with this SKU or slug already exists', 400);
  return Product.create(data);
};

export const updateProduct = async (id: string, data: Record<string, unknown>) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

export { uploadProductImage } from '../utils/fileUpload';
