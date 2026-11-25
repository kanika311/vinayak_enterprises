"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cached = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;
const connectDatabase = async () => {
    if (cached.conn && mongoose_1.default.connection.readyState === 1)
        return cached.conn;
    if (mongoose_1.default.connection.readyState !== 1) {
        cached.conn = null;
        cached.promise = null;
    }
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/scientific_instruments';
    if (!cached.promise) {
        cached.promise = mongoose_1.default.connect(uri, {
            bufferCommands: true,
            maxPoolSize: 10,
            minPoolSize: 0,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 30000,
            family: 4,
        });
    }
    try {
        cached.conn = await cached.promise;
        console.log('MongoDB connected successfully');
        return cached.conn;
    }
    catch (error) {
        cached.promise = null;
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    cached.conn = null;
    cached.promise = null;
});
