import mongoose from 'mongoose';
import { DB_URL } from './serverConfig';

export default async function connectDatabase() {
  if (!DB_URL) {
    throw new Error('MONGO_URL is Required in .env');
  }
  try {
    await mongoose.connect(DB_URL);
    console.log('Successfully connected to Database ✅');
  } catch (error) {
    console.error('Error while connecting to database ❌', error);
    process.exit(1); // exit process if DB connection fails
  }
}
