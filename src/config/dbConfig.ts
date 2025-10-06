import mongoose from 'mongoose';
import { env } from './serverConfig';

export default async function connectDatabase() {
  if (!env.DB_URL) {
    throw new Error('MONGO_URL is Required in .env');
  }
  try {
    await mongoose.connect(env.DB_URL);
    console.log('Successfully connected to Database ✅');
  } catch (error) {
    console.error('Error while connecting to database ❌', error);
    process.exit(1); // exit process if DB connection fails
  }
}
