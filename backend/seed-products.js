#!/usr/bin/env node
/**
 * Tu Avec Product Seeding Script
 * Run: node seed-products.js
 * This script seeds the database with sample products for launch
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Product, Category } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tuavec';

// Sample products - Premium Thai imports
const sampleProducts = [
    // Electronics Accessories
    {
        name: 'Premium Thai Phone Case',
        slug: 'premium-thai-phone-case',
        description: 'High-quality protective phone case with traditional Thai patterns. Durable silicone material with premium finish.',
        shortDescription: 'Traditional Thai design phone case',
        category: 'Electronics Accessories',
        subcategory: 'Phone Cases',
        brand: 'Thai Craft Co.',
        price: 450,
        comparePrice: 650,
        cost: 180,
        stock: 50,
        images: [
            {
                url: 'https://via.placeholder.com/500x500?text=Thai+Phone+Case',
                alt: 'Thai Phone Case',
                isPrimary: true
            }
        ],
        inventory: { quantity: 50, sku: 'PHONE-CASE-001', trackInventory: true },
        attributes: [
            { name: 'Material', value: 'Silicone' },
            { name: 'Model', value: 'Universal' }
        ],
        tags: ['phone', 'case', 'thai', 'protection'],
        weight: 50,
        seoTitle: 'Premium Thai Phone Case - Tu Avec',
        seoDescription: 'Authentic Thai designed phone case. Protective, stylish, and durable.',
        featured: true,
        status: 'active',
        salesCount: 0,
        views: 0,
        rating: 0,
        reviewCount: 0
    },
    {
        name: 'Thai USB-C Fast Charger',
        slug: 'thai-usbc-fast-charger',
        description: 'High-speed USB-C charger certified by Thai Electronics Authority. Compatible with all USB-C devices.',
        shortDescription: '65W USB-C fast charger',
        category: 'Electronics Accessories',
        subcategory: 'Chargers',
        brand: 'Thai Tech Pro',
        price: 1200,
        comparePrice: 1800,
        cost: 400,
        stock: 30,
        images: [
            {
                url: 'https://via.placeholder.com/500x500?text=USB-C+Charger',
                alt: 'USB-C Charger',
                isPrimary: true
            }
        ],
        inventory: { quantity: 30, sku: 'CHARGER-001', trackInventory: true },
        tags: ['charger', 'usb-c', 'fast', 'thai'],
        weight: 200,
        featured: true,
        status: 'active'
    },
    // Beauty & Skincare
    {
        name: 'Thai Turmeric Face Mask',
        slug: 'thai-turmeric-face-mask',
        description: 'Natural turmeric-based face mask from Thailand. Rich in antioxidants, brightens and rejuvenates skin.',
        shortDescription: 'Organic turmeric face mask - 100g',
        category: 'Beauty & Skincare',
        subcategory: 'Face Masks',
        brand: 'Thai Beauty Naturals',
        price: 350,
        comparePrice: 500,
        cost: 120,
        stock: 100,
        images: [
            {
                url: 'https://via.placeholder.com/500x500?text=Turmeric+Mask',
                alt: 'Turmeric Mask',
                isPrimary: true
            }
        ],
        inventory: { quantity: 100, sku: 'MASK-001', trackInventory: true },
        attributes: [
            { name: 'Size', value: '100g' },
            { name: 'Type', value: 'Turmeric' }
        ],
        tags: ['skincare', 'turmeric', 'face-mask', 'organic', 'thai'],
        weight: 150,
        featured: true,
        status: 'active'
    },
    {
        name: 'Thai Herbal Body Lotion',
        slug: 'thai-herbal-body-lotion',
        description: 'Moisturizing body lotion with Thai herbs and natural oils. Soft, fragrant, and nourishing.',
        shortDescription: 'Herbal body lotion - 250ml',
        category: 'Beauty & Skincare',
        subcategory: 'Body Care',
        brand: 'Thai Essence',
        price: 280,
        comparePrice: 400,
        cost: 100,
        stock: 80,
        images: [
            {
                url: 'https://via.placeholder.com/500x500?text=Body+Lotion',
                alt: 'Body Lotion',
                isPrimary: true
            }
        ],
        inventory: { quantity: 80, sku: 'LOTION-001', trackInventory: true },
        tags: ['lotion', 'herbal', 'skincare', 'thai'],
        weight: 300,
        status: 'active'
    },
    // Food & Beverages
    {
        name: 'Thai Premium Coffee Beans',
        slug: 'thai-premium-coffee-beans',
        description: 'High-altitude Arabica coffee beans from Thailand\'s northern highlands. Smooth, rich flavor with chocolate notes.',
        shortDescription: 'Specialty coffee beans - 500g',
        category: 'Food & Beverages',
        subcategory: 'Coffee',
        brand: 'Thai Highland Coffee',
        price: 650,
        comparePrice: 950,
        cost: 250,
        stock: 40,
        images: [
            {
                url: 'https://via.placeholder.com/500x500?text=Coffee+Beans',
                alt: 'Coffee Beans',
                isPrimary: true
            }
        ],
        inventory: { quantity: 40, sku: 'COFFEE-001', trackInventory: true },
        attributes: [
            { name: 'Weight', value: '500g' },
            { name: 'Roast', value: 'Medium' }
        ],
        tags: ['coffee', 'arabica', 'thai', 'premium'],
        weight: 600,
        featured: true,
        status: 'active'
    },
    {
        name: 'Thai Green Tea (20 bags)',
        slug: 'thai-green-tea',
        description: 'Authentic Thai green tea with jasmine flavor. Antioxidant-rich and refreshing.',
        shortDescription: 'Jasmine green tea - 20 bags',
        category: 'Food & Beverages',
        subcategory: 'Tea',
        brand: 'Thai Tea Master',
        price: 220,
        comparePrice: 320,
        cost: 80,
        stock: 60,
        images: [
            {
                url: 'https://via.placeholder.com/500x500?text=Green+Tea',
                alt: 'Green Tea',
                isPrimary: true
            }
        ],
        inventory: { quantity: 60, sku: 'TEA-001', trackInventory: true },
        tags: ['tea', 'green-tea', 'jasmine', 'thai'],
        weight: 100,
        status: 'active'
    },
    // Textiles & Fashion
    {
        name: 'Traditional Thai Silk Scarf',
        slug: 'thai-silk-scarf',
        description: 'Hand-woven authentic Thai silk scarf with intricate traditional patterns. Soft, luxurious, and versatile.',
        shortDescription: '100% Thai silk scarf',
        category: 'Textiles & Fashion',
        subcategory: 'Scarves',
        brand: 'Thai Artisan Silk',
        price: 1500,
        comparePrice: 2200,
        cost: 600,
        stock: 25,
        images: [
            {
                url: 'https://via.placeholder.com/500x500?text=Thai+Silk+Scarf',
                alt: 'Thai Silk Scarf',
                isPrimary: true
            }
        ],
        inventory: { quantity: 25, sku: 'SCARF-001', trackInventory: true },
        attributes: [
            { name: 'Material', value: '100% Silk' },
            { name: 'Size', value: '180x90cm' }
        ],
        tags: ['scarf', 'silk', 'thai', 'fashion', 'artisan'],
        weight: 80,
        featured: true,
        status: 'active'
    },
    {
        name: 'Thai Cotton T-Shirt',
        slug: 'thai-cotton-tshirt',
        description: 'Comfortable 100% cotton t-shirt with Thai cultural print. Breathable and perfect for warm weather.',
        shortDescription: 'Printed cotton t-shirt',
        category: 'Textiles & Fashion',
        subcategory: 'Clothing',
        brand: 'Thai Cotton Co.',
        price: 380,
        comparePrice: 550,
        cost: 140,
        stock: 120,
        images: [
            {
                url: 'https://via.placeholder.com/500x500?text=Cotton+TShirt',
                alt: 'Cotton T-Shirt',
                isPrimary: true
            }
        ],
        inventory: { quantity: 120, sku: 'TSHIRT-001', trackInventory: true },
        variants: [
            {
                name: 'Size',
                options: ['S', 'M', 'L', 'XL'],
                priceModifier: 0
            }
        ],
        tags: ['tshirt', 'cotton', 'thai', 'clothing'],
        weight: 200,
        status: 'active'
    },
    // Home Decor
    {
        name: 'Thai Bamboo Wind Chimes',
        slug: 'thai-bamboo-wind-chimes',
        description: 'Hand-crafted bamboo wind chimes with traditional Thai design. Creates soothing sounds.',
        shortDescription: 'Bamboo wind chimes',
        category: 'Home Decor',
        subcategory: 'Decor',
        brand: 'Thai Crafts Village',
        price: 520,
        comparePrice: 750,
        cost: 200,
        stock: 35,
        images: [
            {
                url: 'https://via.placeholder.com/500x500?text=Wind+Chimes',
                alt: 'Wind Chimes',
                isPrimary: true
            }
        ],
        inventory: { quantity: 35, sku: 'WINDCHIMES-001', trackInventory: true },
        tags: ['decor', 'bamboo', 'wind-chimes', 'thai'],
        weight: 300,
        status: 'active'
    },
    {
        name: 'Thai Ceramic Plant Pot',
        slug: 'thai-ceramic-plant-pot',
        description: 'Handmade ceramic plant pot with traditional Thai patterns. Perfect for indoor plants.',
        shortDescription: 'Ceramic plant pot - 20cm',
        category: 'Home Decor',
        subcategory: 'Plant Pots',
        brand: 'Thai Pottery Works',
        price: 420,
        comparePrice: 600,
        cost: 160,
        stock: 50,
        images: [
            {
                url: 'https://via.placeholder.com/500x500?text=Plant+Pot',
                alt: 'Plant Pot',
                isPrimary: true
            }
        ],
        inventory: { quantity: 50, sku: 'POT-001', trackInventory: true },
        tags: ['pot', 'ceramic', 'plant', 'thai', 'decor'],
        weight: 800,
        status: 'active'
    },
    // Herbal & Wellness
    {
        name: 'Thai Herbal Supplement Mix',
        slug: 'thai-herbal-supplement',
        description: 'Traditional Thai herbal blend with turmeric, ginger, and lemongrass. Supports wellness and immunity.',
        shortDescription: 'Herbal mix - 200g',
        category: 'Herbal & Wellness',
        subcategory: 'Supplements',
        brand: 'Thai Wellness Pro',
        price: 380,
        comparePrice: 550,
        cost: 140,
        stock: 70,
        images: [
            {
                url: 'https://via.placeholder.com/500x500?text=Herbal+Mix',
                alt: 'Herbal Mix',
                isPrimary: true
            }
        ],
        inventory: { quantity: 70, sku: 'HERBAL-001', trackInventory: true },
        tags: ['herbal', 'supplement', 'turmeric', 'wellness', 'thai'],
        weight: 250,
        status: 'active'
    }
];

async function seedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        const deletedCount = await Product.deleteMany({});
        console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing products`);

        // Insert sample products
        const inserted = await Product.insertMany(sampleProducts);
        console.log(`✅ Inserted ${inserted.length} sample products`);

        // Show summary
        console.log('\n📊 Product Summary:');
        const byCategory = {};
        inserted.forEach(product => {
            byCategory[product.category] = (byCategory[product.category] || 0) + 1;
        });

        Object.entries(byCategory).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count} products`);
        });

        console.log('\n✨ Seeding complete!');
        console.log('💡 Your products are ready to sell on Tu Avec');
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the seeding
seedProducts();
