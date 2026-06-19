"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParam = exports.generateSlug = exports.buildSort = exports.getPagination = exports.sendResponse = exports.asyncHandler = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
const sendResponse = (res, statusCode, data, message) => {
    res.status(statusCode).json({
        success: statusCode < 400,
        message,
        data,
    });
};
exports.sendResponse = sendResponse;
const getPagination = (req) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.getPagination = getPagination;
const buildSort = (sortBy, order) => {
    const field = sortBy || 'createdAt';
    const direction = order === 'asc' ? 1 : -1;
    return { [field]: direction };
};
exports.buildSort = buildSort;
const generateSlug = (text) => text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
exports.generateSlug = generateSlug;
const getParam = (value) => Array.isArray(value) ? value[0] : value ?? '';
exports.getParam = getParam;
