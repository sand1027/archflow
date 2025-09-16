import connectDB from './mongodb';
import * as models from './models';

// Initialize database connection
const initDB = async () => {
  await connectDB();
  return models;
};

export default initDB;
export * from './models';
