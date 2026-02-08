require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// Sample products data
const products = [
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.',
        price: 79.99,
        category: 'Electronics',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        rating: 4.5,
        numReviews: 128
    },
    {
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracker with heart rate monitor, GPS, and waterproof design.',
        price: 199.99,
        category: 'Electronics',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
        rating: 4.7,
        numReviews: 95
    },
    {
        name: 'Laptop Backpack',
        description: 'Durable water-resistant backpack with padded laptop compartment and USB charging port.',
        price: 49.99,
        category: 'Other',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
        rating: 4.3,
        numReviews: 67
    },
    {
        name: 'Wireless Gaming Mouse',
        description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
        price: 59.99,
        category: 'Electronics',
        stock: 75,
        images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'],
        rating: 4.6,
        numReviews: 142
    },
    {
        name: 'Running Shoes',
        description: 'Lightweight breathable running shoes with cushioned sole for maximum comfort.',
        price: 89.99,
        category: 'Sports',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        rating: 4.4,
        numReviews: 89
    },
    {
        name: 'Yoga Mat',
        description: 'Non-slip eco-friendly yoga mat with carrying strap, perfect for all types of yoga.',
        price: 29.99,
        category: 'Sports',
        stock: 120,
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
        rating: 4.2,
        numReviews: 54
    },
    {
        name: 'Stainless Steel Water Bottle',
        description: 'Insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours.',
        price: 24.99,
        category: 'Sports',
        stock: 150,
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'],
        rating: 4.8,
        numReviews: 203
    },
    {
        name: 'Classic T-Shirt',
        description: '100% cotton comfortable t-shirt available in multiple colors.',
        price: 19.99,
        category: 'Clothing',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        rating: 4.1,
        numReviews: 76
    },
    {
        name: 'Denim Jeans',
        description: 'Classic fit denim jeans with stretch fabric for comfort and style.',
        price: 59.99,
        category: 'Clothing',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
        rating: 4.5,
        numReviews: 112
    },
    {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe and auto-brew feature.',
        price: 79.99,
        category: 'Home & Kitchen',
        stock: 45,
        images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'],
        rating: 4.6,
        numReviews: 134
    },
    {
        name: 'Cookbook: Healthy Meals',
        description: 'Comprehensive cookbook with 200+ healthy and delicious recipes.',
        price: 24.99,
        category: 'Books',
        stock: 90,
        images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
        rating: 4.7,
        numReviews: 87
    },
    {
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with touch control and USB charging port.',
        price: 34.99,
        category: 'Home & Kitchen',
        stock: 65,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'],
        rating: 4.4,
        numReviews: 98
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        console.log('Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            isAdmin: true
        });
        console.log('Admin user created:', adminUser.email);

        // Create regular user
        const regularUser = await User.create({
            name: 'John Doe',
            email: 'user@example.com',
            password: 'user123',
            isAdmin: false
        });
        console.log('Regular user created:', regularUser.email);

        // Create products
        await Product.insertMany(products);
        console.log(`${products.length} products created`);

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('Admin - Email: admin@example.com | Password: admin123');
        console.log('User  - Email: user@example.com | Password: user123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
