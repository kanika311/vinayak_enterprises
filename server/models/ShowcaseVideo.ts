import mongoose, { Document, Schema } from 'mongoose';

export interface IShowcaseVideo extends Document {
  title: string;
  description?: string;
  videoUrl: string;
  videoPublicId?: string;
  posterUrl?: string;
  category: string;
  duration?: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  views: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const showcaseVideoSchema = new Schema<IShowcaseVideo>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    videoUrl: { type: String, required: true },
    videoPublicId: String,
    posterUrl: String,
    category: {
      type: String,
      default: 'General',
      enum: ['Microscopes', 'Anatomy Models', 'CPR Manikins', 'Lab Equipment', 'Demonstration', 'General'],
    },
    duration: { type: String, default: '1:30' },
    isFeatured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

showcaseVideoSchema.index({ isActive: 1, order: 1, createdAt: -1 });
showcaseVideoSchema.index({ category: 1, isActive: 1 });

export default mongoose.model<IShowcaseVideo>('ShowcaseVideo', showcaseVideoSchema);
