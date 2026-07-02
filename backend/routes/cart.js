const express = require('express');
const router = express.Router();
const { Cart, Product } = require('../models');
const { authenticate } = require('../middleware/auth');

// ========== GET CART FOR LOGGED-IN USER ==========
router.get('/', authenticate, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.userId }).populate('items.productId', 'stock inventory');
        
        if (!cart) {
            return res.json({
                success: true,
                cart: { items: [] }
            });
        }

        // Validate stock for all items
        const validItems = [];
        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                const availableStock = typeof product.stock === 'number' ? product.stock : (product.inventory?.quantity || 0);
                if (availableStock > 0 && item.quantity > 0) {
                    validItems.push(item);
                }
            }
        }

        cart.items = validItems;
        await cart.save();

        res.json({
            success: true,
            cart: {
                items: cart.items
            }
        });
    } catch (err) {
        console.error('Get cart error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch cart' });
    }
});

// ========== ADD ITEM TO CART ==========
router.post('/add', authenticate, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId || quantity < 1) {
            return res.status(400).json({ success: false, error: 'Invalid product or quantity' });
        }

        // Fetch product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const availableStock = typeof product.stock === 'number' ? product.stock : (product.inventory?.quantity || 0);
        if (availableStock < quantity) {
            return res.status(400).json({ 
                success: false, 
                error: `Only ${availableStock} item(s) in stock` 
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.userId });
        if (!cart) {
            cart = new Cart({ user: req.userId, items: [] });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(i => i.productId.toString() === productId);
        if (existingItem) {
            const newQty = existingItem.quantity + quantity;
            if (newQty > availableStock) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Cannot add more than ${availableStock} items` 
                });
            }
            existingItem.quantity = newQty;
        } else {
            cart.items.push({
                productId,
                title: product.name || product.title || 'Unnamed product',
                price: product.price,
                image: product.images?.[0]?.url || product.featuredImage?.url || null,
                quantity
            });
        }

        await cart.save();

        res.json({
            success: true,
            message: 'Item added to cart',
            cart: { items: cart.items }
        });
    } catch (err) {
        console.error('Add to cart error:', err);
        res.status(500).json({ success: false, error: 'Failed to add item' });
    }
});

// ========== UPDATE ITEM QUANTITY ==========
router.put('/update/:productId', authenticate, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity < 0) {
            return res.status(400).json({ success: false, error: 'Invalid quantity' });
        }

        const cart = await Cart.findOne({ user: req.userId });
        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found' });
        }

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not in cart' });
        }

        if (quantity === 0) {
            // Remove item if quantity is 0
            cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        } else {
            // Verify stock
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ success: false, error: 'Product not found' });
            }

            const availableStock = typeof product.stock === 'number' ? product.stock : (product.inventory?.quantity || 0);
            if (quantity > availableStock) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Only ${availableStock} item(s) in stock` 
                });
            }

            item.quantity = quantity;
        }

        await cart.save();

        res.json({
            success: true,
            message: 'Cart updated',
            cart: { items: cart.items }
        });
    } catch (err) {
        console.error('Update cart error:', err);
        res.status(500).json({ success: false, error: 'Failed to update cart' });
    }
});

// ========== REMOVE ITEM FROM CART ==========
router.delete('/remove/:productId', authenticate, async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.userId });
        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found' });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(i => i.productId.toString() !== productId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({ success: false, error: 'Item not in cart' });
        }

        await cart.save();

        res.json({
            success: true,
            message: 'Item removed from cart',
            cart: { items: cart.items }
        });
    } catch (err) {
        console.error('Remove from cart error:', err);
        res.status(500).json({ success: false, error: 'Failed to remove item' });
    }
});

// ========== CLEAR ENTIRE CART ==========
router.delete('/clear', authenticate, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({
            success: true,
            message: 'Cart cleared',
            cart: { items: [] }
        });
    } catch (err) {
        console.error('Clear cart error:', err);
        res.status(500).json({ success: false, error: 'Failed to clear cart' });
    }
});

// ========== VALIDATE CART STOCK BEFORE CHECKOUT ==========
router.post('/validate', authenticate, async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid items' });
        }

        const errors = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                errors.push({ productId: item.productId, error: 'Product not found' });
                continue;
            }

            const availableStock = typeof product.stock === 'number' ? product.stock : (product.inventory?.quantity || 0);
            if (availableStock < item.quantity) {
                errors.push({ 
                    productId: item.productId, 
                    productName: product.name || product.title,
                    error: `Only ${availableStock} item(s) available` 
                });
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        res.json({ success: true, message: 'Cart is valid' });
    } catch (err) {
        console.error('Validate cart error:', err);
        res.status(500).json({ success: false, error: 'Failed to validate cart' });
    }
});

module.exports = router;
