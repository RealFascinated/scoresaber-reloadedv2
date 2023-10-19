import mongoose from "mongoose";

/**
 * Creates a connection to Mongo
 */
export function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;

  // Validate the mongo connection string
  if (!mongoUri || typeof mongoUri !== "string") {
    throw new Error("MONGO_URI is invalid");
  }

  // Check if mongoose is already connected
  if (mongoose.connection.readyState) {
    return;
  }

  // Connect to mongo
  return mongoose.connect(mongoUri);
}
