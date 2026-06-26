import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  company: string;
  designation?: string;
  email?: string;
  productName?: string;
  review: string;
  image?: { url: string; publicId?: string };
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  order: number;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    designation: String,
    email: String,
    productName: String,
    review: { type: String, required: true },
    image: { url: String, publicId: String },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
