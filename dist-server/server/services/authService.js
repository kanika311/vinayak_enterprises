"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = exports.resetPassword = exports.forgotPassword = exports.loginAdmin = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const Admin_1 = __importDefault(require("../models/Admin"));
const constants_1 = require("../constants");
const helpers_1 = require("../utils/helpers");
const email_1 = require("../config/email");
const generateToken = (admin) => {
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d');
    return jsonwebtoken_1.default.sign({ id: admin._id, email: admin.email, role: admin.role, permissions: admin.permissions }, process.env.JWT_SECRET, { expiresIn });
};
exports.generateToken = generateToken;
const loginAdmin = async (email, password) => {
    const admin = await Admin_1.default.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
        throw new helpers_1.AppError('Invalid email or password', 401);
    }
    if (!admin.isActive)
        throw new helpers_1.AppError('Account is deactivated', 401);
    admin.lastLogin = new Date();
    await admin.save();
    const token = (0, exports.generateToken)({
        _id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
    });
    return {
        token,
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
            avatar: admin.avatar,
        },
    };
};
exports.loginAdmin = loginAdmin;
const forgotPassword = async (email) => {
    const admin = await Admin_1.default.findOne({ email });
    if (!admin)
        throw new helpers_1.AppError('No account found with that email', 404);
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    admin.resetPasswordToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    admin.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
    await admin.save();
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/console/reset-password?token=${resetToken}`;
    if ((0, email_1.isEmailConfigured)()) {
        try {
            await (0, email_1.sendEmail)({
                to: admin.email,
                subject: 'Password Reset — Scientific Instruments Admin',
                html: `
          <p>Hello ${admin.name},</p>
          <p>Click the link below to reset your password. It expires in 1 hour.</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>If you did not request this, ignore this email.</p>
        `,
                text: `Reset your password: ${resetUrl}`,
            });
        }
        catch (err) {
            console.error('Failed to send reset email:', err);
            throw new helpers_1.AppError('Could not send email. Check SMTP settings in backend .env', 500);
        }
    }
    else if (process.env.NODE_ENV === 'development') {
        console.log('\n--- PASSWORD RESET LINK (SMTP not configured) ---');
        console.log(resetUrl);
        console.log('-------------------------------------------------\n');
        return {
            message: 'SMTP not configured — reset link logged in backend terminal',
            devResetUrl: resetUrl,
        };
    }
    else {
        throw new helpers_1.AppError('Email service is not configured on the server', 503);
    }
    return { message: 'Password reset email sent' };
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (token, password) => {
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const admin = await Admin_1.default.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!admin)
        throw new helpers_1.AppError('Invalid or expired reset token', 400);
    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();
    return { message: 'Password reset successful' };
};
exports.resetPassword = resetPassword;
const createAdmin = async (data) => {
    const existing = await Admin_1.default.findOne({ email: data.email });
    if (existing)
        throw new helpers_1.AppError('Email already registered', 400);
    const role = data.role;
    const permissions = constants_1.ROLE_PERMISSIONS[role] || constants_1.ROLE_PERMISSIONS[constants_1.ROLES.ADMIN];
    const admin = await Admin_1.default.create({ ...data, permissions });
    return admin;
};
exports.createAdmin = createAdmin;
