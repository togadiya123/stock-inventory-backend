import mongoose from "mongoose";
const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI).then(() => {
            console.log("Database connected successfully");
        });
    } catch (error) {
        throw new Error(error);
    }
};

export { connectDatabase };
