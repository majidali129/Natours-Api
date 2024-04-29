import mongoose from 'mongoose';
import { DATABASE_NAME } from '../constants.js';

export const connectDB = async () => {
  try {
    const db = process.env.MONGODB_URL.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    ).replace('<DBNAME>', DATABASE_NAME);
    console.log(db);
    const connectionInstance = await mongoose.connect(db);
    console.log(
      `\n MongoDB Connected 🚀🚀 DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log('MONGODB connection ERROR::', error);
    process.exit(1);
  }
};
