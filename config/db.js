/**
 * MongoDB Database Connection Configuration
 * Uses Mongoose for MongoDB object modeling
 * Includes auto-reconnect and keep-alive mechanisms
 */

const mongoose = require('mongoose');
const dns = require('dns');

// Use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Connection state tracking
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_INTERVAL = 5000; // 5 seconds

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Connection pool settings for better stability
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            // Keep connection alive
            heartbeatFrequencyMS: 10000,
        });

        isConnected = true;
        reconnectAttempts = 0;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err}`);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
            isConnected = false;
            // Attempt to reconnect
            handleReconnect();
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
            isConnected = true;
            reconnectAttempts = 0;
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        isConnected = false;
        handleReconnect();
    }
};

// Auto-reconnect mechanism
const handleReconnect = () => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('❌ Max reconnection attempts reached. Please check MongoDB connection.');
        return;
    }

    reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect to MongoDB (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);

    setTimeout(async () => {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('✅ MongoDB reconnected successfully');
            isConnected = true;
            reconnectAttempts = 0;
        } catch (error) {
            console.error(`❌ Reconnection failed: ${error.message}`);
            handleReconnect();
        }
    }, RECONNECT_INTERVAL);
};

// Check connection status
const isDBConnected = () => isConnected;

// Keep-alive ping to MongoDB (call this periodically)
const pingDB = async () => {
    if (!isConnected) {
        console.log('⚠️ Database not connected, skipping ping');
        return false;
    }

    try {
        await mongoose.connection.db.admin().ping();
        return true;
    } catch (error) {
        console.error('❌ MongoDB ping failed:', error.message);
        isConnected = false;
        handleReconnect();
        return false;
    }
};

module.exports = connectDB;
module.exports.isDBConnected = isDBConnected;
module.exports.pingDB = pingDB;
