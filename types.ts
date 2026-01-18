
export type UserRole = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isBlocked: boolean;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  stock: number;
  sku: string;
  rating: number;
  numReviews: number;
  reviews: Review[];
  isFeatured: boolean;
  isFlashSale?: boolean;
  status: 'active' | 'inactive';
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: 'COD' | 'SSLCOMMERZ';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: OrderStatus;
  createdAt: string;
}

export interface SiteSettings {
  name: string;
  logo: string;
  bannerTitle: string;
  bannerSubtitle: string;
  deliveryCharge: number;
  taxRate: number;
}
