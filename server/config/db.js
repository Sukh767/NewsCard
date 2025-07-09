import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected successfully'.green);
  } catch (error) {
    console.error('MongoDB connection error:'.red, error.message);
    process.exit(1);
  }
};

export default connectDB;
