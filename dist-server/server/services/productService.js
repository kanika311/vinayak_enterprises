"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProductImage = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProductBySlug = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const helpers_1 = require("../utils/helpers");
const mongoose_1 = __importDefault(require("mongoose"));
const getProducts = async (query) => {
    const { page, limit, skip } = (0, helpers_1.getPagination)({ query });
    const filter = {};
    if (query.status) {
        filter.status = query.status;
    }
    if (query.category && query.category.trim()) {
        const catVal = query.category.trim();
        if (mongoose_1.default.Types.ObjectId.isValid(catVal)) {
            filter.category = catVal;
        }
        else {
            const catDoc = await Category_1.default.findOne({ slug: catVal }).select('_id').lean();
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
    const sort = (0, helpers_1.buildSort)(query.sortBy, query.order);
    const [products, total] = await Promise.all([
        Product_1.default.find(filter)
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        Product_1.default.countDocuments(filter),
    ]);
    return { products, total, page, limit, pages: Math.ceil(total / limit) };
};
exports.getProducts = getProducts;
const getProductBySlug = async (slug) => {
    let product = await Product_1.default.findOne({
        slug,
        $or: [{ status: 'published' }, { status: { $exists: false } }],
    }).populate('category', 'name slug');
    if (!product) {
        product = await Product_1.default.findOne({ slug }).populate('category', 'name slug');
    }
    if (!product)
        throw new helpers_1.AppError('Product not found', 404);
    product.views = (product.views || 0) + 1;
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
var fileUpload_1 = require("../utils/fileUpload");
Object.defineProperty(exports, "uploadProductImage", { enumerable: true, get: function () { return fileUpload_1.uploadProductImage; } });
