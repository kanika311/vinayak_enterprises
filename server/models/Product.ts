import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: mongoose.Types.ObjectId;
  subcategory?: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  price?: number;
  mrp?: number;
  priceUnit?: string;
  features: string[];
  specifications: { key: string; value: string }[];
  images: { url: string; publicId?: string; alt?: string }[];
  videos: { url: string; publicId?: string; title?: string }[];
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords: string[];
  faq: { question: string; answer: string }[];
  brochure?: { url: string; publicId?: string };
  status: 'draft' | 'published';
  views: number;
  enquiryCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: String,
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    price: { type: Number, min: 0 },
    mrp: { type: Number, min: 0 },
    priceUnit: { type: String, default: 'Piece' },
    features: [String],
    specifications: [{ key: String, value: String }],
    images: [{ url: String, publicId: String, alt: String }],
    videos: [{ url: String, publicId: String, title: String }],
    seoTitle: String,
    seoDescription: String,
    metaKeywords: [String],
    faq: [{ question: String, answer: String }],
    brochure: { url: String, publicId: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    views: { type: Number, default: 0 },
    enquiryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', shortDescription: 'text', sku: 'text' });
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ category: 1, status: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
