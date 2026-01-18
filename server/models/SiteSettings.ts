
import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  name: string;
  logo: string;
  favicon?: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  taxRate: number;
  deliveryCharge: number;
  banners: {
    image: string;
    title: string;
    subtitle?: string;
    link?: string;
  }[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  features: {
    enableFlashSale: boolean;
    enableReviews: boolean;
    maintenanceMode: boolean;
  };
}

const SiteSettingsSchema: Schema = new Schema({
  name: { type: String, required: true, default: 'ShuchonaMart' },
  logo: { type: String },
  favicon: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  currency: { type: String, default: 'BDT' },
  taxRate: { type: Number, default: 5 },
  deliveryCharge: { type: Number, default: 60 },
  banners: [
    {
      image: String,
      title: String,
      subtitle: String,
      link: String
    }
  ],
  socialLinks: [
    {
      platform: String,
      url: String
    }
  ],
  features: {
    enableFlashSale: { type: Boolean, default: true },
    enableReviews: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false }
  }
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
