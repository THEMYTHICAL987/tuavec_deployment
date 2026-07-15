# 🚀 Deployment Guide - Tu Avec E-Commerce

Complete step-by-step guide for deploying Tu Avec on Netlify (frontend) + Render (backend).

**Estimated Time:** 15-20 minutes  
**Difficulty:** Beginner-Friendly ✅

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] MongoDB Atlas account (free tier) — [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- [ ] Render.com account (free tier) — [render.com](https://render.com)
- [ ] Netlify account (free tier) — [netlify.com](https://netlify.com)
- [ ] GitHub account — [github.com](https://github.com)
- [ ] Your MongoDB connection string
- [ ] Your backend URL (from Render)
- [ ] Node.js installed (for local testing)

---

## ✅ Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account

```
1. Go to: https://mongodb.com/cloud/atlas
2. Click "Sign Up Free"
3. Create account with email or Google
4. Verify email
```

### 1.2 Create a Cluster

```
1. Click "Create Database"
2. Select "M0 Free" tier
3. Choose your cloud provider (AWS recommended)
4. Select region closest to Asia/Bangladesh:
   - ap-southeast-1 (Singapore)
   - ap-south-1 (Mumbai)
5. Click "Create Cluster"
6. Wait 3-5 minutes for creation
```

### 1.3 Create Database User

```
1. Go to "Security" → "Database Access"
2. Click "+ Add Database User"
3. Authentication Method: "Password"
4. Username: tuavec_user (any name)
5. Password: Create strong password (save it!)
6. Database User Privileges: "Atlas admin"
7. Click "Add User"
```

### 1.4 Get Connection String

```
1. Go to "Database" → "Connect"
2. Click "Drivers"
3. Select "Node.js" and version "5.0 or later"
4. Copy connection string
5. Replace <password> with your database user password
6. Replace <username> with your database user

Example:
mongodb+srv://tuavec_user:YourPassword123@cluster.mongodb.net/tuavec?retryWrites=true&w=majority
```

### 1.5 Whitelist IP Address

```
1. Go to "Security" → "Network Access"
2. Click "+ Add IP Address"
3. Select "Allow Access from Anywhere"
   (Render's IP is dynamic, so allow all)
4. Click "Confirm"
```

---

## ✅ Step 2: Backend Deployment (Render.com)

### 2.1 Push Code to GitHub

```bash
# Navigate to your project root
cd tuavec

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Tu Avec - Initial commit for deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/tuavec.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy Backend on Render

```
1. Go to: https://render.com
2. Sign in / Sign up (free tier)
3. Click "New +" button (top right)
4. Select "Web Service"
5. Connect GitHub (authorize if needed)
6. Select your "tuavec" repository
```

### 2.3 Configure Render Deployment

```
Fill in the form:

Name:                    tuavec-backend
Environment:             Node
Region:                  Prefer closest to users
Root Directory:          backend  ← IMPORTANT!
Build Command:           npm install
Start Command:           npm start
Branch:                  main

Click "Create Web Service"
```

### 2.4 Add Environment Variables

```
1. While deployment is in progress, scroll down
2. Go to "Environment" section
3. Add these variables:

MONGODB_URI              → Your MongoDB connection string
JWT_SECRET               → Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NODE_ENV                 → production
BACKEND_URL              → https://tuavec-backend.onrender.com
FRONTEND_URL             → https://your-site.netlify.app (or your domain)

4. Click "Save"
5. Render automatically redeploys
6. Wait 3-5 minutes for deployment
```

### 2.5 Verify Backend is Running

```
1. Go to your Render service dashboard
2. Copy your service URL: https://tuavec-backend.onrender.com
3. Test health endpoint:
   https://tuavec-backend.onrender.com/health
4. Should return JSON with status "connected" ✅
```

**Save your backend URL!** → `https://tuavec-backend.onrender.com`

---

## ✅ Step 3: Frontend Deployment (Netlify)

### 3.1 Update Backend URL in Frontend

**Edit `frontend/shop.html` around line 689:**

```javascript
// FIND THIS:
const getAPIUrl = () => {
    if (window.location.hostname.includes('netlify.app')) {
        return 'https://tuavec-backend.onrender.com/api';
    }
    // ... more code ...
};

// UPDATE THE URL TO YOUR RENDER BACKEND:
// Change: 'https://tuavec-backend.onrender.com/api'
// To: 'YOUR_ACTUAL_RENDER_URL/api'
```

### 3.2 Commit and Push

```bash
git add frontend/shop.html
git commit -m "Update API URL for production deployment"
git push
```

### 3.3 Deploy to Netlify

**Option A: Automatic (Recommended)**

```
1. Go to: https://netlify.com
2. Sign in / Sign up
3. Click "Add new site"
4. Select "Import an existing project"
5. Choose "GitHub"
6. Authorize and select your "tuavec" repo
7. Configure:
   - Base directory: frontend
   - Build command: (leave empty - no build needed)
   - Publish directory: frontend
8. Click "Deploy site"
9. Wait 1-2 minutes
10. Get your URL: https://your-site-name.netlify.app
```

**Option B: Manual Drag & Drop (Quickest)**

```
1. Go to: https://netlify.com
2. Sign in
3. Drag and drop "frontend" folder onto dashboard
4. Done! Netlify gives you instant URL ✅
```

---

## ✅ Step 4: Test Your Live Site

### 4.1 Verify Setup

```
1. Open your Netlify frontend URL
2. Should see shop page with styling ✅
3. Open browser DevTools (F12)
4. Go to Network tab
5. Refresh page
6. Look for API requests:
   - Should show /api/products/meta/categories
   - Status: 200 ✅
```

### 4.2 Add Test Products

```bash
# On your LOCAL machine in backend folder:
cd backend
npm install

# Edit seed-products.js with sample Thai products
# Then run:
node seed-products.js

# Go back to Netlify site and refresh
# You should see products! ✅
```

### 4.3 Test Features

| Feature | How to Test | Expected |
|---------|------------|----------|
| Load page | Visit site | No errors in console ✅ |
| Show products | Products visible | From MongoDB ✅ |
| Add to cart | Click button | Item appears in cart ✅ |
| Search | Type in search | Filters products ✅ |
| Mobile view | Resize to 375px | Responsive ✅ |

---

## ✅ Step 5: Custom Domain (Optional)

### 5.1 Buy Domain

Purchase from: GoDaddy, Namecheap, Hostinger, etc.

### 5.2 Update Netlify Custom Domain

```
1. In Netlify dashboard
2. Go to "Domain settings"
3. Click "Add custom domain"
4. Enter: tuavec.com
5. Accept name server setup OR configure DNS records:

If using Netlify nameservers:
- Update domain registrar to use Netlify's nameservers
- Takes 24-48 hours to propagate

If using DNS records (faster):
Add to your domain registrar:
Type: A Record or CNAME
Name: @ (or tuavec.com)
Value: Netlify's IP or your-site.netlify.app
```

### 5.3 Update Backend CORS

**Edit `backend/server.js` around line 20:**

```javascript
const allowedOrigins = [
    // existing entries...
    'https://tuavec.com',
    'https://www.tuavec.com',
];
```

```bash
git add backend/server.js
git commit -m "Add custom domain to CORS"
git push
# Render auto-redeploys ✅
```

---

## 🔄 Continuous Deployment (Auto-Updates)

### How It Works

Both Netlify and Render watch your GitHub repository:

1. **You make changes locally**
   ```bash
   # Edit a file
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **GitHub receives update**

3. **Services auto-deploy**
   - Netlify: 1-2 minutes for frontend
   - Render: 3-5 minutes for backend

4. **Live on production!** ✅

### No Manual Deployment Needed!

Just push to GitHub and your site updates automatically.

---

## 🚨 Common Issues & Fixes

### Issue 1: "Cannot load products" on Netlify

**Cause:** Backend URL not updated in shop.html

**Fix:**
```bash
# Check shop.html line ~689
# Make sure API_URL points to YOUR Render URL
# Then: git add frontend/ && git push
# Wait 2 min for Netlify deploy
```

### Issue 2: Render says "Build failed"

**Cause:** Missing dependencies or wrong root directory

**Fix:**
```
1. Check Render logs for error
2. Verify "Root Directory" is set to "backend"
3. Verify package.json exists in backend/
4. Run: npm install locally to test
5. Push to GitHub again
```

### Issue 3: "CORS error" in browser console

**Cause:** Frontend URL not whitelisted in backend

**Fix:**
1. Add frontend URL to `backend/server.js` allowedOrigins
2. Push to GitHub
3. Render auto-redeploys
4. Wait 5 minutes for changes to take effect

### Issue 4: Products not showing even after adding to MongoDB

**Cause:** Image URLs broken or API error

**Fix:**
1. Open DevTools (F12) → Console
2. Check for error messages
3. Verify MongoDB has data: MongoDB Atlas → Collections
4. Check API response: Visit `https://your-backend.onrender.com/api/products`
5. Should return JSON array

### Issue 5: "Service suspended" on Render

**Cause:** Free tier limit (15 min inactivity = sleep)

**Fix:**
1. Upgrade to Paid tier (optional)
2. Or set up wake-up: Use UptimeRobot to ping every 15 min
   - Go to uptimerobot.com
   - Monitor: `https://your-backend.onrender.com/health`
   - Interval: 14 minutes

---

## 📊 Monitoring Your Site

### Check Backend Status

```
URL: https://your-backend.onrender.com/health

Response should be:
{
  "success": true,
  "message": "Tu Avec API is running",
  "database": "connected",
  "timestamp": "2024-07-15T10:30:00.000Z"
}
```

### Monitor Render Logs

```
1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. See real-time activity
```

### Monitor Netlify Analytics

```
1. Go to Netlify dashboard
2. Select your site
3. Click "Analytics" tab
4. See traffic, errors, performance
```

---

## 🔐 Security Checklist

Before going live:

- [ ] Change JWT_SECRET to unique random value
- [ ] Change MongoDB user password to strong password
- [ ] Enable HTTPS (automatic on Netlify & Render)
- [ ] Whitelist only necessary CORS origins
- [ ] Don't commit .env file to GitHub
- [ ] Use strong admin credentials
- [ ] Enable 2FA on all accounts (GitHub, Render, Netlify, MongoDB)

---

## 💡 Pro Tips

### Tip 1: Free SSL Certificate
- Automatic on both Netlify & Render ✅
- HTTPS enabled by default ✅

### Tip 2: Automatic Backups
- MongoDB Atlas: Auto-backups daily ✅
- GitHub: All code versioned ✅

### Tip 3: Performance
- Netlify CDN: ~30 regions worldwide ✅
- Render: Auto-scaling ✅
- MongoDB: Indexes on frequently queried fields ✅

### Tip 4: Uptime Monitoring
```bash
# Use UptimeRobot (free):
1. Go to uptimerobot.com
2. Add monitor: https://your-backend.onrender.com/health
3. Check every 5 minutes
4. Get alerts if down
```

---

## 📞 Support Resources

| Issue | Resource |
|-------|----------|
| Netlify help | docs.netlify.com |
| Render help | render.com/docs |
| MongoDB help | docs.mongodb.com |
| GitHub help | docs.github.com |

---

**Deployment Status: ✅ COMPLETE**

Your Tu Avec e-commerce platform is now live and ready for customers! 🎉

---

**Last Updated:** July 15, 2024  
**Version:** 1.0.0

