import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string || '', {
            dbName: process.env.MONGO_DB_NAME || 'food-delivery',
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

export default connectDB;
