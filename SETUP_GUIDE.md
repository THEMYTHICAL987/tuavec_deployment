# Tu Avec E-Commerce Platform - Complete Setup Guide

Welcome to Tu Avec! This is a complete production-ready e-commerce platform for selling Thai products to Bangladesh.

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Payment Gateway Setup](#payment-gateway-setup)
5. [Email Configuration](#email-configuration)
6. [Running the Application](#running-the-application)
7. [Deployment](#deployment)
8. [Features Overview](#features-overview)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 14
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email notifications)

### Installation (5 minutes)

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Edit .env with your configuration
nano .env  # or open in VS Code

# 5. Start the server
npm start
```

For frontend, open `frontend/index.html` in your browser or use Live Server.

---

## ⚙️ Environment Setup

### 1. Copy `.env.example` to `.env`
```bash
cp backend/.env.example backend/.env
```

### 2. Fill in Essential Variables

#### Database
```env
MONGODB_URI=mongodb://localhost:27017/tuavec
# OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tuavec?retryWrites=true&w=majority
```

#### JWT Security
```env
JWT_SECRET=generate-a-secure-random-string-here
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Server URLs
```env
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

---

## 🗄️ Database Setup

### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb
# Windows: Download from mongodb.com

# Start MongoDB
mongod
```

### Option B: MongoDB Atlas (Recommended for Production)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (M0 free tier)
4. Get connection string
5. Add to `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster...`

### Option C: Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## 💳 Payment Gateway Setup

### SSLCommerz (Primary Payment Gateway)

#### For Testing (Sandbox)
```env
SSLCOMMERZ_STORE_ID=tuavec
SSLCOMMERZ_STORE_PASSWORD=test-password
NODE_ENV=development
```

#### For Production
1. Go to [sslcommerz.com](https://sslcommerz.com)
2. Register merchant account
3. Get Store ID and Store Password
4. Update `.env`:
```env
SSLCOMMERZ_STORE_ID=your-actual-store-id
SSLCOMMERZ_STORE_PASSWORD=your-actual-password
NODE_ENV=production
```

### Optional: bKash Integration
```env
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh
BKASH_APP_KEY=your_app_key
BKASH_APP_SECRET=your_app_secret
BKASH_USERNAME=your_username
BKASH_PASSWORD=your_password
BKASH_SANDBOX=true
```

---

## 📧 Email Configuration (Gmail)

### Steps to Enable Gmail App Password

1. **Enable 2-Factor Authentication**
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Click "2-Step Verification"
   - Follow the setup

2. **Generate App Password**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer" (or your device)
   - Click "Generate"
   - Copy the 16-character password

3. **Add to .env**
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
ADMIN_EMAIL=admin@tuavec.com
```

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend**
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

**Terminal 2 - Frontend (VS Code)**
- Right-click `frontend/index.html`
- Select "Open with Live Server"

Or use Python:
```bash
cd frontend
python -m http.server 3000
```

### Seed Sample Products
```bash
cd backend
node seed-products.js
```

This adds 10 sample Thai products to your database for testing.

---

## 🌐 Accessing Your Store

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Shop | http://localhost:3000/shop.html |
| Cart | http://localhost:3000/cart.html |
| Checkout | http://localhost:3000/checkout.html |
| Admin | http://localhost:3000/admin-dashboard.html |
| API | http://localhost:5000/api |

---

## 📦 API Endpoints

### Products
```
GET  /api/products                    - List all products
GET  /api/products?category=...       - Filter by category
GET  /api/products/meta/categories    - Get all categories
```

### Orders
```
POST /api/orders                      - Create order
GET  /api/orders/:orderId/status      - Check order status
```

### Payment
```
POST /api/payment/initialize          - Initialize payment
POST /api/payment/success             - Payment success callback
GET  /api/payment/status/:orderId     - Check payment status
```

### Authentication
```
POST /api/auth/send-otp               - Send OTP
POST /api/auth/verify-otp             - Verify OTP
POST /api/auth/signup                 - Register user
POST /api/auth/login                  - Login user
```

---

## 🚀 Deployment

### Deploy Backend

#### Option 1: Render (Recommended - Free)
1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create Web Service from `backend` folder
4. Set environment variables in dashboard
5. Deploy!

#### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub
4. Deploy backend folder
5. Set environment variables

#### Option 3: Heroku
```bash
# Install Heroku CLI
heroku login
heroku create tuavec-backend
git push heroku main
```

### Deploy Frontend

#### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
cd frontend
vercel
```

#### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub
3. Deploy `frontend` folder

#### Option 3: GitHub Pages
```bash
# Add to package.json
"deploy": "cd frontend && git subtree push --prefix frontend origin gh-pages"

npm run deploy
```

### Environment Variables for Production
```env
NODE_ENV=production
BACKEND_URL=https://your-backend.com
FRONTEND_URL=https://your-frontend.com
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secure-random-string
SSLCOMMERZ_STORE_ID=production-id
SSLCOMMERZ_STORE_PASSWORD=production-password
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

---

## ✨ Features Overview

### 🛍️ Shopping
- ✅ Product catalog with search & filters
- ✅ Product details page
- ✅ Shopping cart with local storage
- ✅ Add/remove items functionality
- ✅ Inventory tracking

### 💳 Checkout
- ✅ Multi-step checkout process
- ✅ Shipping address collection
- ✅ Multiple payment methods (Card, bKash, COD)
- ✅ Order summary
- ✅ Trust signals (SSL, guarantees, security)

### 💰 Payment
- ✅ SSLCommerz integration (production-ready)
- ✅ bKash integration (optional)
- ✅ Cash on Delivery option
- ✅ Payment verification & IPN handling
- ✅ Automatic stock management

### 📧 Notifications
- ✅ Email confirmations (customer & admin)
- ✅ Order status emails
- ✅ SMS notifications (Twilio)
- ✅ Detailed order tracking

### 👨‍💼 Admin
- ✅ Dashboard with key metrics
- ✅ Order management
- ✅ Product inventory management
- ✅ Customer list
- ✅ Analytics overview

### 🔐 Security
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ SSL/TLS ready

---

## 📱 Mobile Optimization
- ✅ Responsive design
- ✅ Mobile-first approach
- ✅ Touch-friendly buttons
- ✅ Fast loading
- ✅ PWA ready

---

## 🎯 Essential Products to Sell

Based on profit margin and courier-friendliness:

1. **Electronics Accessories** (200-400% margin)
   - Phone cases, screen protectors
   - USB-C cables and chargers
   - Power banks

2. **Beauty & Skincare** (180-350% margin)
   - Thai beauty brands (Mistine, Ponds)
   - Face masks and creams
   - Body lotions

3. **Coffee & Tea** (150-300% margin)
   - Premium Thai coffee
   - Herbal teas
   - Specialty blends

4. **Textiles** (150-250% margin)
   - Thai silk scarves
   - Cotton clothing
   - Handwoven textiles

5. **Home Decor** (150-200% margin)
   - Ceramic items
   - Bamboo crafts
   - Wall decorations

---

## 📊 Pricing Strategy

- **Product cost**: Your Thailand supplier price
- **Markup**: 150-400% depending on category
- **Shipping**: 80-150৳ (absorb for orders >2000৳)
- **Profit margin**: 30-50% after expenses

Example:
- Cost: 200৳
- Sell price: 450৳ (225% markup)
- Shipping: 80৳
- Profit: 170৳ (after logistics, packaging, platform fees)

---

## 🎨 Customization

### Change Branding
1. Edit `frontend/index.html` - logo and colors
2. Update `backend/.env` - business name
3. Add your logo files to `frontend/`

### Change Colors
Edit CSS variables in HTML files:
```css
--rose-gold: #b76e79;
--gold: #d4af37;
--success: #4caf50;
```

### Add Your Products
```bash
cd backend
# Edit seed-products.js with your products
node seed-products.js
```

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
mongod --version  # Test if installed
# Start MongoDB (macOS)
brew services start mongodb-community
# Or use MongoDB Atlas instead (cloud-based)
```

### "Email not sending"
1. Check Gmail settings
2. Verify app password is correct
3. Enable "Less secure apps" or use App Password
4. Check spam folder
5. Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env`

### "Payment gateway not working"
1. Verify store credentials in `.env`
2. Check if SSLCommerz API is reachable
3. For testing, ensure `NODE_ENV=development`
4. Verify callback URLs in `.env`

### "Products not showing"
```bash
# Seed products
cd backend
node seed-products.js

# Or verify database
mongo
> use tuavec
> db.products.find().count()
```

### "CORS errors"
```env
# Update .env CORS_ORIGINS
CORS_ORIGINS=http://localhost:3000,http://localhost:5500
```

---

## 📞 Support & Next Steps

### Immediate Actions
1. ✅ Set up `.env` file
2. ✅ Connect MongoDB
3. ✅ Configure Gmail
4. ✅ Run `npm install && npm start`
5. ✅ Seed sample products

### Within 1 Week
1. Update product catalog (20-50 products)
2. Set up payment gateway (SSLCommerz)
3. Configure shipping costs by region
4. Create FAQ/Help pages

### Launch Preparation
1. Get `.com` domain (Namecheap ~$9/year)
2. Deploy to production (Render/Railway)
3. Set up email newsletters
4. Create social media pages
5. Run first ad campaign ($50)

### Long-term Growth
1. Customer reviews system
2. Loyalty program
3. Wishlist functionality
4. Mobile app
5. International shipping

---

## 📚 Resources

- [MongoDB Docs](https://docs.mongodb.com)
- [Express.js Docs](https://expressjs.com)
- [SSLCommerz API](https://sslcommerz.com/developing)
- [bKash API](https://www.bkash.com/api)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 💡 Quick Tips

1. **Use MongoDB Atlas** for easier setup (free tier = 512MB)
2. **Test with sandbox** credentials first before going live
3. **Monitor email logs** to ensure notifications are sending
4. **Keep `.env` secure** - never commit to GitHub
5. **Back up database** regularly
6. **Use HTTPS** in production (Render/Railway provides free SSL)
7. **Monitor error logs** for issues
8. **Test all payment methods** before launch

---

## ✅ Launch Checklist

- [ ] Environment variables configured
- [ ] Database connected and tested
- [ ] Sample products seeded
- [ ] Email notifications tested
- [ ] Payment gateway working
- [ ] Frontend pages loaded
- [ ] Shopping cart functional
- [ ] Checkout process works
- [ ] Admin dashboard accessible
- [ ] Mobile responsive tested
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Domain connected
- [ ] SSL certificate active

---

**Congratulations! You're ready to launch Tu Avec! 🎉**

For questions or issues, check the troubleshooting section or review the API documentation.

Happy selling! 🚀
