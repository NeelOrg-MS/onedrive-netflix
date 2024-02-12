import mongoose from 'mongoose'

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      dbName: process.env.DB_NAME,
    }

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!, opts)
      .then((mongoose) => {
        return mongoose
      })
      .catch((err) => {
        throw err
      })
  }
  cached.conn = await cached.promise
  console.log('DB Connected Successfully!')
  return cached.conn
}

export default connectDB
