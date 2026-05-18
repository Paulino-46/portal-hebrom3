import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn(
    "MONGODB_URI is not set. The app will use sample data until you configure a MongoDB connection."
  );
}

const cached = globalThis.mongoose || { conn: null, promise: null };

globalThis.mongoose = cached;

async function dbConnect() {
  if (!uri) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName: "portal_hebrom3",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
