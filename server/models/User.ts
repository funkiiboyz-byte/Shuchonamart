
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
  avatar?: string;
  isBlocked: boolean;
  isVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['ADMIN', 'VENDOR', 'CUSTOMER'], default: 'CUSTOMER' },
  avatar: { type: String },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: { type: String, default: 'Bangladesh' }
  }
}, { timestamps: true });

// Create indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
