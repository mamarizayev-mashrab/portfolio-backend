# Portfolio Backend API

Ushbu repozitoriy Portfolio loyihasining backend qismini o'z ichiga oladi. U Node.js, Express va MongoDB yordamida qurilgan RESTful API hisoblanadi.

## 🚀 Xususiyatlar

*   **RESTful API:** Barcha resurslar (loyihalar, ko'nikmalar, tajribalar, xabarlar) uchun to'liq CRUD amallari.
*   **MongoDB & Mongoose:** Ma'lumotlar bazasi bilan ishlash uchun qulay schema va modellar.
*   **JWT Autentifikatsiya:** Admin panel uchun himoyalangan kirish tizimi (Access Token).
*   **Xavfsizlik:** `helmet`, `cors`, `express-rate-limit`, `xss-clean`, `hpp` kabi xavfsizlik choralarini o'z ichiga oladi.
*   **Fayl Yuklash:** Base64 yoki Cloudinary (sozlanishi mumkin) orqali rasm yuklash.
*   **Email Xabarnomalar:** Kontakt formasidan kelgan xabarlarni emailga yuborish (nodemailer).
*   **Loglash:** Xatoliklar va so'rovlarni kuzatish.

## 🛠️ Texnologiyalar

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB
*   **Auth:** JSON Web Token (JWT), bcryptjs

## 📦 O'rnatish va Ishga Tushirish

1.  **Repozitoriyni klonlash:**
    ```bash
    git clone https://github.com/mamarizayev-mashrab/portfolio-backend.git
    cd backend
    ```

2.  **Kutubxonalarni o'rnatish:**
    ```bash
    npm install
    ```

3.  **Muhit o'zgaruvchilarini sozlash:**
     `.env` faylini yarating va `.env.example` dagi namuna asosida to'ldiring:
    ```env
    PORT=5000
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio
    JWT_SECRET=maxfiy_kalit_so'z
    JWT_EXPIRE=30d
    NODE_ENV=development
    ```

4.  **Admin user yaratish (Seeding):**
    Ma'lumotlar bazasiga boshlang'ich admin va ma'lumotlarni yozish uchun:
    ```bash
    npm run seed
    ```
    *Default Admin:* `admin@portfolio.com` / `Admin@123456`

5.  **Serverni ishga tushirish:**
    ```bash
    npm run dev  # Development rejimi (nodemon bilan)
    # yoki
    npm start    # Production rejimi
    ```

## 🌐 API Endpoints

| Metod | Yo'l | Ruxsat | Tavsif |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| `POST` | `/api/auth/login` | Public | Admin sifatida kirish |
| `GET` | `/api/auth/me` | Admin | Joriy admin ma'lumotlari |
| `POST` | `/api/auth/change-password` | Admin | Parolni o'zgartirish |
| **Projects** | | | |
| `GET` | `/api/projects` | Public | Barcha loyihalar |
| `POST` | `/api/projects` | Admin | Yangi loyiha qo'shish |
| `PUT` | `/api/projects/:id` | Admin | Loyihani tahrirlash |
| `DELETE` | `/api/projects/:id` | Admin | Loyihani o'chirish |
| **Skills** | | | |
| `GET` | `/api/skills` | Public | Ko'nikmalar ro'yxati |
| `POST` | `/api/skills` | Admin | Yangi ko'nikma qo'shish |
| `DELETE`| `/api/skills/:id` | Admin | Ko'nikmani o'chirish |
| **Settings** | | | |
| `GET` | `/api/settings` | Public | Sayt sozlamalari (Theme, Socials) |
| `PUT` | `/api/settings` | Admin | Sozlamalarni yangilash |

## 🚀 Deploy (Render.com)

1.  Render.com saytida yangi **Web Service** yarating.
2.  GitHub repozitoriyni ulang.
3.  **Build Command:** `npm install`
4.  **Start Command:** `npm start`
5.  **Environment Variables:** `.env` dagi o'zgaruvchilarni kiriting (`MONGODB_URI`, `JWT_SECRET`, h.k).

## 📄 Litsenziya

MIT
