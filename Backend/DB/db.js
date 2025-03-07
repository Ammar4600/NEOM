import { configDotenv } from "dotenv";
configDotenv();
import mongoose from "mongoose";


const connectDB = async () => {
    
    try {
        const MONGO_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGO_URI)
        console.log("MongoDB Connected...");
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export default connectDB;