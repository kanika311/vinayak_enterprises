"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignLead = exports.addLeadNote = exports.updateLead = exports.createLead = exports.getLeads = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const helpers_1 = require("../utils/helpers");
const getLeads = async (query) => {
    const { page, limit, skip } = (0, helpers_1.getPagination)({ query });
    const filter = {};
    if (query.status)
        filter.status = query.status;
    if (query.leadSource)
        filter.leadSource = query.leadSource;
    if (query.assignedTo)
        filter.assignedTo = query.assignedTo;
    if (query.search) {
        filter.$or = [
            { name: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } },
            { company: { $regex: query.search, $options: 'i' } },
        ];
    }
    const sort = (0, helpers_1.buildSort)(query.sortBy, query.order);
    const [leads, total] = await Promise.all([
        Lead_1.default.find(filter)
            .populate('assignedTo', 'name email')
            .populate('product', 'name sku')
            .sort(sort)
            .skip(skip)
            .limit(limit),
        Lead_1.default.countDocuments(filter),
    ]);
    return { leads, total, page, limit, pages: Math.ceil(total / limit) };
};
exports.getLeads = getLeads;
const createLead = async (data) => {
    const lead = await Lead_1.default.create({
        ...data,
        timeline: [{ action: 'created', description: 'Lead created', createdAt: new Date() }],
    });
    return lead;
};
exports.createLead = createLead;
const updateLead = async (id, data, adminId) => {
    const lead = await Lead_1.default.findById(id);
    if (!lead)
        throw new helpers_1.AppError('Lead not found', 404);
    if (data.status && data.status !== lead.status) {
        lead.timeline.push({
            action: 'status_changed',
            description: `Status changed to ${data.status}`,
            createdBy: adminId,
            createdAt: new Date(),
        });
    }
    Object.assign(lead, data);
    await lead.save();
    return lead.populate(['assignedTo', 'product']);
};
exports.updateLead = updateLead;
const addLeadNote = async (id, text, adminId) => {
    const lead = await Lead_1.default.findById(id);
    if (!lead)
        throw new helpers_1.AppError('Lead not found', 404);
    lead.notes.push({ text, createdBy: adminId, createdAt: new Date() });
    lead.timeline.push({
        action: 'note_added',
        description: 'Note added',
        createdBy: adminId,
        createdAt: new Date(),
    });
    await lead.save();
    return lead;
};
exports.addLeadNote = addLeadNote;
const assignLead = async (id, assignedTo, adminId) => {
    const lead = await Lead_1.default.findByIdAndUpdate(id, { assignedTo }, { new: true }).populate('assignedTo', 'name email');
    if (!lead)
        throw new helpers_1.AppError('Lead not found', 404);
    lead.timeline.push({
        action: 'assigned',
        description: 'Lead assigned to sales executive',
        createdBy: adminId,
        createdAt: new Date(),
    });
    await lead.save();
    return lead;
};
exports.assignLead = assignLead;
