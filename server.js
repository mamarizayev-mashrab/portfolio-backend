/**
 * Portfolio Backend Server
 * Express.js API with MongoDB
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const { pingDB } = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimit');
const compression = require('compression');
const helmet = require('helmet');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();
// ======================
// Middleware Configuration
// ======================

// 1. Manual CORS Headers (Fallback & Debug)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowed = [
        'https://www.asqarovich.uz',
        'https://asqarovich.uz',
        'http://localhost:5173',
        'http://localhost:3000'
    ];

    if (allowed.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else if (!origin) {
        // Allow mobile/server-to-server requests
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma, Expires');

    // Handle manual preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// 2. Standard CORS middleware with reflected origin
const corsOptions = {
    origin: true, // Reflect the request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Pragma', 'Expires'],
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 3. Security & Compression
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow images from other origins if needed
}));
app.use(compression());

// 4. Body parser (moved up)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. Trust proxy
app.set('trust proxy', 1);

// 4. Rate limiting (AFTER CORS)
app.use('/api', apiLimiter);

// Root route
app.get('/', (req, res) => {
    res.send('Portfolio API is running...');
});

// ======================
// API Routes
// ======================

// Health check endpoint (also used by keep-alive service)
app.get('/api/health', async (req, res) => {
    const dbStatus = await pingDB();
    res.status(200).json({
        success: true,
        message: 'Portfolio API is running',
        database: dbStatus ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/upload', require('./routes/upload'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// ======================
// Error Handling
// ======================

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join(', ')
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value entered'
        });
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Resource not found'
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// ======================
// Server Startup
// ======================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
    console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   🚀 Portfolio API Server                         ║
  ║                                                   ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
  ║   Port: ${PORT}                                      ║
  ║   API: http://localhost:${PORT}/api                  ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
  `);

    // Automatic Seeding for Admin
    try {
        const User = require('./models/User');
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
            console.log('Creating default admin user...');
            await User.create({
                email: adminEmail,
                password: adminPassword,
                name: 'Admin'
            });
            console.log('✅ Default admin user created successfully');
        } else {
            console.log('ℹ️ Admin user already exists');
        }
    } catch (error) {
        console.error('❌ Error during automatic seeding:', error.message);
    }

    // ======================
    // Keep-Alive Mechanism
    // ======================
    // Ping server every 14 minutes to prevent Render from sleeping
    const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000; // 14 minutes

    if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
        const keepAlive = async () => {
            try {
                const https = require('https');
                const url = `${process.env.RENDER_EXTERNAL_URL}/api/health`;

                https.get(url, (res) => {
                    console.log(`🏓 Keep-alive ping: ${res.statusCode} at ${new Date().toISOString()}`);
                }).on('error', (err) => {
                    console.error('❌ Keep-alive ping failed:', err.message);
                });
            } catch (error) {
                console.error('❌ Keep-alive error:', error.message);
            }
        };

        // Start keep-alive interval
        setInterval(keepAlive, KEEP_ALIVE_INTERVAL);
        console.log('🏓 Keep-alive mechanism started (every 14 minutes)');
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app;
