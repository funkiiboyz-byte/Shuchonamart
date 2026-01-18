
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShoppingBag, Search, User as UserIcon, Menu, X, ChevronRight, Star, 
  Trash2, Plus, Minus, LayoutDashboard, Package, Users, BarChart3, 
  Settings, LogOut, Sparkles, ArrowRight, Filter, CheckCircle2, 
  ArrowLeft, Mail, Lock, Phone, MessageSquare, TrendingUp, 
  DollarSign, ShoppingCart, Percent, User as UserProfileIcon,
  ShieldAlert, ShieldCheck, Truck, Clock, CreditCard, Download, Eye
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAuthStore, useCartStore, useShopStore } from './store';
import { Product, CartItem, UserRole, Order, User, OrderStatus } from './types';
import { CATEGORIES } from './constants';

// --- Shared UI Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, size = 'md', type = 'button' }: any) => {
  const base = "inline-flex items-center justify-center font-medium transition-all rounded-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants: any = {
    primary: `bg-orange-500 text-white hover:bg-orange-600 shadow-sm`,
    secondary: `bg-green-800 text-white hover:bg-green-900`,
    outline: `border border-gray-200 text-gray-700 hover:bg-gray-50`,
    ghost: `text-gray-600 hover:bg-gray-100`,
    danger: `bg-red-500 text-white hover:bg-red-600`
  };
  const sizes: any = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5",
    lg: "px-8 py-3 text-lg"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const InputField = ({ label, type, value, onChange, placeholder, icon: Icon, rightElement, required = true }: any) => (
  <div className="space-y-2 text-left">
    <div className="flex justify-between items-center">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      {rightElement}
    </div>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
      <input 
        type={type} 
        required={required}
        className={`w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl ${Icon ? 'pl-12' : 'px-4'} py-3 transition-all border outline-none`}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  </div>
);

// --- Charts ---

const RevenueChart = () => {
  const data = [12000, 19000, 15000, 25000, 22000, 30000, 45000, 38000, 42000, 55000, 48000, 62000];
  const max = Math.max(...data);
  const points = data.map((d, i) => `${(i / 11) * 100},${100 - (d / max) * 100}`).join(' ');

  return (
    <div className="w-full h-48 relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <polyline fill="rgba(249, 115, 22, 0.1)" points={`0,100 ${points} 100,100`} />
        <polyline fill="none" stroke="#f97316" strokeWidth="2" points={points} strokeLinecap="round" />
      </svg>
      <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase">
        <span>Jan</span><span>Dec</span>
      </div>
    </div>
  );
};

// --- Main Layout Components ---

const Header = ({ onNavigate, currentPath }: any) => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { settings } = useShopStore();
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <h1 
            onClick={() => onNavigate('home')} 
            className="text-2xl font-black text-orange-600 cursor-pointer flex items-center gap-2 group"
          >
            <div className="p-1.5 bg-orange-600 rounded-lg text-white group-hover:rotate-12 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="hidden sm:inline tracking-tighter">{settings.name}</span>
          </h1>
          
          <div className="hidden lg:flex items-center bg-gray-50 rounded-2xl px-4 py-2 w-96 border border-transparent focus-within:bg-white focus-within:border-orange-500 transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products, brands..." 
              className="bg-transparent border-none focus:ring-0 w-full ml-2 text-sm outline-none font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === 'ADMIN' && (
            <Button variant="ghost" onClick={() => onNavigate('admin')} className="hidden md:flex gap-2 text-orange-600 font-bold">
              <LayoutDashboard className="w-5 h-5" /> Admin
            </Button>
          )}
          
          <button 
            className="relative p-2 hover:bg-gray-50 rounded-xl transition-all group"
            onClick={() => onNavigate('cart')}
          >
            <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          {!user ? (
            <Button size="sm" onClick={() => onNavigate('login')} className="rounded-xl px-6">Login</Button>
          ) : (
            <div className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-2xl">
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-black">
                {user.name[0]}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-black text-gray-900 leading-tight">Hello, {user.name.split(' ')[0]}</div>
                <button onClick={logout} className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest">Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// --- Pages ---

const HomePage = ({ onProductSelect }: { onProductSelect: (p: Product) => void }) => {
  const { products, settings } = useShopStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory, products]);

  return (
    <div className="pb-20 space-y-12">
      <section className="relative h-[450px] bg-green-950 overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-2xl space-y-6 animate-in slide-in-from-left-8 duration-700">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 rounded-full text-xs font-black uppercase tracking-widest">
               <Sparkles className="w-4 h-4" /> Grand Launch Event
            </span>
            <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
              {settings.bannerTitle}
            </h2>
            <p className="text-xl text-gray-300 font-medium">
              {settings.bannerSubtitle}
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" className="px-10 h-16 rounded-2xl font-black text-xl">Shop Now</Button>
              <Button variant="outline" size="lg" className="px-10 h-16 rounded-2xl font-black text-xl bg-white/5 border-white/20 text-white hover:bg-white/10">Browse Flash Deals</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <h3 className="text-3xl font-black tracking-tight">Top Categories</h3>
            <p className="text-gray-500 font-medium mt-1">Discover what's trending right now</p>
          </div>
          <div className="flex gap-3 bg-gray-50 p-2 rounded-2xl overflow-x-auto max-w-full">
            {['All', ...CATEGORIES.map(c => c.name)].map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(p => (
            <div key={p.id} onClick={() => onProductSelect(p)} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group flex flex-col h-full">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {p.discountPrice && (
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-xl text-xs font-black shadow-lg">
                    -{Math.round(((p.price - p.discountPrice) / p.price) * 100)}%
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button className="rounded-full w-12 h-12 p-0"><Eye className="w-6 h-6" /></Button>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">{p.category}</span>
                <h4 className="text-lg font-black text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-2">{p.name}</h4>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(p.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                  <span className="text-xs text-gray-400 font-bold ml-1">({p.numReviews})</span>
                </div>
                <div className="mt-auto flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-black text-gray-900">৳{p.discountPrice || p.price}</div>
                    {p.discountPrice && <div className="text-xs text-gray-400 line-through font-bold">৳{p.price}</div>}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); useCartStore.getState().addItem(p); }}
                    className="w-10 h-10 bg-gray-50 text-orange-600 rounded-xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const CheckoutPage = ({ onComplete }: { onComplete: () => void }) => {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { addOrder } = useShopStore();
  const [method, setMethod] = useState<'COD' | 'SSLCOMMERZ'>('COD');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      const order: Order = {
        id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        userId: user?.id || 'guest',
        userName: user?.name || 'Guest',
        items: [...items],
        totalAmount: total,
        shippingAddress: '123 Dhaka Main Rd, Dhaka 1212',
        paymentMethod: method,
        paymentStatus: 'pending',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      addOrder(order);
      clearCart();
      setLoading(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="space-y-8">
           <h3 className="text-3xl font-black tracking-tight">Checkout</h3>
           
           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
             <h4 className="font-black text-xl flex items-center gap-2">
               <Truck className="w-6 h-6 text-orange-600" /> Shipping Information
             </h4>
             <div className="grid grid-cols-2 gap-4">
               <InputField label="First Name" value={user?.name.split(' ')[0]} placeholder="John" />
               <InputField label="Last Name" value={user?.name.split(' ')[1]} placeholder="Doe" />
             </div>
             <InputField label="Shipping Address" placeholder="Street name, Building No." />
             <InputField label="Phone Number" icon={Phone} placeholder="017XXXXXXXX" />
           </div>

           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
             <h4 className="font-black text-xl flex items-center gap-2">
               <CreditCard className="w-6 h-6 text-orange-600" /> Payment Method
             </h4>
             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => setMethod('COD')}
                 className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${method === 'COD' ? 'border-orange-600 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
               >
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'COD' ? 'border-orange-600' : 'border-gray-300'}`}>
                   {method === 'COD' && <div className="w-3 h-3 bg-orange-600 rounded-full" />}
                 </div>
                 <span className="font-black">Cash on Delivery</span>
               </button>
               <button 
                 onClick={() => setMethod('SSLCOMMERZ')}
                 className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${method === 'SSLCOMMERZ' ? 'border-orange-600 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
               >
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'SSLCOMMERZ' ? 'border-orange-600' : 'border-gray-300'}`}>
                   {method === 'SSLCOMMERZ' && <div className="w-3 h-3 bg-orange-600 rounded-full" />}
                 </div>
                 <span className="font-black">Online Payment</span>
               </button>
             </div>
           </div>
        </div>

        <div className="h-fit sticky top-24">
          <div className="bg-green-950 text-white p-10 rounded-[3rem] shadow-2xl space-y-8">
            <h3 className="text-2xl font-black">Order Summary</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.images[0]} className="w-16 h-16 rounded-2xl object-cover" />
                  <div className="flex-grow">
                    <div className="font-black line-clamp-1">{item.name}</div>
                    <div className="text-xs text-gray-400 font-bold">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-black">৳{(item.discountPrice || item.price) * item.quantity}</div>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-white/10 space-y-4">
               <div className="flex justify-between text-gray-400 font-bold">
                 <span>Subtotal</span>
                 <span>৳{total}</span>
               </div>
               <div className="flex justify-between text-gray-400 font-bold">
                 <span>Delivery Charge</span>
                 <span className="text-green-400">FREE</span>
               </div>
               <div className="flex justify-between text-2xl font-black pt-4">
                 <span>Total</span>
                 <span className="text-orange-500">৳{total}</span>
               </div>
            </div>
            <Button 
              size="lg" 
              className="w-full h-16 rounded-2xl text-lg font-black" 
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place ${method === 'COD' ? 'Order' : 'and Pay'}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { products, deleteProduct, orders, users, updateOrderStatus, updateUser } = useShopStore();
  const [activeTab, setActiveTab] = useState('overview');

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 p-6 space-y-2 flex-shrink-0">
        <div className="px-4 py-6 mb-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Administrator</h3>
          <div className="font-black text-lg">Control Panel</div>
        </div>
        {[
          { id: 'overview', label: 'Dashboard', icon: BarChart3 },
          { id: 'products', label: 'Inventory', icon: Package },
          { id: 'orders', label: 'Sales Feed', icon: ShoppingBag },
          { id: 'users', label: 'Customers', icon: Users },
          { id: 'settings', label: 'Store Config', icon: Settings }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-black text-sm ${activeTab === item.id ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <item.icon className="w-5 h-5" /> {item.label}
          </button>
        ))}
      </aside>

      <main className="flex-grow p-4 md:p-10 space-y-10 overflow-x-hidden">
        {activeTab === 'overview' && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                 <div className="text-gray-400 font-bold text-xs uppercase mb-1">Total Revenue</div>
                 <div className="text-3xl font-black">৳{totalRevenue.toLocaleString()}</div>
                 <div className="mt-2 flex items-center gap-1 text-green-500 text-xs font-black"><TrendingUp className="w-3 h-3" /> +14.2%</div>
               </div>
               <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                 <div className="text-gray-400 font-bold text-xs uppercase mb-1">Live Orders</div>
                 <div className="text-3xl font-black">{orders.length}</div>
                 <div className="mt-2 text-orange-500 text-xs font-black">{orders.filter(o => o.status === 'pending').length} Needs Action</div>
               </div>
               <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                 <div className="text-gray-400 font-bold text-xs uppercase mb-1">Happy Customers</div>
                 <div className="text-3xl font-black">{users.length}</div>
                 <div className="mt-2 text-blue-500 text-xs font-black">2 New Today</div>
               </div>
               <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                 <div className="text-gray-400 font-bold text-xs uppercase mb-1">Store Health</div>
                 <div className="text-3xl font-black">98.4%</div>
                 <div className="mt-2 text-green-500 text-xs font-black">Stable</div>
               </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black mb-6">Recent Sales Activity</h3>
                <RevenueChart />
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                <h3 className="text-xl font-black mb-6">Top Performing Regions</h3>
                <div className="space-y-6 flex-grow">
                  {[
                    { n: 'Dhaka', v: 72 }, { n: 'Chittagong', v: 45 }, { n: 'Sylhet', v: 22 }
                  ].map(r => (
                    <div key={r.n} className="space-y-2">
                       <div className="flex justify-between text-xs font-black text-gray-400 uppercase"><span>{r.n}</span><span>{r.v}%</span></div>
                       <div className="h-2 bg-gray-50 rounded-full"><div className="h-full bg-orange-600 rounded-full" style={{width: `${r.v}%`}}></div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black">Order Feed</h3>
                <div className="text-xs font-black text-gray-400 uppercase">{orders.length} Total Records</div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                    <tr>
                      <th className="px-8 py-6">Reference</th>
                      <th className="px-8 py-6">Customer</th>
                      <th className="px-8 py-6">Total</th>
                      <th className="px-8 py-6">Payment</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/50 transition-all">
                        <td className="px-8 py-6 font-black text-sm text-gray-900">{o.id}</td>
                        <td className="px-8 py-6">
                           <div className="font-bold text-gray-900">{o.userName}</div>
                           <div className="text-[10px] text-gray-400 uppercase font-bold">{new Date(o.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-8 py-6 font-black text-gray-900">৳{o.totalAmount}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                           <select 
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                            className="bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-black uppercase text-gray-600 outline-none focus:ring-2 focus:ring-orange-600 cursor-pointer"
                           >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                           </select>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="p-3 text-gray-400 hover:text-orange-600 transition-colors"><Eye className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black">Customer Base</h3>
                <Button size="sm" variant="outline" className="font-black rounded-xl border-gray-200">Export User List</Button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                    <tr>
                      <th className="px-8 py-6">User</th>
                      <th className="px-8 py-6">Role</th>
                      <th className="px-8 py-6">Joined</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-all">
                        <td className="px-8 py-6 flex items-center gap-4">
                           <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-black">{u.name[0]}</div>
                           <div>
                              <div className="font-black text-gray-900">{u.name}</div>
                              <div className="text-xs text-gray-400 font-bold">{u.email}</div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                             {u.role}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-xs text-gray-400 font-bold">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                             {u.isBlocked ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <ShieldCheck className="w-4 h-4 text-green-500" />}
                             <span className={`text-[10px] font-black uppercase tracking-widest ${u.isBlocked ? 'text-red-500' : 'text-green-500'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button 
                            onClick={() => updateUser({ ...u, isBlocked: !u.isBlocked })}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${u.isBlocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                           >
                             {u.isBlocked ? 'Unblock' : 'Block'}
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- App Root ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { user, setUser } = useAuthStore();

  const handleLogin = (userData: any) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const navigateToProduct = (p: Product) => {
    setSelectedProduct(p);
    setCurrentPage('product');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onProductSelect={navigateToProduct} />;
      case 'product': return selectedProduct ? <div className="p-20 text-center font-black text-gray-300">Product View Under Construction...</div> : null;
      case 'cart': return <CheckoutPage onComplete={() => setCurrentPage('home')} />;
      case 'login': return <div className="p-20 text-center">Login Mock View... Use Admin Header link.</div>;
      case 'admin': return <AdminDashboard />;
      default: return <HomePage onProductSelect={navigateToProduct} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-medium">
      <Header onNavigate={setCurrentPage} currentPath={currentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <footer className="bg-green-950 text-gray-400 py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <div className="p-1 bg-orange-600 rounded text-white"><ShoppingBag className="w-6 h-6" /></div>
              ShuchonaMart
            </h1>
            <p className="text-sm leading-relaxed text-gray-500">The largest online store in Bangladesh, providing high quality goods and exceptional customer service since 2024.</p>
          </div>
          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Flash Sales</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">New Arrivals</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">Policy</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Shipping & Refund</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
            <p className="text-xs mb-4 font-bold">Get updates on latest brand-new products.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Email" className="bg-white/5 border-none rounded-xl px-4 flex-grow text-sm outline-none focus:ring-1 focus:ring-orange-600" />
              <Button size="sm">Join</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
