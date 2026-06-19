"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaType = exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const stream_1 = require("stream");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const bufferToStream = (buffer) => {
    const stream = new stream_1.Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
};
const uploadToCloudinary = (file, folder = 'scientific-instruments') => {
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
const deleteFromCloudinary = async (publicId) => {
    await cloudinary_1.default.uploader.destroy(publicId);
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
