# 🛠️ Maintenance & Updates Guide - Tu Avec

How to manage, update, and maintain your Tu Avec e-commerce platform after deployment.

---

## 📑 Table of Contents

1. [Managing Products](#managing-products)
2. [Updating Website Content](#updating-website-content)
3. [Regular Maintenance Tasks](#regular-maintenance-tasks)
4. [Monitoring & Analytics](#monitoring--analytics)
5. [Troubleshooting](#troubleshooting)
6. [Performance Optimization](#performance-optimization)

---

## 📦 Managing Products

### ✏️ Add Single Product (via MongoDB Atlas)

**Fastest way for occasional additions:**

```
1. Go to: https://mongodb.com/cloud/atlas
2. Log in to your account
3. Click your cluster
4. Click "Collections" tab
5. Select "tuavec" database → "products" collection
6. Click "+ Insert Document"
7. Paste JSON below (modify fields):

{
  "name": "Thai Mango Rice 1kg",
  "category": "Rice & Grains",
  "subcategory": "Rice",
  "price": 2500,
  "originalPrice": 3200,
  "discount": 22,
  "description": "Premium long-grain Thai jasmine rice, aromatic and fluffy",
  "image": "https://cdn-example.com/thai-mango-rice.jpg",
  "images": [
    "https://cdn-example.com/thai-mango-rice-1.jpg",
    "https://cdn-example.com/thai-mango-rice-2.jpg"
  ],
  "stock": 150,
  "minStock": 10,
  "rating": 4.7,
  "reviews": 24,
  "sku": "RICE-001",
  "supplier": "Bangkok Rice Co.",
  "origin": "Thailand",
  "weight": "1kg",
  "expiryDays": 730,
  "isPopular": true,
  "tags": ["organic", "premium", "bestseller"],
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

8. Click "Insert"
9. **Refresh your website** → Product appears! ✅

### 📤 Bulk Add Products (via Seed Script)

**For adding 10+ products at once:**

```bash
# 1. Edit backend/seed-products.js
# Add your products to the array

# 2. Ensure backend/models/index.js has Product model

# 3. Set environment variable
export MONGODB_URI="your-mongodb-connection-string"

# 4. Run seed script
cd backend
node seed-products.js

# Output: ✅ Products inserted successfully
```

### 🗑️ Delete Product

```
1. MongoDB Atlas → Collections → products
2. Find product you want to delete
3. Click "Delete" icon
4. Confirm deletion
5. Website updates automatically ✅
```

### 🔄 Update Product Details

```
1. MongoDB Atlas → Collections → products
2. Find product to edit
3. Click on the document
4. Edit any field
5. Click "Update"
6. Changes live immediately ✅
```

### 🎯 Quick Product Updates

| Change | How to Update | Time |
|--------|---------------|------|
| Price | MongoDB → Edit field | 1 min |
| Stock | MongoDB → Edit field | 1 min |
| Name | MongoDB → Edit field | 1 min |
| Image | MongoDB → Edit field | 1 min |
| Description | MongoDB → Edit field | 1 min |
| All at once | Seed script | 2-5 min |

---

## 🌐 Updating Website Content

### 1️⃣ Update Shop Page Design

**File:** `frontend/shop.html`

```bash
# 1. Open editor
code frontend/shop.html

# 2. Make changes:
#   - Change colors (search :root CSS variables)
#   - Change layout (grid sizes, spacing)
#   - Update text/headings
#   - Add new sections

# 3. Save file

# 4. Git commit and push
git add frontend/shop.html
git commit -m "Update shop page design"
git push

# 5. Netlify auto-deploys (~2 minutes)
# Changes live! ✅
```

### 2️⃣ Update Colors & Branding

**In `frontend/shop.html` around line 13:**

```css
:root {
    --chocolate: #3e2723;        /* Brown tone */
    --rose-gold: #b76e79;        /* Accent color */
    --gold: #d4af37;             /* Premium gold */
    --bg-dark: #161616;          /* Background */
    --text-light: #f5f5f5;       /* Text color */
    --success: #4caf50;          /* Green (success) */
    --error: #f44336;            /* Red (errors) */
    --warning: #ff9800;          /* Orange (warnings) */
}

# Change values to your brand colors
# Git push → Netlify auto-deploys ✅
```

### 3️⃣ Update Product Grid Layout

**In `frontend/shop.html` around line 408:**

```css
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    /* Adjust minmax values:
       220px = current (4-5 products per row on desktop)
       250px = larger cards (3-4 per row)
       180px = smaller cards (5-6 per row)
    */
    gap: 25px;
}
```

### 4️⃣ Add New Page

```bash
# 1. Copy frontend/shop.html → frontend/about.html
cp frontend/shop.html frontend/about.html

# 2. Edit about.html with new content

# 3. Update navigation links in shop.html
#   Add: <a href="about.html">About</a>

# 4. Git push
git add frontend/
git commit -m "Add about page"
git push

# Netlify deploys → New page live! ✅
```

---

## 📅 Regular Maintenance Tasks

### Daily (Automated)

- ✅ MongoDB backups (automatic on Atlas)
- ✅ SSL certificate (auto-renewed)
- ✅ Website monitoring (UptimeRobot)

### Weekly

```bash
# Check backend health
curl https://your-backend.onrender.com/health

# Expected output:
# {
#   "database": "connected",
#   "success": true
# }
```

### Monthly

```bash
# 1. Check MongoDB disk usage
#    Atlas Dashboard → Metrics → Storage

# 2. Review orders
#    MongoDB Atlas → Collections → orders

# 3. Archive old orders (> 6 months)
#    Keep database lean and fast

# 4. Update dependencies (optional)
cd backend
npm outdated
npm update
npm audit fix
git push
```

### Quarterly

```bash
# 1. Update SSL certificate (automatic)
# 2. Review security settings
# 3. Backup important data
# 4. Update Node.js version (if needed)
# 5. Review analytics for trends
```

### Yearly

```bash
# 1. Review all data backups
# 2. Update to latest Node version
# 3. Audit security compliance
# 4. Plan for scaling (if needed)
# 5. Review cost optimization
```

---

## 📊 Monitoring & Analytics

### 1️⃣ Website Traffic (Netlify)

```
1. Go to: https://app.netlify.com
2. Select your site
3. Go to "Analytics" tab
4. View:
   - Daily visitors
   - Page views
   - Error rates
   - Performance scores
```

### 2️⃣ Backend Logs (Render)

```
1. Go to: https://dashboard.render.com
2. Select your service
3. Go to "Logs" tab
4. See:
   - API requests
   - Database connections
   - Errors/warnings
   - Performance metrics
```

### 3️⃣ Database Metrics (MongoDB)

```
1. Go to: https://mongodb.com/cloud/atlas
2. Select your cluster
3. Go to "Metrics" tab
4. Monitor:
   - Read/write ops
   - Storage usage
   - Connection count
   - Query performance
```

### 4️⃣ Custom Monitoring (UptimeRobot - Free)

```
1. Go to: https://uptimerobot.com
2. Sign up (free tier available)
3. Create monitor:
   URL: https://your-backend.onrender.com/health
   Interval: Every 5 minutes
   Alert: Email if down

4. Benefits:
   - Get alerted if backend goes down
   - See uptime %
   - Track response times
```

---

## 🐛 Troubleshooting

### Problem: Products not loading

**Diagnosis:**
```
1. Open DevTools (F12) → Network tab
2. Refresh page
3. Look for /api/products request
4. Check status code:
   - 200 = OK
   - 404 = Not found
   - 500 = Server error
   - No request = CORS issue
```

**Fix:**

If **no request made:**
```bash
# API_URL wrong in frontend/shop.html
# Line ~689: Update API_URL
# Change: const API_URL = 'http://localhost:5000/api';
# To: const API_URL = 'https://your-backend.onrender.com/api';
# Git push → Fixed! ✅
```

If **500 error:**
```bash
# Check backend logs on Render
# 1. Go to Render dashboard
# 2. View "Logs"
# 3. See error message
# 4. Fix in backend code
# 5. Git push → Auto-redeploys ✅
```

If **404 error:**
```bash
# Products collection empty in MongoDB
# Solution:
cd backend
node seed-products.js
# Or add products manually via MongoDB Atlas
```

### Problem: Can't connect to backend

**Cause:** MongoDB connection issue

**Fix:**
```
1. Check MongoDB Atlas status
2. Verify MONGODB_URI in Render environment
3. Check IP whitelist (allow all)
4. Test locally: npm start
5. If works locally, redeploy to Render
6. git push → Render resets connection ✅
```

### Problem: Slow website

**Diagnosis:**
```
1. Netlify Analytics → Performance
2. DevTools → Network tab (F12)
3. Check image load times
4. Check API response times
```

**Solutions:**

```bash
# 1. Use CDN for images (not local uploads)
#    Upload to: Cloudinary or imgbb
#    Update image URLs in products

# 2. Add database indexes (fast queries)
#    MongoDB Atlas → Indexes
#    Add index on "category" field

# 3. Compress images before upload
#    Use: TinyPNG or ImageOptim

# 4. Enable caching (auto-enabled)
#    Netlify CDN caches automatically ✅
```

### Problem: Render service sleeps (free tier)

**Cause:** Free tier services sleep after 15 min inactivity

**Solution A: Upgrade to Paid** ($7/month minimum)

**Solution B: Keep Service Awake (Free)**
```
1. Go to: https://uptimerobot.com
2. Create free monitor
3. URL: https://your-backend.onrender.com/health
4. Interval: 14 minutes (pings before sleep)
5. Backend stays awake 24/7 ✅
```

---

## ⚡ Performance Optimization

### 1️⃣ Image Optimization

```bash
# Problem: Large images slow down site

# Solution:
# 1. Resize images to max 800px width
# 2. Compress with TinyPNG.com
# 3. Upload to Cloudinary (free CDN)
# 4. Update image URLs in MongoDB

# Tools:
# - ImageOptim (Mac)
# - ImageMagick (CLI)
# - TinyPNG (online)
```

### 2️⃣ Database Optimization

```bash
# Add indexes for fast queries
# In MongoDB Atlas:

1. Go to Collections
2. Click "Indexes"
3. Create index on frequently searched fields:
   - category
   - name
   - price
   - createdAt

4. Test: Queries now 10-100x faster ✅
```

### 3️⃣ API Caching

```javascript
// Add response caching (in backend/routes/products.js)
// Example:
app.get('/api/products', (req, res) => {
    // Cache products for 5 minutes
    res.set('Cache-Control', 'public, max-age=300');
    // Return products
});

// Benefits: 
// - Reduces database queries
// - Faster page loads
// - Less backend usage
```

### 4️⃣ Frontend Optimization

```html
<!-- Lazy load images (auto-done by browsers now) -->
<img src="product.jpg" loading="lazy" />

<!-- Compress CSS/JS (optional) -->
<!-- Already minified by browsers -->

<!-- Enable browser caching (Netlify does auto) -->
```

### 5️⃣ CDN Usage (Recommended)

```
Use Cloudinary for images (free tier):

1. Go to: https://cloudinary.com
2. Sign up (free tier: 25GB storage)
3. Upload product images
4. Get CDN URL: https://res.cloudinary.com/...
5. Update image URLs in MongoDB
6. Benefits:
   - Auto-optimized images
   - Global CDN (fast everywhere)
   - Auto-resize/format conversion
   - ~10x faster than local uploads
```

---

## 📱 Mobile App Considerations

Your website is already mobile-responsive! ✅

### PWA Features (Future Enhancement)

```bash
# To make PWA (installable on phones):
# 1. Create manifest.json
# 2. Add service worker
# 3. Enable offline mode
# 4. Users can "install" like app

# Current: Works on mobile browser ✅
# Future: Can become full PWA
```

---

## 🔐 Security Maintenance

### Monthly Security Checklist

- [ ] Check for npm vulnerabilities
  ```bash
  cd backend
  npm audit
  npm audit fix
  ```

- [ ] Review access logs
  ```
  Render → Logs → Look for suspicious activity
  ```

- [ ] Update MongoDB password
  ```
  Atlas → Database Access → Rotate password
  ```

- [ ] Review CORS origins
  ```bash
  # backend/server.js → allowedOrigins
  # Remove any domains you don't use
  ```

---

## 📞 Quick Reference

### Emergency Procedures

| Issue | Action | Time |
|-------|--------|------|
| Website down | Check Render logs | 2 min |
| Products missing | Check MongoDB | 1 min |
| CORS error | Update CORS in server.js, git push | 5 min |
| Slow site | Check CDN/images, restart backend | 10 min |
| Database full | Archive old records | 30 min |

### Critical Contacts

| Service | Support | Phone |
|---------|---------|-------|
| Netlify | support@netlify.com | N/A |
| Render | support@render.com | N/A |
| MongoDB | support@mongodb.com | N/A |
| GitHub | support.github.com | N/A |

---

## 📚 Resources

| Task | Resource |
|------|----------|
| Learn MongoDB | mongodb.com/docs |
| Learn Node.js | nodejs.org/en/docs |
| Learn Express | expressjs.com |
| Deploy help | render.com/docs |
| CDN help | cloudinary.com/docs |

---

**Last Updated:** July 15, 2024  
**Version:** 1.0.0

