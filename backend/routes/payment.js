const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Order, Product } = require('../models');
const { authenticate, optionalAuth, adminOnly } = require('../middleware/auth');

// ========== EMAIL CONFIGURATION ==========
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
    }
});

// ========== SSLCOMMERZ CONFIGURATION ==========
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID || 'tuavec';
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD || 'test-password';
const SSLCOMMERZ_API = process.env.NODE_ENV === 'production'
    ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
    : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

// ========== INITIALIZE PAYMENT (SSLCommerz) ==========
router.post('/initialize', optionalAuth, async (req, res) => {
    try {
        const { orderId } = req.body;

        // Fetch order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        if (order.paymentStatus !== 'pending') {
            return res.status(400).json({ success: false, error: 'Order already paid' });
        }

        // Prepare SSLCommerz payload
        const postData = {
            store_id: STORE_ID,
            store_passwd: STORE_PASSWORD,
            total_amount: order.totalAmount,
            currency: 'BDT',
            tran_id: `TUAVEC-${order._id}-${Date.now()}`,
            success_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/success`,
            fail_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/fail`,
            cancel_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/cancel`,
            ipn_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/ipn`,
            cus_name: order.customer.name,
            cus_email: order.customer.email,
            cus_phone: order.customer.phone,
            cus_add1: order.shippingAddress.address,
            cus_city: order.shippingAddress.city,
            cus_state: order.shippingAddress.region,
            cus_country: 'Bangladesh',
            shipping_method: 'Courier',
            product_name: order.items.map(i => i.name).join(', '),
            product_category: 'General',
            product_profile: 'general'
        };

        // Save transaction ID
        order.paymentDetails = order.paymentDetails || {};
        order.paymentDetails.transactionId = postData.tran_id;
        await order.save();

        // Send to SSLCommerz
        const response = await axios.post(SSLCOMMERZ_API, postData);

        if (response.data.status === 'SUCCESS') {
            res.json({
                success: true,
                redirectURL: response.data.GatewayPageURL
            });
        } else {
            res.status(400).json({
                success: false,
                error: response.data.failedreason || 'Payment initialization failed'
            });
        }
    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({ success: false, error: 'Failed to initialize payment' });
    }
});

// ========== PAYMENT SUCCESS ==========
router.post('/success', async (req, res) => {
    try {
        const {
            tran_id,
            status,
            value_a,
            card_brand,
            card_type
        } = req.body;

        console.log('✅ Payment Success:', { tran_id, status });

        // Find order by transaction ID
        const order = await Order.findOne({ 'paymentDetails.transactionId': tran_id });

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        if (status === 'VALID' || status === 'PAID') {
            // Update order
            order.paymentStatus = 'paid';
            order.paymentDetails.cardBrand = card_brand;
            order.paymentDetails.cardType = card_type;
            order.orderStatus = 'confirmed';

            // Add timeline entry
            order.timeline.push({
                status: 'Payment received',
                message: `Payment confirmed via ${card_type}`,
                timestamp: new Date()
            });

            await order.save();

            // Reduce product stock
            for (const item of order.items) {
                await Product.updateOne(
                    { _id: item.product },
                    { $inc: { stock: -item.quantity, 'inventory.quantity': -item.quantity } }
                );
            }

            // Send confirmation emails
            await sendOrderConfirmationEmail(order);

            // Redirect to success page
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-success.html?orderId=${order._id}`);
        } else {
            order.paymentStatus = 'failed';
            await order.save();

            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-failed.html?orderId=${order._id}`);
        }
    } catch (error) {
        console.error('Payment success error:', error);
        res.status(500).json({ success: false, error: 'Payment processing error' });
    }
});

// ========== PAYMENT FAIL ==========
router.post('/fail', async (req, res) => {
    try {
        const { tran_id } = req.body;

        const order = await Order.findOne({ 'paymentDetails.transactionId': tran_id });

        if (order) {
            order.paymentStatus = 'failed';
            await order.save();
        }

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-failed.html?orderId=${order?._id || 'unknown'}`);
    } catch (error) {
        console.error('Payment fail error:', error);
        res.status(500).json({ success: false, error: 'Payment processing error' });
    }
});

// ========== PAYMENT CANCEL ==========
router.post('/cancel', async (req, res) => {
    try {
        const { tran_id } = req.body;

        const order = await Order.findOne({ 'paymentDetails.transactionId': tran_id });

        if (order) {
            order.paymentStatus = 'pending';
            await order.save();
        }

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout.html`);
    } catch (error) {
        console.error('Payment cancel error:', error);
        res.status(500).json({ success: false, error: 'Payment processing error' });
    }
});

// ========== INSTANT PAYMENT NOTIFICATION (IPN) ==========
router.post('/ipn', async (req, res) => {
    try {
        const {
            tran_id,
            status,
            amount,
            currency
        } = req.body;

        console.log('📬 IPN Received:', { tran_id, status, amount });

        // Verify with SSLCommerz
        const verifyData = {
            store_id: STORE_ID,
            store_passwd: STORE_PASSWORD,
            tran_id: tran_id
        };

        const verifyResponse = await axios.post(
            `${SSLCOMMERZ_API}?query=queryTransactionQueryRequest`,
            verifyData
        );

        if (verifyResponse.data[0].status === 'VALID') {
            const order = await Order.findOne({ 'paymentDetails.transactionId': tran_id });

            if (order && order.paymentStatus !== 'paid') {
                order.paymentStatus = 'paid';
                order.orderStatus = 'confirmed';
                order.timeline.push({
                    status: 'Payment confirmed',
                    message: 'Payment verified via IPN'
                });

                await order.save();

                // Reduce stock
                for (const item of order.items) {
                    await Product.updateOne(
                        { _id: item.product },
                        { $inc: { stock: -item.quantity, 'inventory.quantity': -item.quantity } }
                    );
                }

                // Send email
                await sendOrderConfirmationEmail(order);
            }
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('IPN error:', error);
        res.status(500).json({ success: false, error: 'IPN processing error' });
    }
});

// ========== EMAIL NOTIFICATION HELPER ==========
async function sendOrderConfirmationEmail(order) {
    try {
        const itemsHTML = order.items.map(item => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 12px;">${item.name}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">৳${item.price}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">৳${item.price * item.quantity}</td>
            </tr>
        `).join('');

        // Email to customer
        await emailTransporter.sendMail({
            from: process.env.GMAIL_USER,
            to: order.customer.email,
            subject: `✅ Order Confirmation - ${order.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Order Confirmed!</h2>
                    <p>Thank you for your order. We're preparing your items for shipment.</p>
                    
                    <h3>Order Details</h3>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    
                    <h3>Items</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background-color: #f5f5f5;">
                            <th style="border: 1px solid #ddd; padding: 12px;">Product</th>
                            <th style="border: 1px solid #ddd; padding: 12px;">Price</th>
                            <th style="border: 1px solid #ddd; padding: 12px;">Qty</th>
                            <th style="border: 1px solid #ddd; padding: 12px;">Total</th>
                        </tr>
                        ${itemsHTML}
                    </table>
                    
                    <h3>Order Summary</h3>
                    <p>Subtotal: ৳${order.subtotal}</p>
                    <p>Shipping: ৳${order.shippingCost}</p>
                    <p><strong>Total: ৳${order.totalAmount}</strong></p>
                    
                    <h3>Shipping Address</h3>
                    <p>${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.region}</p>
                    
                    <p style="margin-top: 30px; color: #666; font-size: 12px;">
                        You'll receive tracking information as soon as your order ships.
                    </p>
                </div>
            `
        });

        // Email to admin
        await emailTransporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
            subject: `📦 New Order - ${order.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>New Order Received!</h2>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Customer:</strong> ${order.customer.name}</p>
                    <p><strong>Phone:</strong> ${order.customer.phone}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    <p><strong>Total Amount:</strong> ৳${order.totalAmount}</p>
                    
                    <h3>Shipping Address</h3>
                    <p>${order.shippingAddress.address}</p>
                    <p>${order.shippingAddress.city}, ${order.shippingAddress.region}</p>
                    
                    <p><a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/orders/${order._id}">View Order Details</a></p>
                </div>
            `
        });

        console.log(`✅ Confirmation emails sent for order ${order.orderNumber}`);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
}

// ========== GET ORDER STATUS (FOR CUSTOMERS) ==========
router.get('/:orderId/status', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .select('orderNumber orderStatus paymentStatus timeline courier estimatedDelivery');

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.json({
            success: true,
            order: {
                orderNumber: order.orderNumber,
                status: order.orderStatus,
                paymentStatus: order.paymentStatus,
                courier: order.courier,
                estimatedDelivery: order.estimatedDelivery,
                timeline: order.timeline
            }
        });
    } catch (error) {
        console.error('Error fetching order status:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch order status' });
    }
});

module.exports = router;
