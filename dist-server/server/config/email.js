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
        !pass.includes('your-app-password') &&
        !pass.includes('your-16-char'));
};
exports.isEmailConfigured = isEmailConfigured;
function createTransporter() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    if (host.includes('gmail')) {
        return nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });
    }
    return nodemailer_1.default.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    });
}
const sendEmail = async (options) => {
    if (!(0, exports.isEmailConfigured)()) {
        throw new Error('SMTP is not configured. Set SMTP_USER and SMTP_PASS in server environment variables.');
    }
    const transporter = createTransporter();
    await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
    });
};
exports.sendEmail = sendEmail;
exports.default = createTransporter;
