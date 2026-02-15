# ShuchonaMart - Full Stack E-Commerce Platform

ShuchonaMart is a production-ready, full-stack e-commerce platform with customer shopping, admin management, secure checkout flows, and SEO-friendly, mobile-first UI. It includes a React + Vite frontend and a Node.js + Express + MongoDB backend with JWT authentication.

## ✨ Features

### Customer
- Registration, login, email verification, password reset
- Product browsing with categories, search, and pagination
- Product details, reviews, stock status
- Cart management with persistent state
- Checkout with shipping details and payment method (COD/SSLCommerz)
- Order history and tracking

### Admin
- Admin dashboard with analytics
- Product & category CRUD
- Order management & status updates
- User management & blocking
- Coupon creation & application

### Security & Performance
- JWT authentication with role-based access control
- Password hashing with bcrypt
- Rate limiting, XSS & NoSQL injection protection
- Helmet security headers
- Indexed MongoDB collections for fast search

## 🧱 Project Structure

```
.
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── seed
│   └── server.ts
├── index.tsx (frontend app entry)
├── constants.tsx
├── store.ts
├── types.ts
└── ...
```

## ✅ Requirements
- Node.js 18+
- MongoDB (local or Atlas)

## 🔐 Environment Variables

Create `.env` in the root:

```
MONGO_URI=mongodb://localhost:27017/shuchonamart
JWT_SECRET=replace_with_secure_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

An example is available at `.env.example`.

## 🚀 Getting Started

Install dependencies:

```
npm install
```

### Start frontend (Vite)
```
npm run dev
```

### Start backend (Express)
```
npm run dev:server
```

### Seed database (optional)
```
npm run seed
```

## 🧪 API Overview

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/verify/:token
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Products & Categories
```
GET  /api/products
GET  /api/products/:id
POST /api/products (admin)
PUT  /api/products/:id (admin)
DELETE /api/products/:id (admin)

GET  /api/categories
POST /api/categories (admin)
PUT  /api/categories/:id (admin)
DELETE /api/categories/:id (admin)
```

### Orders & Coupons
```
POST /api/orders
GET  /api/orders/myorders
GET  /api/orders/:id
PUT  /api/orders/:id/pay
PUT  /api/orders/:id/status (admin)

POST /api/coupons/apply
GET  /api/coupons (admin)
POST /api/coupons (admin)
PUT  /api/coupons/:id (admin)
```

## 🧑‍💻 Notes
- Email delivery is logged to the console in development.
- All admin routes require `ADMIN` role in JWT payload.

---
**Built for production** with scalability and clean architecture in mind.
