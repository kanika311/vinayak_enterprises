"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCatalogue = exports.trackDownload = exports.createCatalogue = exports.getCatalogues = void 0;
const Catalogue_1 = __importDefault(require("../models/Catalogue"));
const Download_1 = __importDefault(require("../models/Download"));
const helpers_1 = require("../utils/helpers");
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
const deleteCatalogue = async (id) => {
    const catalogue = await Catalogue_1.default.findByIdAndDelete(id);
    if (!catalogue)
        throw new helpers_1.AppError('Catalogue not found', 404);
    return catalogue;
};
exports.deleteCatalogue = deleteCatalogue;
