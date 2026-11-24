"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCatalogue = exports.updateCatalogue = exports.trackDownload = exports.uploadCatalogue = exports.createCatalogue = exports.getCatalogues = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const Catalogue_1 = __importDefault(require("../models/Catalogue"));
const Download_1 = __importDefault(require("../models/Download"));
const helpers_1 = require("../utils/helpers");
const cloudinary_1 = require("../config/cloudinary");
const cloudinaryService_1 = require("./cloudinaryService");
const getCatalogues = async (query) => {
    const { page, limit, skip } = (0, helpers_1.getPagination)({ query });
    const [catalogues, total] = await Promise.all([
        Catalogue_1.default.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Catalogue_1.default.countDocuments(),
    ]);
    return { catalogues, total, page, limit, pages: Math.ceil(total / limit) };
};
exports.getCatalogues = getCatalogues;
const createCatalogue = async (data) => {
    if (!data.slug)
        data.slug = (0, helpers_1.generateSlug)(data.title);
    return Catalogue_1.default.create(data);
};
exports.createCatalogue = createCatalogue;
const uploadCatalogue = async (file, title) => {
    let fileUrl = '';
    let publicId;
    if ((0, cloudinary_1.isCloudinaryConfigured)()) {
        try {
            const res = await (0, cloudinaryService_1.uploadToCloudinary)(file, 'catalogues');
            fileUrl = res.url;
            publicId = res.publicId;
        }
        catch (e) {
            console.warn('Cloudinary upload failed, saving locally:', e);
        }
    }
    if (!fileUrl) {
        const ext = path_1.default.extname(file.originalname) || '.pdf';
        const filename = `${Date.now()}-${(0, crypto_1.randomBytes)(6).toString('hex')}${ext}`;
        const dir = path_1.default.join(process.cwd(), 'public', 'uploads', 'catalogues');
        (0, fs_1.mkdirSync)(dir, { recursive: true });
        (0, fs_1.writeFileSync)(path_1.default.join(dir, filename), file.buffer);
        fileUrl = `/uploads/catalogues/${filename}`;
    }
    const name = title || file.originalname.replace(/\.pdf$/i, '') || 'Vinayak Enterprises Catalogue';
    const slug = (0, helpers_1.generateSlug)(name) + '-' + Date.now().toString(36);
    // Set previous catalogues to inactive
    await Catalogue_1.default.updateMany({}, { isActive: false });
    return Catalogue_1.default.create({
        title: name,
        slug,
        file: {
            url: fileUrl,
            publicId,
            filename: file.originalname,
        },
        category: 'All Products',
        isActive: true,
    });
};
exports.uploadCatalogue = uploadCatalogue;
const trackDownload = async (catalogueId, visitorData) => {
    const catalogue = await Catalogue_1.default.findById(catalogueId);
    if (!catalogue)
        throw new helpers_1.AppError('Catalogue not found', 404);
    catalogue.downloadCount += 1;
    await catalogue.save();
    await Download_1.default.create({ catalogue: catalogueId, ...visitorData });
    return catalogue;
};
exports.trackDownload = trackDownload;
const updateCatalogue = async (id, data) => {
    if (data.isActive) {
        await Catalogue_1.default.updateMany({ _id: { $ne: id } }, { isActive: false });
    }
    const catalogue = await Catalogue_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!catalogue)
        throw new helpers_1.AppError('Catalogue not found', 404);
    return catalogue;
};
exports.updateCatalogue = updateCatalogue;
const deleteCatalogue = async (id) => {
    const catalogue = await Catalogue_1.default.findByIdAndDelete(id);
    if (!catalogue)
        throw new helpers_1.AppError('Catalogue not found', 404);
    return catalogue;
};
exports.deleteCatalogue = deleteCatalogue;
