import mongoose from 'mongoose';

type Cached = {
	conn: any | null;
	promise: Promise<typeof mongoose> | null;
};

type Global = {
	mongoose?: Cached;
};

const MONGODB_URI = process.env.DB_CONNECTION_STRING;

if (!MONGODB_URI) {
	throw new Error(
		'Please define the DB_CONNECTION_STRING environment variable inside .env'
	);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as Global).mongoose as Cached;

if (!cached) {
	cached = (global as Global).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached?.conn) {
		return cached.conn;
	}

	if (!cached?.promise) {
		const opts = {
			bufferCommands: false
		};

		cached.promise = mongoose
			.connect(MONGODB_URI as string, opts)
			.then(mongoose => {
				return mongoose;
			});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}

export default dbConnect;
