"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogBySlug = exports.getBlogs = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const helpers_1 = require("../utils/helpers");
const getBlogs = async (query, publicOnly = false) => {
    const { page, limit, skip } = (0, helpers_1.getPagination)({ query });
    const filter = {};
    if (publicOnly)
        filter.status = 'published';
    else if (query.status)
        filter.status = query.status;
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
const createBlog = async (data) => {
    if (!data.slug)
        data.slug = (0, helpers_1.generateSlug)(data.title);
    return Blog_1.default.create(data);
};
exports.createBlog = createBlog;
const updateBlog = async (id, data) => {
    const blog = await Blog_1.default.findByIdAndUpdate(id, data, { new: true }).populate('author', 'name');
    if (!blog)
        throw new helpers_1.AppError('Blog not found', 404);
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
