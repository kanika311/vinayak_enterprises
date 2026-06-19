"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helpers_1 = require("../utils/helpers");
const Admin_1 = __importDefault(require("../models/Admin"));
const protect = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next(new helpers_1.AppError('Not authorized, no token', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const admin = await Admin_1.default.findById(decoded.id).select('-password');
        if (!admin || !admin.isActive) {
            return next(new helpers_1.AppError('Admin not found or inactive', 401));
        }
        req.user = {
            id: admin._id.toString(),
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
        };
        next();
    }
    catch {
        next(new helpers_1.AppError('Not authorized, token failed', 401));
    }
};
exports.protect = protect;
const authorize = (...permissions) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new helpers_1.AppError('Not authorized', 401));
        }
        const hasPermission = permissions.some((p) => req.user.permissions.includes(p));
        if (!hasPermission) {
            return next(new helpers_1.AppError('Forbidden: insufficient permissions', 403));
        }
        next();
    };
};
exports.authorize = authorize;
