import mongoose, { Document, Schema } from 'mongoose';

export interface ICatalogue extends Document {
  title: string;
  slug: string;
  description?: string;
  file: { url: string; publicId?: string; filename?: string };
  category?: string;
  pageCount?: number;
  downloadCount: number;
  isActive: boolean;
}

const catalogueSchema = new Schema<ICatalogue>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    file: {
      url: { type: String, required: true },
      publicId: String,
      filename: String,
    },
    category: String,
    pageCount: { type: Number, default: 1 },
    downloadCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICatalogue>('Catalogue', catalogueSchema);
