import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  videoUrl: string;
  videoPublicId?: string;
  posterUrl?: string;
  placement: 'hero';
  isActive: boolean;
  order: number;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true },
    videoPublicId: String,
    posterUrl: String,
    placement: { type: String, enum: ['hero'], default: 'hero' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bannerSchema.index({ placement: 1, isActive: 1, order: 1 });

export default mongoose.model<IBanner>('Banner', bannerSchema);
