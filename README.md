# 🛍️ Marketly - Premium E-Commerce Platform

A modern, full-stack e-commerce application built with React, Node.js, Express, and MongoDB. Marketly offers a seamless shopping experience with real-time cart updates, secure payments, and an intuitive admin panel.

## ✨ Features

### User Features
- ✅ User registration and login with JWT authentication
- ✅ Browse products with search, filter, and sort
- ✅ Product details with stock availability
- ✅ Shopping cart (database-backed, persists across sessions)
- ✅ Secure checkout with Stripe payment integration
- ✅ Order history and tracking
- ✅ User profile management

### Admin Features
- ✅ Admin dashboard
- ✅ Product management (Create, Read, Update, Delete)
- ✅ Order management with status updates
- ✅ View all orders and customers

### Technical Features
- ✅ RESTful API architecture
- ✅ JWT-based authentication with httpOnly cookies
- ✅ Role-based access control (User/Admin)
- ✅ Input validation and error handling
- ✅ Responsive design (mobile + desktop)
- ✅ Real-time cart updates
- ✅ Automatic stock management
- ✅ Stripe test mode integration

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS
- React Router v6
- Axios
- React Hot Toast
- Stripe React SDK

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Stripe for payments
- Express Validator

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier)
- Stripe account (test mode)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd c:\\Users\\HP\\Desktop\\Projects\\onlineStore
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd server
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB Atlas Connection
MONGO_URI=your_mongodb_connection_string_here

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Stripe Keys (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Paste into `MONGO_URI` in `.env`

#### Stripe Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Create a free account
3. Toggle to "Test mode" (top right)
4. Go to Developers → API keys
5. Copy "Publishable key" and "Secret key"
6. Paste into `.env` file

#### Seed Database
```bash
npm run seed
```

This creates:
- **Admin account:** admin@example.com / admin123
- **User account:** user@example.com / user123
- **12 sample products**

#### Start Backend Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../client
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

#### Start Frontend Server
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🧪 Testing

### Test Accounts
- **Admin:** admin@example.com / admin123
- **User:** user@example.com / user123

### Test Credit Cards (Stripe Test Mode)
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Insufficient funds:** 4000 0000 0000 9995
- Use any future expiry date and any 3-digit CVC

## 📱 Usage Guide

### For Users
1. **Register/Login** - Create account or login
2. **Browse Products** - View all products, search, filter by category/price
3. **Add to Cart** - Select products and quantities
4. **Checkout** - Enter shipping address and pay with Stripe
5. **View Orders** - Check order history and status

### For Admins
1. **Login** with admin account
2. **Admin Dashboard** - View statistics
3. **Manage Products** - Add, edit, delete products
4. **Manage Orders** - Update order status (Processing → Shipped → Delivered)

## 📁 Project Structure

```
onlineStore/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth, Cart)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
└── server/                # Node.js backend
    ├── config/            # Database configuration
    ├── controllers/       # Business logic
    ├── middleware/        # Auth, validation, errors
    ├── models/            # Mongoose schemas
    ├── routes/            # API routes
    ├── utils/             # Seed script
    ├── .env               # Environment variables
    ├── server.js          # Entry point
    └── package.json
```

## 🔒 Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens stored in httpOnly cookies
- Protected API routes with authentication middleware
- Admin-only routes with role-based access control
- Input validation on all endpoints
- CORS configuration
- Secure Stripe payment handling

## 🚢 Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Add environment variables
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Deploy

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payment
- `POST /api/payment/create-payment-intent` - Create Stripe payment

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string is correct
- Check if IP address is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions

### Stripe Payment Issues
- Verify you're using test mode keys
- Check if publishable key matches secret key
- Use test card numbers only

### CORS Errors
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `server.js`

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built as a portfolio project demonstrating full-stack development skills.

## 🙏 Acknowledgments

- Stripe for payment processing
- MongoDB Atlas for database hosting
- Unsplash for product images
