import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailVerificationToken extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const EmailVerificationTokenSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

EmailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.EmailVerificationToken ||
  mongoose.model<IEmailVerificationToken>('EmailVerificationToken', EmailVerificationTokenSchema);
