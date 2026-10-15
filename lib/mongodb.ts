import "server-only";
import mongoose from "mongoose";
import { getRequiredEnv } from "@/lib/env";

const MONGODB_URI = getRequiredEnv("MONGODB_URI");

/**
 * In development Next.js reloads modules on every file change. Without caching
 * the connection we would open a brand new pool on each reload and quickly
 * exhaust the Atlas connection limit. We stash the connection on `globalThis`
 * so it survives those reloads.
 */
type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

const cache: MongooseCache =
  globalForMongoose._mongooseCache ?? { connection: null, promise: null };

globalForMongoose._mongooseCache = cache;

/**
 * Returns a shared Mongoose connection, opening one only if needed.
 * Call this at the start of any API route that touches the database.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.connection) {
    return cache.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cache.connection = await cache.promise;
  } catch (error) {
    // Reset so the next request can retry instead of caching a failed promise.
    cache.promise = null;
    throw error;
  }

  return cache.connection;
}
