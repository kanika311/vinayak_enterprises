"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogById = exports.getBlogBySlug = exports.getBlogs = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const helpers_1 = require("../utils/helpers");
const getBlogs = async (query, publicOnly = false) => {
    const { page, limit, skip } = (0, helpers_1.getPagination)({ query });
    const filter = {};
    if (publicOnly)
        filter.status = 'published';
    else if (query.status)
        filter.status = query.status;
    if (query.category)
        filter.category = query.category;
    if (query.search)
        filter.$text = { $search: query.search };
    const sort = (0, helpers_1.buildSort)(query.sortBy || 'publishedAt', query.order);
    const [blogs, total] = await Promise.all([
        Blog_1.default.find(filter).populate('author', 'name').sort(sort).skip(skip).limit(limit),
        Blog_1.default.countDocuments(filter),
    ]);
    return { blogs, total, page, limit, pages: Math.ceil(total / limit) };
};
exports.getBlogs = getBlogs;
const getBlogBySlug = async (slug) => {
    const blog = await Blog_1.default.findOne({ slug, status: 'published' }).populate('author', 'name');
    if (!blog)
        throw new helpers_1.AppError('Blog not found', 404);
    blog.views += 1;
    await blog.save();
    return blog;
};
exports.getBlogBySlug = getBlogBySlug;
const getBlogById = async (id) => {
    const blog = await Blog_1.default.findById(id).populate('author', 'name');
    if (!blog)
        throw new helpers_1.AppError('Blog not found', 404);
    return blog;
};
exports.getBlogById = getBlogById;
const applyPublishMeta = (data) => {
    if (data.status === 'published' && !data.publishedAt) {
        data.publishedAt = new Date();
    }
    if (data.status === 'draft') {
        data.publishedAt = undefined;
    }
    return data;
};
const createBlog = async (data) => {
    if (!data.slug)
        data.slug = (0, helpers_1.generateSlug)(data.title);
    return Blog_1.default.create(applyPublishMeta({ ...data }));
};
exports.createBlog = createBlog;
const updateBlog = async (id, data) => {
    const existing = await Blog_1.default.findById(id);
    if (!existing)
        throw new helpers_1.AppError('Blog not found', 404);
    const payload = applyPublishMeta({ ...data });
    if (payload.status === 'published' && !payload.publishedAt && !existing.publishedAt) {
        payload.publishedAt = new Date();
    }
    const blog = await Blog_1.default.findByIdAndUpdate(id, payload, { new: true }).populate('author', 'name');
    return blog;
};
exports.updateBlog = updateBlog;
const deleteBlog = async (id) => {
    const blog = await Blog_1.default.findByIdAndDelete(id);
    if (!blog)
        throw new helpers_1.AppError('Blog not found', 404);
    return blog;
};
exports.deleteBlog = deleteBlog;
