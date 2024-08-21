import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
  } catch (error) {
    throw new Error(error);
  }
};

export default connectMongo;
