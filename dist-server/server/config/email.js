"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.isEmailConfigured = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const isEmailConfigured = () => {
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';
    return Boolean(user &&
        pass &&
        !user.includes('your-email') &&
        !pass.includes('your-app-password'));
};
exports.isEmailConfigured = isEmailConfigured;
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendEmail = async (options) => {
    if (!(0, exports.isEmailConfigured)()) {
        throw new Error('SMTP is not configured. Set SMTP_USER and SMTP_PASS in backend .env');
    }
    await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
    });
};
exports.sendEmail = sendEmail;
exports.default = transporter;
