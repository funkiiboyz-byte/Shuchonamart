
import React from 'react';
import { 
  ShoppingBag, 
  Smartphone, 
  Home, 
  Tv, 
  Shirt, 
  User as UserIcon,
  Headphones,
  Laptop
} from 'lucide-react';
import { Product } from './types';

export const CATEGORIES = [
  { id: '1', name: 'Electronics', slug: 'electronics', icon: <Smartphone className="w-5 h-5"/> },
  { id: '2', name: 'Home Appliances', slug: 'home-appliances', icon: <Tv className="w-5 h-5"/> },
  { id: '3', name: 'Fashion', slug: 'fashion', icon: <Shirt className="w-5 h-5"/> },
  { id: '4', name: 'Accessories', slug: 'accessories', icon: <Headphones className="w-5 h-5"/> },
  { id: '5', name: 'Computers', slug: 'computers', icon: <Laptop className="w-5 h-5"/> },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Realme GT Neo 5 SE',
    slug: 'realme-gt-neo-5-se',
    description: 'Powerful performance with Snapdragon 7+ Gen 2 processor.',
    price: 32500,
    discountPrice: 29990,
    category: 'Electronics',
    images: ['https://picsum.photos/seed/phone1/500/500', 'https://picsum.photos/seed/phone2/500/500'],
    stock: 50,
    sku: 'RME-GT-5SE',
    rating: 4.8,
    numReviews: 120,
    // Fix: Added missing reviews property
    reviews: [],
    isFeatured: true,
    status: 'active'
  },
  {
    id: 'p2',
    name: 'Logitech G502 Hero',
    slug: 'logitech-g502-hero',
    description: 'High performance wired gaming mouse with HERO sensor.',
    price: 5500,
    discountPrice: 4800,
    category: 'Accessories',
    images: ['https://picsum.photos/seed/mouse1/500/500'],
    stock: 15,
    sku: 'LOG-G502',
    rating: 4.9,
    numReviews: 450,
    // Fix: Added missing reviews property
    reviews: [],
    isFeatured: true,
    status: 'active'
  },
  {
    id: 'p3',
    name: 'Smart TV 55" 4K UHD',
    slug: 'smart-tv-55-4k',
    description: 'Immersive viewing experience with crystal clear resolution.',
    price: 75000,
    discountPrice: 68000,
    category: 'Home Appliances',
    images: ['https://picsum.photos/seed/tv1/500/500'],
    stock: 8,
    sku: 'TV-55-4K',
    rating: 4.5,
    numReviews: 89,
    // Fix: Added missing reviews property
    reviews: [],
    isFeatured: false,
    status: 'active'
  },
  {
    id: 'p4',
    name: 'Premium Cotton Polo Shirt',
    slug: 'premium-polo-shirt',
    description: 'Breathable and stylish polo shirt for everyday wear.',
    price: 1200,
    discountPrice: 950,
    category: 'Fashion',
    images: ['https://picsum.photos/seed/shirt1/500/500'],
    stock: 100,
    sku: 'POL-001',
    rating: 4.2,
    numReviews: 320,
    // Fix: Added missing reviews property
    reviews: [],
    isFeatured: true,
    status: 'active'
  }
];

export const THEME_COLOR = {
  primary: '#f97316', // Orange-500
  secondary: '#166534', // Green-800
  accent: '#0ea5e9' // Sky-500
};
