# ShuchonaMart — Premium Bangladeshi E-Commerce Platform

ShuchonaMart is a modern, production-ready e-commerce experience with a clean UI, robust admin tools, and a secure API layer. The frontend delivers a responsive, mobile-first shopping experience, while the backend provides a scalable REST API with JWT auth, rate limiting, and MongoDB persistence.

## ✨ Key Features

### Customer Experience
- Authentication with email verification & password reset
- Product discovery with search, filters, and sorting
- Rich product detail pages with reviews
- Persistent cart (localStorage via Zustand)
- Checkout flow with cash on delivery or SSLCommerz-ready payment option
- Order history & profile management

### Admin Experience
- Role-based access with protected admin routes
- Analytics dashboard endpoints
- Product, category, user, and order management
- Global site settings control

### Platform & Security
- JWT-based authentication
- Password hashing via bcrypt
- Rate limiting, Helmet, XSS sanitization, and MongoDB injection protection
- SEO-friendly HTML metadata
- Structured folder architecture

## 📂 Project Structure

```
.
├── server
│   ├── controllers
│   ├── data
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── seed.ts
│   └── server.ts
├── index.html
├── index.tsx
├── store.ts
├── types.ts
└── constants.tsx
```

## ✅ Requirements
- Node.js 18+
- MongoDB running locally or via MongoDB Atlas

## 🔐 Environment Variables
Create a `.env` file at the project root (or copy `.env.example`).

```
MONGO_URI=mongodb://localhost:27017/shuchonamart
JWT_SECRET=your_long_random_secret
NODE_ENV=development
```

## 🚀 Running the Project

### 1) Install dependencies
```
npm install
```

### 2) Start the API server
```
npm run dev:server
```

### 3) Seed the database (optional)
```
npm run seed
```

### 4) Start the frontend
```
npm run dev
```

Frontend runs on `http://localhost:5173`, API runs on `http://localhost:5000` by default.

## 🔌 API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-email`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Products & Categories
- `GET /api/products` (supports `keyword`, `category`, `minPrice`, `maxPrice`, `rating`, `sort`, `pageNumber`)
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `GET /api/categories`
- `POST /api/categories` (admin)
- `PUT /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

### Orders
- `POST /api/orders` (auth)
- `GET /api/orders/myorders` (auth)
- `GET /api/orders/:id` (auth)
- `PUT /api/orders/:id/pay` (auth)
- `PUT /api/orders/:id/status` (admin)

### Admin
- `GET /api/admin/dashboard` (admin)
- `GET /api/admin/users` (admin)
- `PUT /api/admin/users/:id` (admin)

### Site Settings
- `GET /api/settings`
- `PUT /api/settings` (admin)

## 🧪 Sample Accounts
Seeded users:
- **Admin**: `admin@shuchonamart.com` / `Admin123!`
- **Customer**: `kabir@test.com` / `Customer123!`

## 🧰 Tech Stack
**Frontend:** React, Tailwind (CDN), Zustand

**Backend:** Node.js, Express, MongoDB, JWT

---

If you want additional integrations (Stripe, SSLCommerz, automated emails), hook them into the `authController` and `orderController` where token generation and payment status updates are handled.
