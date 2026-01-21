import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import database from './database.js'
import { v4 as uuidv4 } from 'uuid'
import TelegramBot from 'node-telegram-bot-api'
import smmApi from './services/smmApi.js'

config()

const app = express()
const PORT = process.env.PORT || 3001

// Referral sozlamalari
const REFERRAL_BONUS = parseInt(process.env.REFERRAL_BONUS) || 5000
const REFERRAL_PERCENT = parseInt(process.env.REFERRAL_PERCENT) || 10

// Telegram Bot
let bot = null
if (process.env.BOT_TOKEN && process.env.BOT_TOKEN !== 'your_bot_token_here') {
  bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })
  console.log('✅ Telegram bot ulandi')
  
  // Bot commands
  bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id
    const referralCode = match[1]?.trim()
    
    const welcomeMessage = `
🎉 *SMM Bot'ga xush kelibsiz!*

📱 Ijtimoiy tarmoqlaringizni rivojlantiring:
• Telegram - obunachi, ko'rishlar, reaksiyalar
• Instagram - followers, likes, views
• YouTube - subscribers, views, likes
• TikTok - followers, likes, views

💰 *Yangi foydalanuvchilarga 10,000 so'm bonus!*

🎁 Promo kod: \`YANGI20\` - 20% chegirma

� *Buyruqlar:*
/balance - Balansni ko'rish
/orders - Buyurtmalar tarixi
/help - Yordam

⚠️ _Mini App hozirda ishlab chiqish rejimida. Tayyor bo'lganda HTTPS bilan ishga tushiriladi._`

    const keyboard = {
      inline_keyboard: [
        [{ text: '📞 Qo\'llab-quvvatlash', url: 'https://t.me/ilomswe' }]
      ]
    }
    
    try {
      await bot.sendMessage(chatId, welcomeMessage, { 
        parse_mode: 'Markdown',
        reply_markup: keyboard 
      })
    } catch (err) {
      console.log('Start xabar xatosi:', err.message)
      // Oddiy xabar yuborish
      await bot.sendMessage(chatId, welcomeMessage.replace(/\*/g, '').replace(/`/g, '').replace(/_/g, ''))
    }
  })
  
  bot.onText(/\/help/, async (msg) => {
    const helpMessage = `
📚 *Yordam*

🔹 /start - Botni ishga tushirish
🔹 /balance - Balansni ko'rish
🔹 /orders - Buyurtmalar tarixi
🔹 /help - Yordam

❓ Savollar bo'lsa, qo'llab-quvvatlash xizmatiga murojaat qiling.`
    
    await bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: 'Markdown' })
  })
  
  bot.onText(/\/balance/, async (msg) => {
    const user = database.getUser(msg.chat.id)
    if (user) {
      await bot.sendMessage(msg.chat.id, `💰 Sizning balansngiz: *${user.balance.toLocaleString()} so'm*`, { parse_mode: 'Markdown' })
    } else {
      await bot.sendMessage(msg.chat.id, '❌ Avval /start buyrug\'ini yuboring')
    }
  })
  
  bot.onText(/\/orders/, async (msg) => {
    const orders = database.getOrdersByUser(msg.chat.id)
    if (orders.length === 0) {
      await bot.sendMessage(msg.chat.id, '📦 Sizda hali buyurtmalar yo\'q')
      return
    }
    
    const lastOrders = orders.slice(0, 5)
    let message = '📦 *Oxirgi buyurtmalar:*\n\n'
    
    lastOrders.forEach((order, i) => {
      const statusEmoji = order.status === 'completed' ? '✅' : order.status === 'processing' ? '⏳' : '🕐'
      message += `${i + 1}. ${statusEmoji} ${order.service_name}\n   💰 ${order.price.toLocaleString()} so'm\n\n`
    })
    
    await bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' })
  })
}

// Admin xabar yuborish funksiyasi
function sendAdminNotification(message) {
  if (bot && process.env.ADMIN_CHAT_ID) {
    bot.sendMessage(process.env.ADMIN_CHAT_ID, message, { parse_mode: 'Markdown' }).catch(err => {
      console.log('Admin xabar xatosi:', err.message)
    })
  }
}

// Foydalanuvchiga xabar yuborish
function sendUserNotification(telegramId, message) {
  if (bot) {
    bot.sendMessage(telegramId, message, { parse_mode: 'Markdown' }).catch(err => {
      console.log('User xabar xatosi:', err.message)
    })
  }
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`)
  next()
})

// ==================== USERS API ====================

// Foydalanuvchini olish yoki yaratish
app.post('/api/users/auth', async (req, res) => {
  try {
    const { telegram_id, first_name, last_name, username, is_premium, referral_code } = req.body

    if (!telegram_id) {
      return res.status(400).json({ error: 'telegram_id kerak' })
    }

    // Mavjud foydalanuvchini tekshirish yoki yangi yaratish
    let user = database.getUser(telegram_id)

    if (user) {
      // Mavjud user - yangilash
      user = await database.createUser({
        telegram_id,
        first_name,
        last_name,
        username,
        is_premium
      })
    } else {
      // Yangi foydalanuvchi yaratish
      user = await database.createUser({
        telegram_id,
        first_name,
        last_name,
        username,
        is_premium,
        referred_by: referral_code || null
      })

      // Yangi user bonus
      await database.updateUserBalance(telegram_id, 10000)
      
      // Bonus tranzaksiya
      await database.createTransaction({
        transaction_id: 'BONUS-' + Date.now().toString(36).toUpperCase(),
        user_id: telegram_id,
        type: 'bonus',
        amount: 10000,
        status: 'completed',
        description: 'Xush kelibsiz bonusi'
      })

      // Referral bonus
      if (referral_code) {
        const referrer = database.getUserByReferralCode(referral_code)
        if (referrer && referrer.telegram_id !== telegram_id) {
          // Taklif qiluvchiga bonus
          await database.updateUserBalance(referrer.telegram_id, REFERRAL_BONUS)
          await database.createTransaction({
            transaction_id: 'REF-' + Date.now().toString(36).toUpperCase(),
            user_id: referrer.telegram_id,
            type: 'referral',
            amount: REFERRAL_BONUS,
            status: 'completed',
            description: `Referral bonus: ${first_name}`
          })
          
          // Referral count yangilash
          await database.incrementReferralCount(referrer.telegram_id)
          
          console.log(`🎁 Referral bonus: ${referrer.first_name} <- ${first_name}`)
          
          // Taklif qiluvchiga xabar
          sendUserNotification(referrer.telegram_id, `
🎉 *Tabriklaymiz!*

👤 ${first_name} sizning havolangiz orqali ro'yxatdan o'tdi!
💰 Bonus: *${REFERRAL_BONUS.toLocaleString()} so'm*

Taklif qilishni davom eting va ko'proq bonus oling!
          `)
        }
      }

      user = database.getUser(telegram_id)
      console.log(`🆕 Yangi foydalanuvchi: ${first_name} ${last_name || ''} (@${username || telegram_id})`)
      
      // Adminga xabar
      sendAdminNotification(`
🆕 *Yangi foydalanuvchi!*
━━━━━━━━━━━━━━━━
👤 ${first_name} ${last_name || ''}
🆔 @${username || telegram_id}
💰 Bonus: 10,000 so'm
${referral_code ? `🎁 Referral: ${referral_code}` : ''}
      `)
    }

    res.json({ success: true, user })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Foydalanuvchi ma'lumotlarini olish
app.get('/api/users/:telegram_id', (req, res) => {
  try {
    const telegram_id = parseInt(req.params.telegram_id)
    const user = database.getUser(telegram_id)
    
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// ==================== ORDERS API ====================

// Buyurtma yaratish
app.post('/api/orders', async (req, res) => {
  try {
    const { telegram_id, service_id, service_name, category, link, quantity, price } = req.body

    // Validatsiya
    if (!telegram_id || !service_id || !link || !quantity || !price) {
      return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' })
    }

    // Foydalanuvchini tekshirish
    const user = database.getUser(telegram_id)
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    // Balansni tekshirish
    if (user.balance < price) {
      return res.status(400).json({ error: 'Balans yetarli emas', balance: user.balance, required: price })
    }

    const order_id = 'ORD-' + Date.now().toString(36).toUpperCase()

    // SMM Panel API'ga buyurtma yuborish
    let smmOrderId = null
    let smmResult = null
    try {
      smmResult = await smmApi.createOrder(service_id, link, quantity)
      smmOrderId = smmResult.order
      console.log(`📤 SMM API buyurtma: ${smmOrderId} ${smmResult.demo ? '(demo)' : ''}`)
    } catch (smmError) {
      console.error('SMM API xato:', smmError.message)
      // SMM API xatosi bo'lsa ham davom etamiz (demo rejim)
    }

    // Buyurtma yaratish
    const order = await database.createOrder({
      order_id,
      user_id: telegram_id,
      service_id,
      service_name,
      category,
      link,
      quantity,
      price,
      smm_order_id: smmOrderId
    })

    // Balansdan ayirish
    await database.updateUserBalance(telegram_id, -price)
    await database.updateUserStats(telegram_id, price)

    // Tranzaksiya yaratish
    await database.createTransaction({
      transaction_id: 'TXN-' + Date.now().toString(36).toUpperCase(),
      user_id: telegram_id,
      type: 'purchase',
      amount: -price,
      status: 'completed',
      description: `Buyurtma: ${service_name}`
    })

    const updatedUser = database.getUser(telegram_id)

    console.log(`🛒 Yangi buyurtma: ${order_id} - ${service_name} - ${price.toLocaleString()} so'm`)

    // Adminga xabar yuborish
    sendAdminNotification(`
🛒 *Yangi buyurtma!*
━━━━━━━━━━━━━━━━
📦 ID: \`${order_id}\`
👤 ${user.first_name} (@${user.username || user.telegram_id})
📌 ${service_name}
🔗 ${link}
📊 Miqdor: ${quantity.toLocaleString()}
💰 Summa: ${price.toLocaleString()} so'm
    `)

    // Foydalanuvchiga xabar
    sendUserNotification(telegram_id, `
✅ *Buyurtmangiz qabul qilindi!*

📦 ID: \`${order_id}\`
📌 ${service_name}
📊 Miqdor: ${quantity.toLocaleString()}
💰 Summa: ${price.toLocaleString()} so'm

⏳ Tez orada bajariladi...
    `)

    // Buyurtmani "processing" ga o'tkazish (5 soniyadan keyin)
    setTimeout(async () => {
      await database.updateOrderStatus(order_id, 'processing', 10)
    }, 5000)

    // Progress yangilash (15 soniyadan keyin)
    setTimeout(async () => {
      const randomProgress = Math.floor(Math.random() * 40) + 30
      await database.updateOrderStatus(order_id, 'processing', randomProgress)
    }, 15000)

    // Buyurtmani tugallash (30-60 soniyadan keyin)
    setTimeout(async () => {
      await database.updateOrderStatus(order_id, 'completed', 100)
      console.log(`✅ Buyurtma tugallandi: ${order_id}`)
      
      // Foydalanuvchiga tugallangan xabari
      sendUserNotification(telegram_id, `
🎉 *Buyurtma bajarildi!*

📦 ID: \`${order_id}\`
📌 ${service_name}
📊 Miqdor: ${quantity.toLocaleString()}

✅ Xizmat muvaffaqiyatli yetkazildi!
      `)
    }, 30000 + Math.random() * 30000)

    res.json({ success: true, order, user: updatedUser })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Foydalanuvchi buyurtmalarini olish
app.get('/api/orders/:telegram_id', (req, res) => {
  try {
    const telegram_id = parseInt(req.params.telegram_id)
    const orders = database.getOrdersByUser(telegram_id)

    res.json({ success: true, orders })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Bitta buyurtmani olish
app.get('/api/orders/detail/:order_id', (req, res) => {
  try {
    const { order_id } = req.params
    const order = database.getOrderById(order_id)

    if (!order) {
      return res.status(404).json({ error: 'Buyurtma topilmadi' })
    }

    res.json({ success: true, order })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// ==================== BALANCE API ====================

// Balans to'ldirish
app.post('/api/balance/deposit', async (req, res) => {
  try {
    const { telegram_id, amount, method } = req.body

    if (!telegram_id || !amount || amount < 5000) {
      return res.status(400).json({ error: 'Minimal summa: 5,000 so\'m' })
    }

    const user = database.getUser(telegram_id)
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    const tx_id = 'DEP-' + Date.now().toString(36).toUpperCase()

    // Tranzaksiya yaratish (pending)
    await database.createTransaction({
      transaction_id: tx_id,
      user_id: telegram_id,
      type: 'deposit',
      amount: amount,
      method: method,
      status: 'pending',
      description: `To'ldirish (${method})`
    })

    // Demo rejimda avtomatik tasdiqlash (3 soniyadan keyin)
    setTimeout(async () => {
      // Balansga qo'shish
      await database.updateUserBalance(telegram_id, amount)
      
      console.log(`💰 Balans to'ldirildi: ${user.first_name} - ${amount.toLocaleString()} so'm`)
      
      // Adminga xabar
      sendAdminNotification(`
💰 *Balans to'ldirildi!*
━━━━━━━━━━━━━━━━
👤 ${user.first_name} (@${user.username || user.telegram_id})
💵 Summa: ${amount.toLocaleString()} so'm
📱 Usul: ${method}
🆔 TX: \`${tx_id}\`
      `)
      
      // Foydalanuvchiga xabar
      sendUserNotification(telegram_id, `
✅ *Balans to'ldirildi!*

💰 Summa: ${amount.toLocaleString()} so'm
📱 Usul: ${method}

Yangi balans: *${(user.balance + amount).toLocaleString()} so'm*
      `)
    }, 3000)

    res.json({ 
      success: true, 
      transaction_id: tx_id,
      message: 'To\'lov so\'rovi qabul qilindi' 
    })
  } catch (error) {
    console.error('Deposit error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Tranzaksiyalar tarixi
app.get('/api/transactions/:telegram_id', (req, res) => {
  try {
    const telegram_id = parseInt(req.params.telegram_id)
    const transactions = database.getTransactionsByUser(telegram_id)

    res.json({ success: true, transactions })
  } catch (error) {
    console.error('Get transactions error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// ==================== PROMO API ====================

// Promo kodni tekshirish va qo'llash
app.post('/api/promo/apply', async (req, res) => {
  try {
    const { telegram_id, code, order_amount } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Promo kodni kiriting' })
    }

    const promo = database.getPromoCode(code.toUpperCase())

    if (!promo) {
      return res.status(404).json({ error: 'Promo kod topilmadi yoki muddati tugagan' })
    }

    if (promo.used_count >= promo.max_uses) {
      return res.status(400).json({ error: 'Promo kod limiti tugagan' })
    }

    if (order_amount && promo.min_amount > order_amount) {
      return res.status(400).json({ error: `Minimal buyurtma summasi: ${promo.min_amount} so'm` })
    }

    // Foydalanuvchi avval ishlatganmi?
    const usage = database.checkPromoUsage(promo.id, telegram_id)

    if (usage) {
      return res.status(400).json({ error: 'Siz bu promo kodni avval ishlatgansiz' })
    }

    let discount = 0
    if (promo.discount_percent > 0) {
      discount = Math.floor((order_amount || 0) * promo.discount_percent / 100)
    } else if (promo.discount_amount > 0) {
      discount = promo.discount_amount
    }

    // Promo kodni ishlatilgan deb belgilash
    await database.usePromoCode(promo.id, telegram_id)

    res.json({ 
      success: true, 
      promo: {
        code: promo.code,
        discount_percent: promo.discount_percent,
        discount_amount: promo.discount_amount,
        calculated_discount: discount
      }
    })
  } catch (error) {
    console.error('Apply promo error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// ==================== STATS API ====================

// Statistika
app.get('/api/stats/:telegram_id', (req, res) => {
  try {
    const telegram_id = parseInt(req.params.telegram_id)

    const user = database.getUser(telegram_id)
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    const orders = database.getOrdersByUser(telegram_id)
    const orderStats = {
      total: orders.length,
      completed: orders.filter(o => o.status === 'completed').length,
      processing: orders.filter(o => o.status === 'processing').length,
      pending: orders.filter(o => o.status === 'pending').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    }

    res.json({ 
      success: true, 
      stats: {
        user: {
          balance: user.balance,
          total_orders: user.total_orders,
          total_spent: user.total_spent,
          member_since: user.created_at,
          referral_count: user.referral_count || 0
        },
        orders: orderStats
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// ==================== ADMIN API ====================

const ADMIN_IDS = [parseInt(process.env.ADMIN_CHAT_ID) || 5425876649]

// Admin tekshirish middleware
const isAdmin = (req, res, next) => {
  const adminId = parseInt(req.headers['x-admin-id'] || req.query.admin_id)
  if (!ADMIN_IDS.includes(adminId)) {
    return res.status(403).json({ error: 'Ruxsat yo\'q' })
  }
  next()
}

// Admin statistika
app.get('/api/admin/stats', isAdmin, (req, res) => {
  try {
    const stats = database.getStats()
    const allUsers = database.getAllUsers()
    const allOrders = database.getAllOrders()
    
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const todayOrders = allOrders.filter(o => new Date(o.created_at) >= todayStart)
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.price, 0)
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.price, 0)
    
    res.json({ 
      success: true, 
      stats: {
        ...stats,
        totalUsers: allUsers.length,
        totalOrders: allOrders.length,
        todayOrders: todayOrders.length,
        todayRevenue,
        totalRevenue
      }
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Barcha buyurtmalar
app.get('/api/admin/orders', isAdmin, (req, res) => {
  try {
    const { status, limit = 100 } = req.query
    let orders = database.getAllOrders()
    
    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status)
    }
    
    orders = orders.slice(0, parseInt(limit))
    
    // User ma'lumotlarini qo'shish
    const ordersWithUser = orders.map(order => {
      const user = database.getUser(order.user_id)
      return {
        ...order,
        user: user ? {
          first_name: user.first_name,
          username: user.username
        } : null
      }
    })
    
    res.json({ success: true, orders: ordersWithUser })
  } catch (error) {
    console.error('Admin orders error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Barcha foydalanuvchilar
app.get('/api/admin/users', isAdmin, (req, res) => {
  try {
    const { limit = 100 } = req.query
    const users = database.getAllUsers().slice(0, parseInt(limit))
    res.json({ success: true, users })
  } catch (error) {
    console.error('Admin users error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Buyurtma statusini yangilash
app.put('/api/admin/orders/:order_id', isAdmin, async (req, res) => {
  try {
    const { order_id } = req.params
    const { status, progress } = req.body
    
    const order = await database.updateOrderStatus(order_id, status, progress)
    
    if (!order) {
      return res.status(404).json({ error: 'Buyurtma topilmadi' })
    }
    
    // Foydalanuvchiga xabar
    if (status === 'completed') {
      sendUserNotification(order.user_id, `
🎉 *Buyurtma bajarildi!*

📦 ID: \`${order_id}\`
📌 ${order.service_name}

✅ Xizmat muvaffaqiyatli yetkazildi!
      `)
    } else if (status === 'cancelled') {
      // Pulni qaytarish
      await database.updateUserBalance(order.user_id, order.price)
      await database.createTransaction({
        transaction_id: 'REFUND-' + Date.now().toString(36).toUpperCase(),
        user_id: order.user_id,
        type: 'refund',
        amount: order.price,
        status: 'completed',
        description: `Qaytarish: ${order.service_name}`
      })
      
      sendUserNotification(order.user_id, `
❌ *Buyurtma bekor qilindi*

📦 ID: \`${order_id}\`
💰 Qaytarildi: ${order.price.toLocaleString()} so'm
      `)
    }
    
    res.json({ success: true, order })
  } catch (error) {
    console.error('Update order error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Foydalanuvchi balansini yangilash
app.put('/api/admin/users/:telegram_id/balance', isAdmin, async (req, res) => {
  try {
    const telegram_id = parseInt(req.params.telegram_id)
    const { amount, reason } = req.body
    
    await database.updateUserBalance(telegram_id, amount)
    await database.createTransaction({
      transaction_id: 'ADMIN-' + Date.now().toString(36).toUpperCase(),
      user_id: telegram_id,
      type: amount > 0 ? 'deposit' : 'deduct',
      amount: amount,
      status: 'completed',
      description: reason || 'Admin tomonidan'
    })
    
    const user = database.getUser(telegram_id)
    
    sendUserNotification(telegram_id, `
💰 *Balans yangilandi*

${amount > 0 ? '➕' : '➖'} ${Math.abs(amount).toLocaleString()} so'm
📝 Sabab: ${reason || 'Admin tomonidan'}

Yangi balans: *${user.balance.toLocaleString()} so'm*
    `)
    
    res.json({ success: true, user })
  } catch (error) {
    console.error('Update balance error:', error)
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// SMM Panel balansini tekshirish
app.get('/api/admin/smm-balance', isAdmin, async (req, res) => {
  try {
    const balance = await smmApi.getBalance()
    res.json({ success: true, balance })
  } catch (error) {
    console.error('SMM balance error:', error)
    res.status(500).json({ error: 'SMM API xatosi' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint topilmadi' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Server xatosi' })
})

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 SMM Bot Server ishga tushdi!      ║
║   📍 Port: ${PORT}                          ║
║   🌐 http://localhost:${PORT}              ║
╚════════════════════════════════════════╝
  `)
})
