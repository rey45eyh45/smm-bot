# SMM Bot Mini App

Telegram Mini App for SMM services - subscribers, likes, views for Telegram, Instagram, YouTube, TikTok.

## 🚀 Features

- 📱 Telegram Mini App integration
- 💰 Balance system with deposits
- 🛒 Order management
- 🎁 Referral system with bonuses
- 📊 Admin panel
- 🔌 SMM Panel API integration

## 🛠 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand

**Backend:**
- Express.js
- LowDB (JSON database)
- node-telegram-bot-api

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/your-username/smm-bot.git
cd smm-bot

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your settings
```

## ⚙️ Environment Variables

Create `server/.env`:

```env
# Telegram Bot Token
BOT_TOKEN=your_bot_token

# Admin Telegram ID
ADMIN_CHAT_ID=your_telegram_id

# Server port
PORT=3001

# Frontend URL
FRONTEND_URL=https://your-app.up.railway.app

# SMM Panel API
SMM_API_URL=https://smmworld.su/api/v2
SMM_API_KEY=your_api_key

# Referral settings
REFERRAL_BONUS=5000
REFERRAL_PERCENT=10
```

## 🚀 Deployment (Railway)

1. Connect GitHub repository to Railway
2. Add environment variables
3. Deploy!

### Backend service:
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

### Frontend service:
- Root Directory: `/`
- Build Command: `npm run build`
- Start Command: `npx serve dist`

## 📱 Bot Commands

- `/start` - Start bot
- `/balance` - Check balance
- `/orders` - View orders
- `/help` - Help

## 👨‍💼 Admin Panel

Access admin panel at `/admin` route.

## 📄 License

MIT
