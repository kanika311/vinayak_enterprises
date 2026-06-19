"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProductBySlug = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const helpers_1 = require("../utils/helpers");
const getProducts = async (query) => {
    const { page, limit, skip } = (0, helpers_1.getPagination)({ query });
    const filter = {};
    if (query.status)
        filter.status = query.status;
    if (query.category)
        filter.category = query.category;
    if (query.search) {
        filter.$text = { $search: query.search };
    }
    const sort = (0, helpers_1.buildSort)(query.sortBy, query.order);
    const [products, total] = await Promise.all([
        Product_1.default.find(filter)
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(limit),
        Product_1.default.countDocuments(filter),
    ]);
    return { products, total, page, limit, pages: Math.ceil(total / limit) };
};
exports.getProducts = getProducts;
const getProductBySlug = async (slug) => {
    const product = await Product_1.default.findOne({ slug, status: 'published' }).populate('category', 'name slug');
    if (!product)
        throw new helpers_1.AppError('Product not found', 404);
    product.views += 1;
    await product.save();
    return product;
};
exports.getProductBySlug = getProductBySlug;
const getProductById = async (id) => {
    const product = await Product_1.default.findById(id).populate('category', 'name slug');
    if (!product)
        throw new helpers_1.AppError('Product not found', 404);
    return product;
};
exports.getProductById = getProductById;
const createProduct = async (data) => {
    if (!data.slug)
        data.slug = (0, helpers_1.generateSlug)(data.name);
    const existing = await Product_1.default.findOne({
        $or: [{ slug: data.slug }, { sku: data.sku }],
    });
    if (existing)
        throw new helpers_1.AppError('Product with this SKU or slug already exists', 400);
    return Product_1.default.create(data);
};
exports.createProduct = createProduct;
const updateProduct = async (id, data) => {
    const product = await Product_1.default.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).populate('category', 'name slug');
    if (!product)
        throw new helpers_1.AppError('Product not found', 404);
    return product;
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    const product = await Product_1.default.findByIdAndDelete(id);
    if (!product)
        throw new helpers_1.AppError('Product not found', 404);
    return product;
};
exports.deleteProduct = deleteProduct;
