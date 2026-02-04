/**
 * Seed Admin User Script
 * Creates initial admin user and default settings
 * Run with: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Settings = require('../models/Settings');

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

        if (existingAdmin) {
            console.log('ℹ️ Admin user already exists');
        } else {
            // Create admin user
            const admin = await User.create({
                email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
                password: process.env.ADMIN_PASSWORD || 'Admin@123456',
                name: 'Admin'
            });
            console.log(`✅ Admin user created: ${admin.email}`);
        }

        // Check if settings exist
        const existingSettings = await Settings.findOne();

        if (existingSettings) {
            console.log('ℹ️ Settings already exist');
        } else {
            // Create default settings
            const settings = await Settings.create({
                siteName: 'My Portfolio',
                hero: {
                    name: {
                        uz: "Salom, men",
                        en: "Hi, I'm",
                        ru: "Привет, я"
                    },
                    title: {
                        uz: "Full-Stack Developer",
                        en: "Full-Stack Developer",
                        ru: "Full-Stack Разработчик"
                    },
                    subtitle: {
                        uz: "Zamonaviy veb-ilovalar yarataman",
                        en: "I build modern web applications",
                        ru: "Создаю современные веб-приложения"
                    },
                    typingTexts: {
                        uz: ["Frontend Developer", "Backend Developer", "UI/UX Designer"],
                        en: ["Frontend Developer", "Backend Developer", "UI/UX Designer"],
                        ru: ["Frontend Разработчик", "Backend Разработчик", "UI/UX Дизайнер"]
                    }
                },
                about: {
                    title: {
                        uz: "Men haqimda",
                        en: "About Me",
                        ru: "Обо мне"
                    },
                    content: {
                        uz: "Men professional full-stack dasturchiman. Zamonaviy texnologiyalar yordamida ajoyib veb-ilovalar yarataman.",
                        en: "I'm a professional full-stack developer. I create amazing web applications using modern technologies.",
                        ru: "Я профессиональный full-stack разработчик. Создаю потрясающие веб-приложения с использованием современных технологий."
                    }
                },
                theme: {
                    defaultMode: 'dark',
                    primaryColor: '#a855f7',
                    accentColor: '#06b6d4'
                }
            });
            console.log('✅ Default settings created');
        }

        console.log('\n🎉 Seed completed successfully!');
        console.log('-----------------------------------');
        console.log(`Admin Email: ${process.env.ADMIN_EMAIL || 'admin@portfolio.com'}`);
        console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('❌ Seed error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('📴 Disconnected from MongoDB');
        process.exit(0);
    }
};

seedAdmin();
