"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const helpers_1 = require("../utils/helpers");
const getCategories = async (activeOnly = false) => {
    const filter = activeOnly ? { isActive: true } : {};
    return Category_1.default.find(filter).sort({ order: 1, name: 1 });
};
exports.getCategories = getCategories;
const createCategory = async (data) => {
    if (!data.slug)
        data.slug = (0, helpers_1.generateSlug)(data.name);
    return Category_1.default.create(data);
};
exports.createCategory = createCategory;
const updateCategory = async (id, data) => {
    const category = await Category_1.default.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!category)
        throw new helpers_1.AppError('Category not found', 404);
    return category;
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    const category = await Category_1.default.findByIdAndDelete(id);
    if (!category)
        throw new helpers_1.AppError('Category not found', 404);
    return category;
};
exports.deleteCategory = deleteCategory;
