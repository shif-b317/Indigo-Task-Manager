const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGODB_URI;

    if (!dbUrl) {
      console.log('No MONGODB_URI found in environment variables.');
      console.log('Spinning up an in-memory MongoDB instance for seamless local execution...');
      mongod = await MongoMemoryServer.create();
      dbUrl = mongod.getUri();
      console.log(`In-memory MongoDB started at: ${dbUrl}`);
    }

    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('Error disconnecting database:', error);
  }
};

module.exports = { connectDB, disconnectDB };
