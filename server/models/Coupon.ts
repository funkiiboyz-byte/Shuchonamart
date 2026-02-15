import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minimumPurchase?: number;
  maximumDiscount?: number;
  expiresAt?: Date;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

const CouponSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'flat'], required: true },
  value: { type: Number, required: true, min: 0 },
  minimumPurchase: { type: Number, min: 0 },
  maximumDiscount: { type: Number, min: 0 },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, min: 1 },
  usedCount: { type: Number, default: 0 }
}, { timestamps: true });

CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, expiresAt: 1 });

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
