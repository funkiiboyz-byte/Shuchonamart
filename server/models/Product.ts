
import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  user: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  stock: number;
  sku: string;
  rating: number;
  numReviews: number;
  reviews: IReview[];
  isFeatured: boolean;
  status: 'active' | 'inactive';
  createdBy: mongoose.Types.ObjectId;
}

const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String, required: true }],
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true, unique: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [ReviewSchema],
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Full text search index
ProductSchema.index({ name: 'text', description: 'text', sku: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ slug: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
