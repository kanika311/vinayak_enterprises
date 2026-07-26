"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRFQReport = exports.updateRFQ = exports.createRFQ = exports.getRFQs = void 0;
const RFQ_1 = __importDefault(require("../models/RFQ"));
const helpers_1 = require("../utils/helpers");
const getRFQs = async (query) => {
    const { page, limit, skip } = (0, helpers_1.getPagination)({ query });
    const filter = {};
    if (query.status)
        filter.status = query.status;
    const sort = (0, helpers_1.buildSort)(query.sortBy, query.order);
    const [rfqs, total] = await Promise.all([
        RFQ_1.default.find(filter).populate('product', 'name sku').populate('assignedTo', 'name email').sort(sort).skip(skip).limit(limit),
        RFQ_1.default.countDocuments(filter),
    ]);
    return { rfqs, total, page, limit, pages: Math.ceil(total / limit) };
};
exports.getRFQs = getRFQs;
const isObjectId = (value) => typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value.trim());
const createRFQ = async (data) => {
    const payload = { ...data, status: 'pending' };
    const rawProduct = payload.product;
    const rawProductName = payload.productName;
    delete payload.product;
    delete payload.productName;
    if (isObjectId(rawProduct)) {
        payload.product = String(rawProduct).trim();
    }
    else if (rawProductName && String(rawProductName).trim()) {
        payload.productName = String(rawProductName).trim();
    }
    else if (rawProduct && String(rawProduct).trim()) {
        payload.productName = String(rawProduct).trim();
    }
    if (!payload.quantity)
        payload.quantity = 1;
    return RFQ_1.default.create(payload);
};
exports.createRFQ = createRFQ;
const updateRFQ = async (id, data) => {
    const rfq = await RFQ_1.default.findByIdAndUpdate(id, data, { new: true }).populate('product', 'name sku');
    if (!rfq)
        throw new helpers_1.AppError('RFQ not found', 404);
    return rfq;
};
exports.updateRFQ = updateRFQ;
const getRFQReport = async (query) => {
    const filter = {};
    if (query.startDate || query.endDate) {
        filter.createdAt = {};
        if (query.startDate)
            filter.createdAt.$gte = new Date(query.startDate);
        if (query.endDate)
            filter.createdAt.$lte = new Date(query.endDate);
    }
    return RFQ_1.default.find(filter).populate('product', 'name sku').sort({ createdAt: -1 });
};
exports.getRFQReport = getRFQReport;
