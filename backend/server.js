const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Order = require('./models/Order');
const PlatformRevenue = require('./models/PlatformRevenue');

// Import routes
const vendorRoutes = require('./routes/vendors');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '2mb' }));

const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    // Initialize platform revenue if it doesn't exist
    const platformRevenue = await PlatformRevenue.findOne();
    if (!platformRevenue) {
      await PlatformRevenue.create({
        totalCommissionsEarned: 0,
        totalOwnerProductSales: 0,
        totalVendorSales: 0,
        transactionHistory: []
      });
      console.log('Platform revenue initialized');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Initialize database on startup
connectDB();

// Routes
app.use('/api/vendors', vendorRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Tu Avec marketplace is online',
    timestamp: new Date().toISOString()
  });
});

// Helper: Get marketplace state
const getMarketplaceState = async () => {
  try {
    const vendorCount = await Vendor.countDocuments({ status: 'approved' });
    const merchantTarget = Number(process.env.MERCHANT_TARGET || 10);
    const vendorShare = Math.min(70, 40 + vendorCount * 3);
    const ownerShare = 100 - vendorShare;

    return {
      merchantTarget,
      currentMerchants: vendorCount,
      ownerShare,
      vendorShare,
      stage: vendorCount >= merchantTarget ? 'Marketplace-led growth' : 'Owner-led launch',
      message: vendorCount >= merchantTarget
        ? 'Your marketplace is now strong enough to shift more of the inventory to merchant partners.'
        : 'You still lead the store while more merchants join.'
    };
  } catch (error) {
    console.error('Error calculating marketplace state:', error);
    return {
      merchantTarget: Number(process.env.MERCHANT_TARGET || 10),
      currentMerchants: 0,
      ownerShare: 100,
      vendorShare: 0,
      stage: 'Owner-led launch',
      message: 'Unable to calculate marketplace state'
    };
  }
};

// GET /api/products - Get all products
app.get('/api/products', async (_req, res) => {
  try {
    const products = await Product.find({}).populate('vendorId', 'name category');
    const marketplace = await getMarketplaceState();

    res.json({
      success: true,
      products,
      marketplace
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// POST /api/products - Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      image,
      description,
      seller,
      featured,
      vendorId,
      vendorCommissionRate
    } = req.body;

    // Validate required fields
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, category, price'
      });
    }

    // If vendorId is provided, verify it exists
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }
    }

    const product = new Product({
      name,
      category,
      price,
      originalPrice: originalPrice || price,
      image: image || null,
      description: description || '',
      seller: seller || (vendorId ? 'Vendor' : 'Tu Avec'),
      featured: featured || false,
      vendorId: vendorId || null,
      vendorCommissionRate: vendorCommissionRate || 0
    });

    await product.save();
    const marketplace = await getMarketplaceState();

    res.status(201).json({
      success: true,
      product,
      marketplace
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// GET /api/marketplace - Get marketplace stats
app.get('/api/marketplace', async (_req, res) => {
  try {
    const marketplace = await getMarketplaceState();
    const approvedVendors = await Vendor.countDocuments({ status: 'approved' });
    const vendorProducts = await Product.countDocuments({ vendorId: { $ne: null } });
    const ownerProducts = await Product.countDocuments({ vendorId: null });
    const platformRevenue = await PlatformRevenue.findOne();

    res.json({
      success: true,
      marketplace: {
        ...marketplace,
        totalVendorProducts: vendorProducts,
        totalOwnerProducts: ownerProducts,
        merchantCount: approvedVendors,
        platformRevenue: platformRevenue ? {
          totalCommissionsEarned: platformRevenue.totalCommissionsEarned,
          totalOwnerProductSales: platformRevenue.totalOwnerProductSales,
          totalVendorSales: platformRevenue.totalVendorSales
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching marketplace stats',
      error: error.message
    });
  }
});

// POST /api/orders - Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, customer, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required'
      });
    }

    // Validate items and enrich with vendor info
    const enrichedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      enrichedItems.push({
        productId: item.productId,
        quantity: item.quantity || 1,
        price: item.price || product.price,
        vendorId: product.vendorId || null,
        vendorCommissionRate: product.vendorCommissionRate || 0
      });
    }

    const order = new Order({
      items: enrichedItems,
      customer,
      total: total || 0,
      status: 'pending'
    });

    await order.save();
    const marketplace = await getMarketplaceState();

    res.status(201).json({
      success: true,
      order,
      marketplace
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// GET /api/orders/:id - Get order details
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId').populate('items.vendorId');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// POST /api/orders/:id/complete - Complete an order and calculate commissions
app.post('/api/orders/:id/complete', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Order already completed'
      });
    }

    // Get platform revenue
    let platformRevenue = await PlatformRevenue.findOne();
    if (!platformRevenue) {
      platformRevenue = await PlatformRevenue.create({
        totalCommissionsEarned: 0,
        totalOwnerProductSales: 0,
        totalVendorSales: 0,
        transactionHistory: []
      });
    }

    // Process commission for each item
    for (const item of order.items) {
      const itemTotal = item.price * item.quantity;

      if (item.vendorId) {
        // Vendor product - calculate commission
        const commission = itemTotal * (item.vendorCommissionRate / 100);
        const vendorRevenue = itemTotal - commission;

        // Update vendor stats
        await Vendor.findByIdAndUpdate(item.vendorId, {
          $inc: {
            totalSales: vendorRevenue,
            totalCommissionEarned: commission
          }
        });

        // Record in platform revenue
        platformRevenue.totalCommissionsEarned += commission;
        platformRevenue.totalVendorSales += vendorRevenue;
        platformRevenue.transactionHistory.push({
          orderId: order._id,
          type: 'commission',
          amount: commission,
          vendorId: item.vendorId
        });
      } else {
        // Owner product - all revenue goes to Tu Avec
        platformRevenue.totalOwnerProductSales += itemTotal;
        platformRevenue.transactionHistory.push({
          orderId: order._id,
          type: 'owner_sale',
          amount: itemTotal
        });
      }
    }

    // Update order status
    order.status = 'completed';
    order.completedAt = new Date();
    await order.save();

    // Save platform revenue
    await platformRevenue.save();

    res.json({
      success: true,
      message: 'Order completed successfully and commissions calculated',
      order,
      commissionsSummary: {
        totalCommissionsEarned: platformRevenue.totalCommissionsEarned,
        totalOwnerProductSales: platformRevenue.totalOwnerProductSales,
        totalVendorSales: platformRevenue.totalVendorSales
      }
    });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing order',
      error: error.message
    });
  }
});

// Fallback route for SPA
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tu Avec marketplace running on port ${PORT}`);
});
