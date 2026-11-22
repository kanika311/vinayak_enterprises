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
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWebpUrl = exports.getCloudinarySignature = exports.getMediaType = exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const stream_1 = require("stream");
const cloudinary_1 = __importStar(require("../config/cloudinary"));
const helpers_1 = require("../utils/helpers");
const bufferToStream = (buffer) => {
    const stream = new stream_1.Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
};
const uploadToCloudinary = (file, folder = 'scientific-instruments') => {
    if (!(0, cloudinary_1.ensureCloudinaryConfigured)()) {
        return Promise.reject(new Error('Cloudinary is not configured'));
    }
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder,
            resource_type: file.mimetype.startsWith('video/') ? 'video' : 'auto',
        }, (error, result) => {
            if (error || !result)
                return reject(error);
            resolve({ url: result.secure_url, publicId: result.public_id });
        });
        bufferToStream(file.buffer).pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId, resourceType = 'auto') => {
    await cloudinary_1.default.uploader.destroy(publicId, { resource_type: resourceType });
};
exports.deleteFromCloudinary = deleteFromCloudinary;
const getMediaType = (mimetype) => {
    if (mimetype.startsWith('image/'))
        return 'image';
    if (mimetype.startsWith('video/'))
        return 'video';
    if (mimetype === 'application/pdf')
        return 'pdf';
    return 'document';
};
exports.getMediaType = getMediaType;
/** Generate signed upload parameters so the browser can upload large videos directly to Cloudinary */
const getCloudinarySignature = (folder = 'showcase_videos') => {
    if (!(0, cloudinary_1.ensureCloudinaryConfigured)()) {
        throw new helpers_1.AppError('Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Vercel Project Settings.', 400);
    }
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
        folder,
        timestamp,
    };
    const signature = cloudinary_1.default.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
    return {
        signature,
        timestamp,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        folder,
    };
};
exports.getCloudinarySignature = getCloudinarySignature;
/** Convert any Cloudinary image to WebP with auto quality */
const toWebpUrl = (url) => {
    if (!url || !url.includes('res.cloudinary.com') || !url.includes('/image/upload/'))
        return url;
    if (url.includes('/upload/f_webp'))
        return url;
    return url.replace('/image/upload/', '/image/upload/f_webp,q_auto/');
};
exports.toWebpUrl = toWebpUrl;
