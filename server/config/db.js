const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`\n⚠️ Local MongoDB not running on 27017 (${error.message}).`);
    console.log(`🔄 Launching In-Memory MongoDB Server for instant development...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ In-Memory MongoDB Connected at ${mongoUri}`);

      // Seed initial sample data automatically
      const seedData = require('../seed');
      console.log('🌱 Seeding sample products & accounts...');
      await seedData(true);
      console.log('🚀 Ready to serve requests!\n');
    } catch (memErr) {
      console.error(`❌ In-Memory MongoDB start error: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
