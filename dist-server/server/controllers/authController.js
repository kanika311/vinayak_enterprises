"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = exports.updateAdmin = exports.getAdmins = exports.createAdmin = exports.getMe = exports.resetPassword = exports.forgotPassword = exports.login = void 0;
const helpers_1 = require("../utils/helpers");
const authService = __importStar(require("../services/authService"));
const dashboardService = __importStar(require("../services/dashboardService"));
const Admin_1 = __importDefault(require("../models/Admin"));
exports.login = (0, helpers_1.asyncHandler)(async (req, res) => {
    const result = await authService.loginAdmin(req.body.email, req.body.password);
    (0, helpers_1.sendResponse)(res, 200, result, 'Login successful');
});
exports.forgotPassword = (0, helpers_1.asyncHandler)(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);
    (0, helpers_1.sendResponse)(res, 200, result);
});
exports.resetPassword = (0, helpers_1.asyncHandler)(async (req, res) => {
    const result = await authService.resetPassword(req.body.token, req.body.password);
    (0, helpers_1.sendResponse)(res, 200, result);
});
exports.getMe = (0, helpers_1.asyncHandler)(async (req, res) => {
    const admin = await Admin_1.default.findById(req.user.id).select('-password');
    (0, helpers_1.sendResponse)(res, 200, {
        id: admin?._id,
        name: admin?.name,
        email: admin?.email,
        role: admin?.role,
        permissions: admin?.permissions,
        avatar: admin?.avatar,
    });
});
exports.createAdmin = (0, helpers_1.asyncHandler)(async (req, res) => {
    const admin = await authService.createAdmin(req.body);
    (0, helpers_1.sendResponse)(res, 201, admin, 'Admin created');
});
exports.getAdmins = (0, helpers_1.asyncHandler)(async (_req, res) => {
    const admins = await Admin_1.default.find().select('-password').sort({ createdAt: -1 });
    (0, helpers_1.sendResponse)(res, 200, admins);
});
exports.updateAdmin = (0, helpers_1.asyncHandler)(async (req, res) => {
    const admin = await Admin_1.default.findByIdAndUpdate((0, helpers_1.getParam)(req.params.id), req.body, { new: true }).select('-password');
    (0, helpers_1.sendResponse)(res, 200, admin);
});
exports.getDashboard = (0, helpers_1.asyncHandler)(async (_req, res) => {
    const data = await dashboardService.getDashboardStats();
    (0, helpers_1.sendResponse)(res, 200, data);
});
