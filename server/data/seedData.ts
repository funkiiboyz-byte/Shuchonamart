export const users = [
  {
    name: 'Admin User',
    email: 'admin@shuchonamart.com',
    password: 'Admin123!',
    role: 'ADMIN',
    isVerified: true
  },
  {
    name: 'Kabir Hossain',
    email: 'kabir@test.com',
    password: 'Customer123!',
    role: 'CUSTOMER',
    isVerified: true
  }
];

export const categories = [
  { name: 'Electronics', slug: 'electronics', icon: 'Monitor', description: 'Smart devices and accessories' },
  { name: 'Fashion', slug: 'fashion', icon: 'Shirt', description: 'Style essentials for everyone' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: 'Sofa', description: 'Comfort and utility for your home' },
  { name: 'Beauty', slug: 'beauty', icon: 'Sparkles', description: 'Skincare, makeup, and wellness' }
];

export const products = [
  {
    name: 'Aurora Pro Smartphone',
    slug: 'aurora-pro-smartphone',
    description: 'Flagship performance with a stunning AMOLED display and all-day battery.',
    price: 74990,
    discountPrice: 69990,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80'
    ],
    stock: 42,
    sku: 'AP-001',
    rating: 4.7,
    numReviews: 128,
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'ZenBreeze Air Purifier',
    slug: 'zenbreeze-air-purifier',
    description: 'Clean air in minutes with whisper-quiet filtration and smart sensors.',
    price: 18990,
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80'
    ],
    stock: 30,
    sku: 'ZB-014',
    rating: 4.5,
    numReviews: 64,
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'LushFit Activewear Set',
    slug: 'lushfit-activewear-set',
    description: 'Breathable, sweat-wicking fabric with a flattering fit.',
    price: 5990,
    discountPrice: 4990,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80'
    ],
    stock: 75,
    sku: 'LF-210',
    rating: 4.6,
    numReviews: 89,
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'GlowPure Skincare Kit',
    slug: 'glowpure-skincare-kit',
    description: 'A complete routine for radiant, hydrated skin.',
    price: 3490,
    images: [
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80'
    ],
    stock: 120,
    sku: 'GP-008',
    rating: 4.8,
    numReviews: 155,
    isFeatured: true,
    status: 'active'
  }
];
