const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load .env from root folder (one level up from /server)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// ─── Middleware ───────────────────────────────────────────────
// Enable CORS for frontend (React on port 5173)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/health', require('./routes/health'));

// Phase 2: Authentication
app.use('/api/auth', require('./routes/auth'));

// Phase 3: Carts, Products, Customers
app.use('/api/carts', require('./routes/carts'));
app.use('/api/products', require('./routes/products'));
app.use('/api/customers', require('./routes/customers'));

// Phase 4: Orders & Stock
app.use('/api/orders', require('./routes/orders'));
app.use('/api/stock', require('./routes/stock'));

// Phase 5: Billing System
app.use('/api/bills', require('./routes/bills'));

// Phase 6: Expense Tracking
app.use('/api/expenses', require('./routes/expenses'));

// Phase 7: Payment System
app.use('/api/payments', require('./routes/payments'));

// TODO (future phases):
// app.use('/api/reports',   require('./routes/reports'));

// ─── Error Handlers ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
