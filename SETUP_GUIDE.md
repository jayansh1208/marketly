# 🎉 Setup Complete!

Your full-stack e-commerce application is ready. Follow these steps to get started:

## 📦 Step 1: Database Setup (Choose One)

### Option A: MongoDB Atlas (Recommended - 100% FREE)

**MongoDB Atlas M0 FREE Tier:**
- ✅ 512 MB storage (FREE forever)
- ✅ No credit card required
- ✅ Perfect for development and portfolio projects

**Setup Steps:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a FREE account (no credit card needed)
3. Click "Build a Database"
4. **Select "M0 FREE" tier** (NOT the paid tiers)
5. Choose a cloud provider (AWS/Google/Azure - all free)
6. Choose a region close to you
7. Click "Create Cluster" (takes 3-5 minutes)
8. Create a database user:
   - Click "Database Access" → "Add New Database User"
   - Set username and password (save these!)
9. Whitelist your IP:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
10. Get connection string:
    - Click "Database" → "Connect" → "Connect your application"
    - Copy the connection string
    - Replace `<password>` with your database password

### Option B: Railway PostgreSQL (FREE Alternative)

If you prefer PostgreSQL or want an alternative:
1. Go to https://railway.app
2. Sign up with GitHub (FREE $5/month credit)
3. Create new project → Add PostgreSQL
4. Copy the connection URL
5. **Note:** You'll need to change the backend to use PostgreSQL instead of MongoDB

### Option C: Local MongoDB (FREE - No Internet Required)

For completely offline development:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install and run MongoDB locally
3. Use connection string: `mongodb://localhost:27017/ecommerce`
4. **Note:** Database won't persist if you deploy to cloud

**Recommended:** Use **MongoDB Atlas M0 FREE tier** - it's cloud-based, always accessible, and perfect for your project!

## 💳 Step 2: Stripe Setup

1. Go to https://dashboard.stripe.com/register
2. Create a FREE account
3. Toggle to "Test mode" (top right corner)
4. Go to Developers → API keys
5. Copy both "Publishable key" (pk_test_...) and "Secret key" (sk_test_...)

## ⚙️ Step 3: Configure Environment Variables

### Backend (.env in server folder)
Create `server/.env` file:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=any_random_secret_string_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_optional
```

### Frontend (.env in client folder)
Create `client/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 🚀 Step 4: Run the Application

### Terminal 1 - Backend
```bash
cd server
npm run seed    # Seed database with sample data
npm run dev     # Start backend server
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev     # Start frontend server
```

## 🔑 Step 5: Login Credentials

After seeding the database, use these accounts:

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**User Account:**
- Email: user@example.com
- Password: user123

## 💳 Test Credit Cards (Stripe Test Mode)

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC

## ✅ What's Included

✨ **User Features:**
- Registration & Login
- Product browsing with search/filter/sort
- Shopping cart (persists in database)
- Stripe checkout
- Order history

✨ **Admin Features:**
- Product management (Add/Edit/Delete)
- Order management
- Status updates

## 📱 Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

## 🎯 Next Steps

1. Browse products as a user
2. Add items to cart
3. Complete checkout with test card
4. Login as admin to manage products/orders
5. Customize the design and add more features!

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Verify connection string is correct
- Check if IP is whitelisted in MongoDB Atlas

**Stripe Payment Error:**
- Ensure you're using TEST mode keys
- Verify publishable key matches secret key

**CORS Error:**
- Check CLIENT_URL in backend .env matches frontend URL

---

**Need help?** Check the README.md for detailed documentation!
