/**
 * Seed script to add the UptimeRobot article
 */
require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const Article = require('./models/Article');

const seedArticle = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        const uptimeArticle = {
            title: {
                uz: 'UptimeRobot: Loyihangiz 24/7 ish holatida ekanligiga ishonch hosil qiling',
                en: 'UptimeRobot: Ensuring Your Projects Stay Online 24/7',
                ru: 'UptimeRobot: Убедитесь, что ваш проект онлайн 24/7'
            },
            content: {
                uz: "Har bir dasturchi uchun eng yomon narsa - bu uning loyihasi kutilmaganda 'down' bo'lishi (o'chib qolishi). Ayniqsa, Render yoki Heroku kabi bepul servislar foydalanilmaganda serverni 'uyquga' yuboradi.\n\nUptimeRobot aynan shu muammoni hal qiladi. U har 5 daqiqada (yoki siz belgilagan vaqtda) serveringizga so'rov yuboradi va uni faol ushlab turadi. Agar kutilmagan xatolik tufayli sayt ishlamay qolsa, sizga darhol Telegram, Email yoki SMS orqali xabar beradi.\n\nAsosiy afzalliklari:\n1. Bepul monitoring (50 tagacha monitor).\n2. HTTP(s), Ping, Port va Keyword monitoring turlari.\n3. Render kabi servislarda bepul tarifdagi 'uyqu' rejimini chetlab o'tish.\n4. Incidentlar tarixini saqlash.\n\nBu professional monitoring uchun eng qulay va ommabop vositadir.",
                en: "The worst nightmare for any developer is their project suddenly going offline. This is especially true for platforms like Render or Heroku, which put servers to 'sleep' when not in use.\n\nUptimeRobot solves this problem perfectly. It sends requests to your server every 5 minutes to keep it active. If your site goes down due to an unexpected error, it notifies you immediately via Telegram, Email, or SMS.\n\nKey Advantages:\n1. Free monitoring (up to 50 monitors).\n2. HTTP(s), Ping, Port, and Keyword monitoring types.\n3. Bypassing 'sleep' mode on free tiers of services like Render.\n4. Maintaining incident history.\n\nIt is the most convenient and popular tool for professional monitoring.",
                ru: "Худший кошмар любого разработчика — это когда его проект внезапно отключается. Это особенно актуально для таких платформ, как Render или Heroku, которые переводят серверы в режим «сна», когда они не используются.\n\nUptimeRobot идеально решает эту проблему. Он отправляет запросы на ваш сервер каждые 5 минут, чтобы поддерживать его активность. Если ваш сайт упадет из-за непредвиденной ошибки, он немедленно уведомит вас через Telegram, Email или SMS.\n\nОсновные преимущества:\n1. Бесплатный мониторинг (до 50 мониторов).\n2. Типы мониторинга HTTP(s), Ping, Port и Keyword.\n3. Обход режима «сна» на бесплатных тарифах таких сервисов, как Render.\n4. Сохранение истории инцидентов.\n\nЭто самый удобный и популярный инструмент для профессионального мониторинга."
            },
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
            status: 'published',
            commentsEnabled: true,
            views: 42,
            order: 1
        };

        // Check if article already exists to avoid duplicates
        const existing = await Article.findOne({ 'title.en': uptimeArticle.title.en });
        if (existing) {
            console.log('Article already exists, skipping.');
        } else {
            await Article.create(uptimeArticle);
            console.log('Article seeded successfully!');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding article:', error);
        process.exit(1);
    }
};

seedArticle();
