const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Cart = require('./models/Cart');
const Product = require('./models/Product');
const Stock = require('./models/Stock');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedInitialData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding Initial Data...');

    // Delete existing to avoid conflicts
    await Cart.deleteMany({});
    await Product.deleteMany({});
    await Stock.deleteMany({});

    // 1. Create Carts
    const carts = await Cart.insertMany([
      { name: 'Main Center Cart', location: 'City Square', isActive: true },
      { name: 'Station Road Cart', location: 'Railway Station', isActive: true },
      { name: 'City Mall Cart', location: 'Basement Exit', isActive: true },
    ]);
    console.log('Carts created:', carts.length);

    // 2. Create Products
    const products = await Product.insertMany([
      { name: 'Regular Pani Puri (6 pcs)', category: 'Pani Puri', price: 20, unit: 'Plate' },
      { name: 'Cheese Pani Puri (6 pcs)', category: 'Pani Puri', price: 50, unit: 'Plate' },
      { name: 'Butter Pani Puri (6 pcs)', category: 'Pani Puri', price: 40, unit: 'Plate' },
      { name: 'Cold Drink (200ml)', category: 'Drinks', price: 20, unit: 'Glass' },
      { name: 'Extra Masaala', category: 'Other', price: 5, unit: 'Piece' }
    ]);
    console.log('Products created:', products.length);

    // 3. Initialize Stock for each cart-product pair
    const stockEntries = [];
    for (const cart of carts) {
      for (const product of products) {
        stockEntries.push({
          cart: cart._id,
          product: product._id,
          currentQuantity: 100, // Pre-fill with some stock
          lowStockThreshold: 10,
          history: [{
             type: 'Add',
             quantity: 100,
             notes: 'Initial Seeding'
          }]
        });
      }
    }
    await Stock.insertMany(stockEntries);
    console.log('Stock initialized for all carts.');

    console.log('--- SEEDING COMPLETE ---');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedInitialData();
