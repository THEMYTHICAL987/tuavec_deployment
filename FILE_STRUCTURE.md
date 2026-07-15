# 📁 Project Structure & File Guide

Complete guide to Tu Avec project files and what each one does.

---

## 📂 Project Structure

```
tuavec/
│
├── 📄 README.md                    ← START HERE: Full platform overview
├── 📄 QUICK_START.md              ← 20-minute deployment checklist
├── 📄 DEPLOYMENT.md               ← Detailed Render + Netlify setup
├── 📄 MAINTENANCE.md              ← Product management & updates
├── 📄 SUMMARY.md                  ← What's been done & status
├── 📄 FILE_STRUCTURE.md           ← This file
│
├── frontend/                       ← **Deploy to NETLIFY**
│   ├── 📄 shop.html              ← Main shop page (✅ Updated with dynamic API_URL)
│   ├── 📄 index.html             ← Home page (optional)
│   ├── 📄 testfile.html          ← Test file (can delete)
│   └── 📄 blogentity.html        ← Blog placeholder (optional)
│
├── backend/                        ← **Deploy to RENDER**
│   ├── 📄 package.json           ← Dependencies & scripts
│   ├── 📄 server.js              ← Express server (main entry point)
│   ├── 📄 .env.example           ← Environment variables template
│   ├── .env                      ← (Create from .env.example - NOT in Git)
│   │
│   ├── js/
│   │   └── 📄 api.js            ← Helper functions
│   │
│   ├── middleware/
│   │   ├── 📄 auth.js           ← JWT authentication
│   │   └── 📄 upload.js         ← File upload handling
│   │
│   ├── models/
│   │   └── 📄 index.js          ← MongoDB schemas (Product, User, Order, etc.)
│   │
│   ├── routes/
│   │   ├── 📄 auth.js           ← /api/auth endpoints
│   │   ├── 📄 products.js       ← /api/products endpoints ⭐ MAIN
│   │   ├── 📄 orders.js         ← /api/orders endpoints
│   │   ├── 📄 cart.js           ← /api/cart endpoints
│   │   ├── 📄 bkash.js          ← Payment gateway
│   │   ├── 📄 reviews.js        ← Product reviews
│   │   ├── 📄 logistics.js      ← Order tracking
│   │   └── 📄 posts.js          ← Blog posts
│   │
│   ├── services/
│   │   └── 📄 smsService.js     ← SMS notifications (optional)
│   │
│   ├── utils/
│   │   ├── 📄 helpers.js        ← Utility functions
│   │   └── 📄 bkash.js          ← bKash integration
│   │
│   ├── uploads/                  ← Product image uploads folder
│   │
│   ├── 📄 seed-products.js       ← Bulk add products to MongoDB
│   └── node_modules/             ← (Auto-created by npm install)
│
└── .git/                          ← Version control (auto-created by git init)
```

---

## 📖 What Each File Does

### Root Level Documentation

| File | Purpose | When to Read |
|------|---------|--------------|
| **README.md** | Platform overview, features, troubleshooting | Before deployment |
| **QUICK_START.md** | Fast deployment checklist | First-time deployment |
| **DEPLOYMENT.md** | Detailed step-by-step guide | During deployment |
| **MAINTENANCE.md** | How to manage after launch | After deployment |
| **SUMMARY.md** | What's been done & architecture | Quick reference |
| **FILE_STRUCTURE.md** | This file - project structure | When exploring codebase |

---

### Frontend (Netlify - Static HTML/CSS/JS)

#### `frontend/shop.html` ⭐ **MAIN FILE**
- **What it is:** Complete e-commerce shop page
- **Key features:**
  - Product grid display
  - Filtering & sorting
  - Search functionality
  - Shopping cart
  - Wishlist
  - Responsive mobile design
- **Recent changes:** Dynamic API_URL configuration (line ~689)
- **Deployment:** Drag to Netlify or connect GitHub auto-deploy
- **Update frequency:** When design changes

#### `frontend/index.html`
- **What it is:** Home page (placeholder)
- **Status:** Optional - can create landing page here
- **Deployment:** Same as shop.html

---

### Backend (Render - Node.js/Express)

#### `backend/package.json`
- **What it is:** Project metadata & dependencies list
- **Key info:**
  - Node.js version requirement
  - All npm packages needed
  - Scripts for npm start / npm dev
- **Never edit manually:** Use `npm install package-name`
- **Deployment:** Render reads this to install dependencies

#### `backend/server.js` ⭐ **MAIN ENTRY POINT**
- **What it is:** Express server configuration
- **Key responsibilities:**
  - CORS setup
  - Route definitions
  - Database connection
  - Error handling
  - Health checks
- **When to edit:** Add new routes, update CORS origins, change ports
- **Edit location:** Line ~20 for allowedOrigins (CORS)

#### `backend/.env.example`
- **What it is:** Template for environment variables
- **How to use:**
  ```bash
  cp backend/.env.example backend/.env
  # Edit .env with your actual values
  # DON'T commit .env to Git (add to .gitignore)
  ```
- **Key variables:**
  - MONGODB_URI (required)
  - JWT_SECRET (required)
  - NODE_ENV (production/development)
  - BACKEND_URL, FRONTEND_URL (for CORS)

---

### Middleware (`backend/middleware/`)

#### `auth.js`
- **What it is:** JWT authentication middleware
- **Used by:** Protected routes that require login
- **Checks:** Valid JWT token in Authorization header

#### `upload.js`
- **What it is:** File upload handling
- **Supports:** Product images, user avatars
- **Limits:** File size, file types

---

### Models (`backend/models/`)

#### `index.js`
- **What it is:** MongoDB schema definitions
- **Defines:** Product, User, Order, Review, Cart schemas
- **Used by:** All routes when interacting with database
- **Edit when:** Adding new fields to products/orders/users

---

### Routes (`backend/routes/`) ⭐ **API ENDPOINTS**

#### `products.js` ⭐ **MOST IMPORTANT**
- **Endpoints:**
  ```
  GET    /api/products              → Get all products
  GET    /api/products/:id          → Get single product
  GET    /api/products/meta/categories → Get categories
  POST   /api/products              → Create product
  PUT    /api/products/:id          → Update product
  DELETE /api/products/:id          → Delete product
  ```
- **Frontend calls:** Every time shop page loads

#### `auth.js`
- **Endpoints:**
  ```
  POST   /api/auth/register         → Register user
  POST   /api/auth/login            → Login user
  GET    /api/auth/me               → Get current user
  ```

#### `orders.js`
- **Endpoints:**
  ```
  POST   /api/orders                → Create order
  GET    /api/orders                → Get user orders
  GET    /api/orders/:id            → Get order details
  PUT    /api/orders/:id            → Update order status
  ```

#### `cart.js`, `bkash.js`, `reviews.js`, etc.
- **Status:** Exist but may need completion
- **Edit when:** Implementing full features

---

### Services (`backend/services/`)

#### `smsService.js`
- **What it is:** SMS notification service
- **Uses:** Twilio API (optional setup)
- **Called by:** Order confirmation, shipping updates

---

### Utils (`backend/utils/`)

#### `helpers.js`
- **What it is:** Helper functions
- **Contains:** Common utilities, validators, formatters

#### `bkash.js`
- **What it is:** bKash payment integration
- **Used by:** `/api/payment/bkash` endpoints

---

### Database Operations

#### `backend/seed-products.js`
- **What it is:** Script to bulk-add products to MongoDB
- **Usage:**
  ```bash
  cd backend
  node seed-products.js
  ```
- **Edit before running:** Add your products to the array
- **Run after:** Every time you want to reset/add products

---

## 🔄 Data Flow (How It All Works Together)

### When User Visits Website

```
1. Browser loads frontend/shop.html from Netlify
   ↓
2. JavaScript executes (frontend/shop.html)
   ↓
3. JavaScript calls getAPIUrl() → gets backend URL
   ↓
4. Makes API call: fetch(API_URL + '/products')
   ↓
5. Request reaches Render backend
   ↓
6. Express route handler (backend/routes/products.js) processes it
   ↓
7. Queries MongoDB (Product model in backend/models/index.js)
   ↓
8. MongoDB returns products
   ↓
9. Response sent back to browser
   ↓
10. JavaScript displays products on page
    ↓
11. User sees shop grid! ✅
```

---

## 📝 Common Editing Scenarios

### Scenario 1: "I want to change the shop page colors"
```
Edit: frontend/shop.html
Find: :root CSS variables (line ~13)
Change: --rose-gold, --chocolate, --gold colors
Commit: git add frontend/ && git commit && git push
Deploy: Netlify auto-deploys in ~2 minutes
```

### Scenario 2: "I want to add a new product field"
```
Edit: backend/models/index.js (add to Product schema)
Edit: backend/routes/products.js (if needed)
Edit: frontend/shop.html (to display new field)
Test: npm start locally
Commit: git add backend/ frontend/ && git commit && git push
Deploy: Render auto-deploys backend, Netlify auto-deploys frontend
```

### Scenario 3: "I want to add a new API endpoint"
```
Create: new file in backend/routes/ (or edit existing)
Define: Express route (app.get, app.post, etc.)
Register: Add to backend/server.js
Test: curl http://localhost:5000/api/new-endpoint
Commit: git push
Deploy: Render auto-deploys
Frontend: Update frontend/shop.html to call new endpoint
```

### Scenario 4: "I want to bulk add 50 products"
```
Edit: backend/seed-products.js
Add: Your 50 products to array
Run: node backend/seed-products.js
Check: MongoDB Atlas → Collections → verify products added
```

### Scenario 5: "I want to change API response format"
```
Edit: backend/routes/products.js
Find: res.json({ ... }) response format
Change: Structure, fields, filters
Test: curl http://localhost:5000/api/products
Frontend: Update frontend/shop.html to parse new format if needed
Commit & push: Automatic deployment
```

---

## 🚀 Deployment File Checklist

### Files That Deploy to Netlify
```
✅ frontend/shop.html        (main file)
✅ frontend/index.html       (optional)
✅ frontend/*.html           (any HTML files)
✅ CSS (embedded in HTML)
✅ JS (embedded in HTML)
```

### Files That Deploy to Render
```
✅ backend/package.json      (dependencies)
✅ backend/server.js         (entry point)
✅ backend/routes/           (all API routes)
✅ backend/models/           (database schemas)
✅ backend/middleware/       (auth, upload)
✅ backend/utils/            (helpers)
✅ backend/services/         (SMS, etc.)
✅ backend/.env              (environment vars - set in Render, not committed)
```

### Files That Should NOT Deploy
```
❌ backend/.env              (set in Render dashboard instead)
❌ backend/node_modules/     (npm install creates this)
❌ .git/                     (version control)
❌ node_modules/ anywhere    (auto-created by npm)
```

---

## 🔐 Important Security Notes

### Never Commit to GitHub
```bash
# Add to .gitignore:
backend/.env
backend/node_modules/
.env
node_modules/
```

### Environment Variables
```
Store in Render dashboard, NOT in code
- MONGODB_URI
- JWT_SECRET
- API_KEYS
- PASSWORDS
```

### CORS Whitelist
```
In backend/server.js, allowedOrigins array
Add: Only domains that should access your API
```

---

## 📊 File Dependencies

```
frontend/shop.html (depends on):
  → API_URL configuration (line ~689)
  → Backend must be running
  → MongoDB must have products
  → CORS must allow frontend origin

backend/server.js (depends on):
  → backend/package.json (for npm packages)
  → backend/.env (for environment variables)
  → MongoDB Atlas (database connection)
  → backend/routes/*.js (for API routes)

backend/routes/products.js (depends on):
  → backend/models/index.js (for Product schema)
  → MongoDB (database)
  → backend/middleware/auth.js (if protected)

seed-products.js (depends on):
  → backend/models/index.js
  → backend/.env (MONGODB_URI)
  → MongoDB connection
```

---

## 🔄 Update Workflow

```
Local Change → Git Push → GitHub → Auto-Deploy to Netlify/Render
```

### Frontend Only Changes
```
Edit frontend/shop.html
  ↓
git add frontend/
git commit -m "Update shop design"
git push
  ↓
Netlify auto-deploys
  ↓
Changes live in ~2 minutes
```

### Backend Only Changes
```
Edit backend/routes/products.js
  ↓
git add backend/
git commit -m "Fix product query"
git push
  ↓
Render auto-deploys
  ↓
Changes live in ~3-5 minutes
```

### Database Changes (No Code Deploy Needed)
```
Open MongoDB Atlas Dashboard
  ↓
Edit/add documents in Collections
  ↓
Changes live immediately! ✅
  ↓
No git push needed
```

---

## 📞 Quick Reference

| Need | File | Location |
|------|------|----------|
| Add product | MongoDB Atlas OR seed-products.js | Collections or backend/ |
| Change colors | frontend/shop.html | Line ~13 (:root) |
| Change layout | frontend/shop.html | CSS grid (line ~408) |
| Add API route | backend/routes/ | Any route file |
| Fix DB connection | backend/.env | MONGODB_URI |
| JWT issues | backend/middleware/auth.js | Line ~10 |
| CORS errors | backend/server.js | Line ~20 allowedOrigins |
| Want to add products | backend/seed-products.js | Edit array, run script |

---

**Last Updated:** July 15, 2024  
**Version:** 1.0.0

