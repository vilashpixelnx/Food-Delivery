const path = require('path');
const app = require('./app');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load .env from root folder (one level up from /server)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB then start server ─────────────────────
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log('─────────────────────────────────────────');
      console.log(`🚀 Server running on port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
      console.log('─────────────────────────────────────────');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
