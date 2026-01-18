
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  parent?: mongoose.Types.ObjectId;
  description?: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  icon: { type: String },
  parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  description: { type: String }
}, { timestamps: true });

CategorySchema.index({ slug: 1 });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
