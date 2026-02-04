/**
 * Settings Model - Site-wide settings
 * Stores i18n content, theme settings, and social links
 */

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Site name/title
    siteName: {
        type: String,
        default: 'Portfolio'
    },

    // Hero section content
    hero: {
        name: {
            uz: { type: String, default: "Salom, men" },
            en: { type: String, default: "Hi, I'm" },
            ru: { type: String, default: "Привет, я" }
        },
        title: {
            uz: { type: String, default: "Full-Stack Developer" },
            en: { type: String, default: "Full-Stack Developer" },
            ru: { type: String, default: "Full-Stack Разработчик" }
        },
        subtitle: {
            uz: { type: String, default: "Zamonaviy veb-ilovalar yarataman" },
            en: { type: String, default: "I build modern web applications" },
            ru: { type: String, default: "Создаю современные веб-приложения" }
        },
        typingTexts: {
            uz: [{ type: String }],
            en: [{ type: String }],
            ru: [{ type: String }]
        }
    },

    // About section content
    about: {
        title: {
            uz: { type: String, default: "Men haqimda" },
            en: { type: String, default: "About Me" },
            ru: { type: String, default: "Обо мне" }
        },
        content: {
            uz: { type: String, default: "" },
            en: { type: String, default: "" },
            ru: { type: String, default: "" }
        },
        image: { type: String, default: "" }
    },

    // Section titles
    sectionTitles: {
        skills: {
            uz: { type: String, default: "Ko'nikmalar" },
            en: { type: String, default: "Skills" },
            ru: { type: String, default: "Навыки" }
        },
        projects: {
            uz: { type: String, default: "Loyihalar" },
            en: { type: String, default: "Projects" },
            ru: { type: String, default: "Проекты" }
        },
        experience: {
            uz: { type: String, default: "Tajriba" },
            en: { type: String, default: "Experience" },
            ru: { type: String, default: "Опыт" }
        },
        contact: {
            uz: { type: String, default: "Bog'lanish" },
            en: { type: String, default: "Contact" },
            ru: { type: String, default: "Контакты" }
        }
    },

    // Contact section
    contact: {
        title: {
            uz: { type: String, default: "Bog'lanish" },
            en: { type: String, default: "Get in Touch" },
            ru: { type: String, default: "Связаться" }
        },
        description: {
            uz: { type: String, default: "Men bilan bog'laning" },
            en: { type: String, default: "Feel free to reach out" },
            ru: { type: String, default: "Свяжитесь со мной" }
        },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: {
            uz: { type: String, default: "" },
            en: { type: String, default: "" },
            ru: { type: String, default: "" }
        }
    },

    // Social links
    social: {
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        telegram: { type: String, default: "" },
        instagram: { type: String, default: "" }
    },

    // Theme settings
    theme: {
        defaultMode: {
            type: String,
            enum: ['dark', 'light'],
            default: 'dark'
        },
        primaryColor: { type: String, default: '#a855f7' },
        accentColor: { type: String, default: '#06b6d4' }
    },

    // Resume/CV link
    resumeUrl: {
        type: String,
        default: ''
    },

    // Footer text
    footer: {
        text: {
            uz: { type: String, default: "© 2024. Barcha huquqlar himoyalangan." },
            en: { type: String, default: "© 2024. All rights reserved." },
            ru: { type: String, default: "© 2024. Все права защищены." }
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
