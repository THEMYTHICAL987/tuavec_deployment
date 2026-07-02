// =====================================================================
//  Tu Avec — backend/server.js
//  Place this in: tuavec-complete-final/backend/server.js
//  Run from:      tuavec-complete-final/backend/   (npm start)
// =====================================================================

const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');          // ← declared ONCE (was the crash bug)
const path      = require('path');
const fs        = require('fs');
require('dotenv').config();

const app = express();

// =====================================================================
//  CORS — accepts file://, localhost variants, LAN, Netlify, Render,
//  Vercel, and your custom domain
// =====================================================================
const allowedOrigins = [
    // file:// (Live Server / opening index.html directly from disk)
    'null',
    // localhost
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5500',   // VS Code Live Server
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5500',
    // LAN (any 192.168.x.x device on port 3000 or 5500)
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:(3000|5000|5500)$/,
    // Cloud deploy
    /\.vercel\.app$/,
    /\.netlify\.app$/,
    /\.onrender\.com$/,
    // Add your custom domain here, e.g.:
    // 'https://tuavec.com',
];

app.use(cors({
    origin(origin, callback) {
        // Allow server-to-server / Postman (no origin header)
        if (!origin) return callback(null, true);
        const allowed = allowedOrigins.some(o =>
            o instanceof RegExp ? o.test(origin) : o === origin
        );
        if (allowed) return callback(null, true);
        callback(new Error(`CORS: origin "${origin}" not allowed`));
    },
    credentials:    true,
    methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =====================================================================
//  STATIC FILES
// =====================================================================

// Serve uploaded product images
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
    app.use('/uploads', express.static(uploadsDir));
    console.log('📁 Serving uploads from', uploadsDir);
}

// Serve the frontend (sibling folder relative to backend/)
const frontendDir = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendDir)) {
    app.use(express.static(frontendDir));
    console.log('🌐 Serving frontend from', frontendDir);
}

// =====================================================================
//  DATABASE
// =====================================================================
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tuavec';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected —', mongoose.connection.name);
    })
    .catch(err => {
        // Log the error but keep the process alive — routes will return
        // 503 until the DB comes back.
        console.error('❌ MongoDB error:', err.message);
    });

// =====================================================================
//  HEALTH CHECK
// =====================================================================
app.get('/health', (_req, res) => {
    res.json({
        success:   true,
        message:   'Tu Avec API is running',
        database:  mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
    });
});

// =====================================================================
//  API ROUTES
// =====================================================================
const productRoutes  = require('./routes/products');
const orderRoutes    = require('./routes/orders');
const logisticsRoutes = require('./routes/logistics');
const authRoutes     = require('./routes/auth');

app.use('/api/products',       productRoutes);
app.use('/api/orders',         orderRoutes);
app.use('/api/v1/orders',      orderRoutes);     // legacy alias
app.use('/api/v1/logistics',   logisticsRoutes);
app.use('/api/auth',           authRoutes);

// Optional routes — only mount if the file exists (avoids crash on missing file)
const optionalRoutes = [
    { path: '/api/cart',   file: './routes/cart'   },
    { path: '/api/bkash',  file: './routes/bkash'  },
    { path: '/api/reviews',file: './routes/reviews' },
    { path: '/api/posts',  file: './routes/posts'   },
];

optionalRoutes.forEach(({ path: routePath, file }) => {
    try {
        app.use(routePath, require(file));
        console.log(`   ✓ ${routePath}`);
    } catch {
        console.warn(`   ⚠  ${routePath} — route file not found, skipping`);
    }
});

// =====================================================================
//  ERROR HANDLER
// =====================================================================
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error('❌ Server error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        error:   err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// =====================================================================
//  SPA FALLBACK / 404
// =====================================================================
app.use('*', (req, res) => {
    if (req.method === 'GET') {
        const indexFile = path.join(frontendDir, 'index.html');
        if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
    }
    res.status(404).json({ success: false, error: 'Route not found', path: req.originalUrl });
});

// =====================================================================
//  START
// =====================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀  Tu Avec running on port ${PORT}`);
    console.log('\n📡  Endpoints:');
    console.log('   GET   /health');
    console.log('   GET   /api/products');
    console.log('   POST  /api/orders');
    console.log('   POST  /api/auth/login');
    console.log('   POST  /api/auth/signup');
    console.log('\n✅  Ready\n');
});

// =====================================================================
//  GRACEFUL SHUTDOWN
// =====================================================================
['SIGTERM', 'SIGINT'].forEach(signal =>
    process.on(signal, () => {
        console.log(`\n👋  ${signal} — shutting down…`);
        mongoose.connection.close(() => {
            console.log('✅  MongoDB closed');
            process.exit(0);
        });
    })
);