const jwt = require('jsonwebtoken');

// Admin authentication middleware - checks for admin token in header
const adminAuth = (req, res, next) => {
  const adminToken = req.headers['x-admin-token'];
  const expectedToken = process.env.ADMIN_TOKEN || 'admin-secret-key-change-in-production';

  if (!adminToken || adminToken !== expectedToken) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: Admin token required'
    });
  }

  next();
};

module.exports = { adminAuth };
