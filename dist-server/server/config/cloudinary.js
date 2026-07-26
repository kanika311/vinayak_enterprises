"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCloudinaryConfigured = exports.isCloudinaryConfigured = void 0;
const cloudinary_1 = require("cloudinary");
let configured = false;
const isCloudinaryConfigured = () => {
    const name = process.env.CLOUDINARY_CLOUD_NAME || '';
    const key = process.env.CLOUDINARY_API_KEY || '';
    const secret = process.env.CLOUDINARY_API_SECRET || '';
    return Boolean(name && key && secret &&
        !name.includes('your_cloud') &&
        !key.includes('your_api') &&
        !secret.includes('your_api'));
};
exports.isCloudinaryConfigured = isCloudinaryConfigured;
const ensureCloudinaryConfigured = () => {
    if (!(0, exports.isCloudinaryConfigured)())
        return false;
    if (!configured) {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        configured = true;
    }
    return true;
};
exports.ensureCloudinaryConfigured = ensureCloudinaryConfigured;
exports.default = cloudinary_1.v2;
