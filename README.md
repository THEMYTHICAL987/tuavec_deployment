# 🛍️ Tu Avec - Premium Thai Products E-Commerce Platform

Complete e-commerce solution for selling Thai products to Bangladesh with production-ready deployment on **Netlify** (frontend) and **Render.com** (backend).

---

## 📑 Table of Contents

- [Quick Overview](#-quick-overview)
- [Deployment Status](#-deployment-status)
- [What's Been Done](#-whats-been-done)
- [Setup Instructions](#-setup-instructions)
- [Testing with Netlify](#-testing-with-netlify)
- [How to Update Your Website](#-how-to-update-your-website)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Quick Overview

**Tu Avec** is a full-stack e-commerce platform built with:

| Layer | Technology | Hosted On |
|-------|-----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) | Netlify |
| **Backend** | Node.js + Express | Render.com |
| **Database** | MongoDB Atlas | Cloud |
| **CDN** | Google Fonts, CDN JS | Global |

**✅ Fully functional as Daraz/Amazon-like platform** (once fully configured)

---

## 📊 Deployment Status

| Component | Status | Location |
|-----------|--------|----------|
| Backend API | ✅ Ready | Render.com |
| Frontend UI | ✅ Ready | Netlify |
| MongoDB | ✅ Your Account | MongoDB Atlas |
| Domain | ⏳ Optional | .com domain or netlify.app |
| Payment Gateway | ⚠️ Needs Config | bKash (routes exist) |
| Admin Panel | ⏳ Not Yet | Future enhancement |

---

## ✨ What's Been Done

### 1. **Backend Architecture** (Node.js/Express)
- ✅ RESTful API with complete route structure
- ✅ CORS configured for Netlify, Render, localhost, and custom domains
- ✅ MongoDB integration with Mongoose ODM
- ✅ User authentication (JWT-based)
- ✅ Product management routes
- ✅ Order & logistics tracking
- ✅ Payment integration setup (bKash)
- ✅ Error handling & health checks
- ✅ Environment variables support (.env)

### 2. **Frontend** (shop.html)
- ✅ Modern, responsive design (dark theme with rose-gold accents)
- ✅ Product grid with filtering & sorting
- ✅ Search functionality
- ✅ Shopping cart (localStorage)
- ✅ Wishlist support
- ✅ Dynamic product loading from API
- ✅ Mobile-optimized layout
- ✅ User-friendly navigation

### 3. **Database Schema** (MongoDB)
- ✅ Product model with images, pricing, stock
- ✅ User authentication model
- ✅ Order tracking model
- ✅ Review & rating system

### 4. **Security & Performance**
- ✅ CORS protection
- ✅ Input validation
- ✅ JWT authentication
- ✅ Helmet.js headers
- ✅ Compression enabled
- ✅ Rate limiting ready

---

## 🚀 Setup Instructions

### Prerequisites
- MongoDB Atlas account (free M0 tier available)
- Render.com account (free tier available)
- Netlify account (free tier available)
- Git (for easy deployment)
- Node.js 14+ (for local testing)

### Step 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up (free)
   - Create organization & project

2. **Create Cluster**
   - Click "Create Database"
   - Select **M0 Free** tier
   - Choose region closest to Bangladesh/Thailand
   - Click "Create"

3. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Drivers" → Node.js
   - Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/tuavec?retryWrites=true&w=majority`
   - Replace `<password>` with your database user password

4. **Whitelist IP**
   - In Security → Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (or specific IPs)

### Step 2: Backend Deployment (Render.com)

1. **Push Code to GitHub**
   ```bash
   # In your tuavec folder
   git init
   git add .
   git commit -m "Tu Avec e-commerce platform"
   git remote add origin https://github.com/YOUR_USERNAME/tuavec.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `backend` folder as root directory
   - Fill in settings:

   ```
   Name: tuavec-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Add Environment Variables** (in Render dashboard)
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/tuavec?retryWrites=true&w=majority
   JWT_SECRET = (generate random string)
   NODE_ENV = production
   ```
   
   To generate JWT_SECRET, run in terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Copy your backend URL: `https://tuavec-backend.onrender.com`

### Step 3: Frontend Deployment (Netlify)

1. **Update API_URL in shop.html**
   
   In `frontend/shop.html`, find line ~689:
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   ```
   
   Replace with your Render backend URL:
   ```javascript
   const API_URL = 'https://tuavec-backend.onrender.com/api';
   ```

2. **Deploy to Netlify**
   
   **Option A: Drag & Drop (Quickest)**
   - Go to [netlify.com](https://netlify.com)
   - Sign in
   - Drag the `frontend` folder onto the Netlify dashboard
   - Wait for deployment ✅

   **Option B: GitHub Auto-Deploy**
   - Push frontend folder to GitHub
   - Go to Netlify → "Sites"
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub → Select repository
   - Set publish directory: `frontend`
   - Deploy

3. **Your Frontend URL**
   - Netlify generates: `https://your-site-name.netlify.app`
   - Each new push auto-deploys

---

## 🧪 Testing with Netlify

### Immediate Testing (No Setup Needed)

1. **Go to your Netlify frontend**: `https://your-site-name.netlify.app`
2. **Check backend connectivity**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Refresh page
   - Look for `/api/products/meta/categories` request
   - Status should be `200 OK`

3. **Add products to MongoDB**
   ```bash
   # In backend folder on your local machine
   cd backend
   npm install
   node seed-products.js
   ```

4. **See products live on Netlify site** ✅

### Feature Testing

| Feature | Test Method | Expected |
|---------|------------|----------|
| **Load Products** | Visit shop page | Products from MongoDB appear |
| **Add to Cart** | Click "Add to Cart" | Item appears in cart |
| **Search** | Use search box | Filters products by name |
| **Filter by Category** | Use sidebar filters | Shows only selected category |
| **Sort Products** | Use sort dropdown | Reorders grid (price, newest, etc.) |
| **Wishlist** | Click heart icon | Saved to localStorage |
| **Mobile View** | Resize to 375px width | Responsive layout works |

---

## 📝 How to Update Your Website

### 🔄 Updating Products

#### Method 1: MongoDB Atlas Dashboard (Easiest)

1. Go to [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Click your cluster → "Collections"
3. Select `tuavec` database → `products` collection
4. Click "+ Insert Document"
5. Add product data:
   ```json
   {
     "name": "Thai Mango Rice",
     "category": "Rice & Grains",
     "price": 2500,
     "originalPrice": 3000,
     "description": "Premium Thai rice",
     "image": "https://cdn-image-url.com/mango-rice.jpg",
     "stock": 50,
     "rating": 4.5,
     "reviews": 12
   }
   ```

#### Method 2: API Request (Advanced)

```bash
curl -X POST https://tuavec-backend.onrender.com/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Thai Coconut Milk",
    "category": "Beverages",
    "price": 1500,
    "stock": 100,
    "image": "https://cdn-url.com/coconut.jpg"
  }'
```

#### Method 3: Seed Script (Bulk Upload)

```bash
# Edit backend/seed-products.js with your products
# Then run:
cd backend
node seed-products.js
```

### 🎨 Updating Website Design

1. **Edit frontend/shop.html**
   - Colors: Search for `--rose-gold`, `--chocolate`, `--gold` in `:root`
   - Layout: Modify grid sizes (e.g., `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))`)
   - Copy/text: Find and update directly in HTML

2. **Deploy automatically**
   ```bash
   git add frontend/shop.html
   git commit -m "Update design"
   git push
   # Netlify auto-deploys in ~1 minute
   ```

3. **Or manually update on Netlify**
   - Go to Netlify → Your site
   - Click "Deploy new site"
   - Drag updated `frontend` folder

### 🛠️ Updating Backend Logic

1. **Make changes in backend files**
   ```bash
   # Edit any backend file (routes, models, etc.)
   # For example: backend/routes/products.js
   ```

2. **Test locally** (if needed)
   ```bash
   cd backend
   npm start
   # Visit http://localhost:5000/api/products
   ```

3. **Push to GitHub & Render auto-deploys**
   ```bash
   git add backend/
   git commit -m "Fix product API"
   git push
   # Render redeploys in ~2-3 minutes
   ```

### 🌐 Updating Custom Domain (Optional)

**If you buy tuavec.com:**

1. Update DNS records to point to Netlify
   - Domain registrar: Add these records
     ```
     CNAME: www → your-site.netlify.app
     CNAME: @ → your-site.netlify.app
     ```

2. Update Netlify custom domain
   - Go to Netlify → Domain settings
   - Add custom domain: `tuavec.com`

3. Update backend CORS (in backend/server.js)
   ```javascript
   const allowedOrigins = [
       // ... existing entries ...
       'https://tuavec.com',
       'https://www.tuavec.com',
   ];
   ```

4. Redeploy backend
   ```bash
   git push
   ```

---

## 📡 API Endpoints

All endpoints are prefixed with: `https://tuavec-backend.onrender.com/api`

### Products
```
GET    /products           → Get all products
GET    /products/:id       → Get single product
GET    /products/meta/categories → Get product categories
POST   /products           → Create product (admin)
PUT    /products/:id       → Update product (admin)
DELETE /products/:id       → Delete product (admin)
```

### Authentication
```
POST   /auth/register      → Register user
POST   /auth/login         → Login user
GET    /auth/me            → Get current user (token required)
```

### Orders
```
POST   /orders             → Create order
GET    /orders             → Get user's orders
GET    /orders/:id         → Get order details
PUT    /orders/:id         → Update order status
```

### Payments
```
POST   /payment/bkash/init → Initialize bKash payment
POST   /payment/bkash/confirm → Confirm bKash payment
```

### Health Check
```
GET    /health             → Check API status
```

---

## ⚡ Performance Tips

1. **Add images via CDN** (not uploads folder)
   - Use: [Cloudinary](https://cloudinary.com) or [imgbb](https://imgbb.com)
   - Reduces server bandwidth
   - Faster loading

2. **Database Optimization**
   - Add indexes to frequently queried fields
   - Archive old orders monthly
   - Keep product count under 10,000

3. **Frontend Optimization**
   - Enable Gzip compression (already configured)
   - Lazy load product images
   - Cache API responses

---

## 🐛 Troubleshooting

### Frontend shows "Cannot fetch products"

**Cause:** Backend not responding or API_URL incorrect

**Fix:**
1. Check API_URL in shop.html (line ~689)
2. Verify Render backend is running: `https://tuavec-backend.onrender.com/health`
3. Check browser console (F12) for CORS errors
4. Ensure backend .env has correct MONGODB_URI

### Products not showing even though API returns data

**Cause:** Frontend JavaScript error

**Fix:**
1. Open DevTools (F12) → Console tab
2. Look for red errors
3. Check if product images load (network tab)
4. Verify JSON format from API

### Render backend won't deploy

**Cause:** Missing environment variables or code error

**Fix:**
1. Go to Render dashboard → Logs
2. Look for error messages
3. Verify MONGODB_URI is correct
4. Check that all npm dependencies are installed

### Netlify shows blank page

**Cause:** Build error or missing files

**Fix:**
1. Go to Netlify → Deploys → View logs
2. Check for build errors
3. Ensure frontend folder structure is correct
4. Verify HTML file references correct paths

### CORS Error in browser console

**Cause:** Origin not whitelisted in backend CORS

**Fix:**
1. Update `allowedOrigins` in backend/server.js
2. Include your Netlify domain: `https://your-site.netlify.app`
3. Redeploy backend: `git push`

---

## 📈 Next Steps to Reach Daraz/Amazon Level

### Phase 1: Essential Features (Week 1-2)
- [ ] Product detail page
- [ ] Shopping cart page with checkout
- [ ] User account dashboard
- [ ] Payment gateway (bKash full integration)

### Phase 2: Advanced Features (Week 3-4)
- [ ] Search & filter optimization
- [ ] Product recommendations
- [ ] Review & rating system
- [ ] Email notifications

### Phase 3: Admin & Operations (Week 5-6)
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Order fulfillment system
- [ ] Analytics dashboard

### Phase 4: Scaling (Week 7+)
- [ ] Performance optimization
- [ ] CDN for images
- [ ] Redis caching
- [ ] Automated backups
- [ ] SEO optimization

---

## 📞 Support & Resources

| Resource | Link |
|----------|------|
| Backend API Docs | See `/routes` folder |
| MongoDB Docs | [docs.mongodb.com](https://docs.mongodb.com) |
| Express.js Docs | [expressjs.com](https://expressjs.com) |
| Render Docs | [render.com/docs](https://render.com/docs) |
| Netlify Docs | [docs.netlify.com](https://docs.netlify.com) |

---

## 📄 License

Tu Avec E-Commerce Platform © 2024

---

**Last Updated:** July 15, 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅

