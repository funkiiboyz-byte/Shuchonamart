
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product, CartItem, Order, Category, SiteSettings } from './types';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User | null, token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'shuchonamart-auth' }
  )
);

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);
        let newItems;
        if (existingItem) {
          newItems = items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          newItems = [...items, { ...product, quantity: 1 }];
        }
        set({ items: newItems, total: calculateTotal(newItems) });
      },
      removeItem: (productId) => {
        const newItems = get().items.filter((item) => item.id !== productId);
        set({ items: newItems, total: calculateTotal(newItems) });
      },
      updateQuantity: (productId, quantity) => {
        const newItems = get().items.map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        set({ items: newItems, total: calculateTotal(newItems) });
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    { name: 'shuchonamart-cart' }
  )
);

const calculateTotal = (items: CartItem[]) =>
  items.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);

interface ShopState {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: User[];
  settings: SiteSettings;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateUser: (user: User) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      products: MOCK_PRODUCTS,
      categories: CATEGORIES.map(c => ({ id: c.id, name: c.name, slug: c.slug })),
      orders: [],
      users: [
        { id: 'u1', name: 'Admin User', email: 'admin@shuchonamart.com', role: 'ADMIN', isBlocked: false, createdAt: new Date().toISOString() },
        { id: 'u2', name: 'Kabir Hossain', email: 'kabir@test.com', role: 'CUSTOMER', isBlocked: false, createdAt: new Date().toISOString() }
      ],
      settings: {
        name: 'ShuchonaMart',
        logo: '',
        bannerTitle: 'Elevate Your Lifestyle with ShuchonaMart',
        bannerSubtitle: 'The premier destination for the finest tech, fashion, and home essentials in Bangladesh.',
        deliveryCharge: 60,
        taxRate: 5
      },
      loading: false,
      setLoading: (loading) => set({ loading }),
      setProducts: (products) => set({ products }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (product) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === product.id ? product : p)),
        })),
      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        })),
      updateUser: (user) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === user.id ? user : u)),
        })),
    }),
    { name: 'shuchonamart-shop-data' }
  )
);
