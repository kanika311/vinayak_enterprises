import RFQ from '../models/RFQ';
import { AppError, getPagination, buildSort } from '../utils/helpers';

export const getRFQs = async (query: Record<string, string>) => {
  const { page, limit, skip } = getPagination({ query } as never);
  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;

  const sort = buildSort(query.sortBy, query.order);
  const [rfqs, total] = await Promise.all([
    RFQ.find(filter).populate('product', 'name sku').populate('assignedTo', 'name email').sort(sort).skip(skip).limit(limit),
    RFQ.countDocuments(filter),
  ]);
  return { rfqs, total, page, limit, pages: Math.ceil(total / limit) };
};

const isObjectId = (value: unknown) =>
  typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value.trim());

export const createRFQ = async (data: Record<string, unknown>) => {
  const payload: Record<string, unknown> = { ...data, status: 'pending' };
  const rawProduct = payload.product;
  const rawProductName = payload.productName;

  delete payload.product;
  delete payload.productName;

  if (isObjectId(rawProduct)) {
    payload.product = String(rawProduct).trim();
  } else if (rawProductName && String(rawProductName).trim()) {
    payload.productName = String(rawProductName).trim();
  } else if (rawProduct && String(rawProduct).trim()) {
    payload.productName = String(rawProduct).trim();
  }

  if (!payload.quantity) payload.quantity = 1;

  return RFQ.create(payload);
};

export const updateRFQ = async (id: string, data: Record<string, unknown>) => {
  const rfq = await RFQ.findByIdAndUpdate(id, data, { new: true }).populate('product', 'name sku');
  if (!rfq) throw new AppError('RFQ not found', 404);
  return rfq;
};

export const getRFQReport = async (query: Record<string, string>) => {
  const filter: Record<string, unknown> = {};
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) (filter.createdAt as Record<string, Date>).$gte = new Date(query.startDate);
    if (query.endDate) (filter.createdAt as Record<string, Date>).$lte = new Date(query.endDate);
  }
  return RFQ.find(filter).populate('product', 'name sku').sort({ createdAt: -1 });
};
