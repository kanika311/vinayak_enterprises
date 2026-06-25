import Category from '../models/Category';
import { AppError, generateSlug } from '../utils/helpers';

export const getCategories = async (activeOnly = false) => {
  const filter = activeOnly ? { isActive: true } : {};
  return Category.find(filter).sort({ order: 1, name: 1 });
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await Category.findOne({ slug, isActive: true });
  if (!category) throw new AppError('Category not found', 404);
  return category;
};

export const createCategory = async (data: Record<string, unknown>) => {
  if (!data.slug) data.slug = generateSlug(data.name as string);
  return Category.create(data);
};

export const updateCategory = async (id: string, data: Record<string, unknown>) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!category) throw new AppError('Category not found', 404);
  return category;
};

export const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new AppError('Category not found', 404);
  return category;
};
