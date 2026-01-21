import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Default ma'lumotlar
const defaultData = {
  users: [],
  orders: [],
  transactions: [],
  promo_codes: [
    {
      id: 1,
      code: 'YANGI20',
      discount_percent: 20,
      discount_amount: 0,
      max_uses: 1000,
      used_count: 0,
      min_amount: 0,
      expires_at: null,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      code: 'SMM50',
      discount_percent: 0,
      discount_amount: 5000,
      max_uses: 500,
      used_count: 0,
      min_amount: 10000,
      expires_at: null,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],
  promo_usages: []
}

// Database yaratish
const adapter = new JSONFile(join(__dirname, 'db.json'))
const db = new Low(adapter, defaultData)

// Database'ni yuklash
await db.read()

// Agar bo'sh bo'lsa, default ma'lumotlarni yozish
if (!db.data || Object.keys(db.data).length === 0) {
  db.data = defaultData
  await db.write()
}

// Helper funksiyalar
export const database = {
  // Users
  getUser: (telegram_id) => {
    return db.data.users.find(u => u.telegram_id === telegram_id)
  },

  createUser: async (userData) => {
    const existingUser = db.data.users.find(u => u.telegram_id === userData.telegram_id)
    if (existingUser) {
      // Mavjud user'ni yangilash
      Object.assign(existingUser, {
        ...userData,
        updated_at: new Date().toISOString()
      })
      await db.write()
      return existingUser
    }

    const newUser = {
      id: db.data.users.length + 1,
      telegram_id: userData.telegram_id,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      username: userData.username || '',
      balance: 0,
      total_orders: 0,
      total_spent: 0,
      is_premium: userData.is_premium ? 1 : 0,
      referral_code: `REF${userData.telegram_id}`,
      referred_by: userData.referred_by || null,
      referral_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    db.data.users.push(newUser)
    await db.write()
    return newUser
  },

  getUserByReferralCode: (referral_code) => {
    return db.data.users.find(u => u.referral_code === referral_code)
  },

  incrementReferralCount: async (telegram_id) => {
    const user = db.data.users.find(u => u.telegram_id === telegram_id)
    if (user) {
      user.referral_count = (user.referral_count || 0) + 1
      user.updated_at = new Date().toISOString()
      await db.write()
    }
    return user
  },

  updateUserBalance: async (telegram_id, amount) => {
    const user = db.data.users.find(u => u.telegram_id === telegram_id)
    if (user) {
      user.balance += amount
      user.updated_at = new Date().toISOString()
      await db.write()
    }
    return user
  },

  updateUserStats: async (telegram_id, orderAmount) => {
    const user = db.data.users.find(u => u.telegram_id === telegram_id)
    if (user) {
      user.total_orders += 1
      user.total_spent += orderAmount
      user.updated_at = new Date().toISOString()
      await db.write()
    }
    return user
  },

  // Orders
  createOrder: async (orderData) => {
    const newOrder = {
      id: db.data.orders.length + 1,
      order_id: orderData.order_id,
      user_id: orderData.user_id,
      service_id: orderData.service_id,
      service_name: orderData.service_name,
      category: orderData.category,
      link: orderData.link,
      quantity: orderData.quantity,
      price: orderData.price,
      status: 'pending',
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null
    }
    db.data.orders.push(newOrder)
    await db.write()
    return newOrder
  },

  getOrdersByUser: (telegram_id) => {
    return db.data.orders
      .filter(o => o.user_id === telegram_id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getOrderById: (order_id) => {
    return db.data.orders.find(o => o.order_id === order_id)
  },

  updateOrderStatus: async (order_id, status, progress = null) => {
    const order = db.data.orders.find(o => o.order_id === order_id)
    if (order) {
      order.status = status
      if (progress !== null) order.progress = progress
      order.updated_at = new Date().toISOString()
      if (status === 'completed') {
        order.completed_at = new Date().toISOString()
        order.progress = 100
      }
      await db.write()
    }
    return order
  },

  // Transactions
  createTransaction: async (transactionData) => {
    const newTransaction = {
      id: db.data.transactions.length + 1,
      transaction_id: transactionData.transaction_id,
      user_id: transactionData.user_id,
      type: transactionData.type,
      amount: transactionData.amount,
      method: transactionData.method || null,
      status: transactionData.status || 'completed',
      description: transactionData.description || null,
      created_at: new Date().toISOString()
    }
    db.data.transactions.push(newTransaction)
    await db.write()
    return newTransaction
  },

  getTransactionsByUser: (telegram_id) => {
    return db.data.transactions
      .filter(t => t.user_id === telegram_id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  // Promo codes
  getPromoCode: (code) => {
    return db.data.promo_codes.find(p => p.code === code && p.is_active)
  },

  checkPromoUsage: (promo_id, user_id) => {
    return db.data.promo_usages.find(u => u.promo_id === promo_id && u.user_id === user_id)
  },

  usePromoCode: async (promo_id, user_id) => {
    const promo = db.data.promo_codes.find(p => p.id === promo_id)
    if (promo) {
      promo.used_count += 1
    }
    db.data.promo_usages.push({
      id: db.data.promo_usages.length + 1,
      promo_id,
      user_id,
      used_at: new Date().toISOString()
    })
    await db.write()
  },

  // Stats
  getStats: () => {
    return {
      totalUsers: db.data.users.length,
      totalOrders: db.data.orders.length,
      pendingOrders: db.data.orders.filter(o => o.status === 'pending').length,
      completedOrders: db.data.orders.filter(o => o.status === 'completed').length
    }
  },

  // Admin functions
  getAllUsers: () => {
    return db.data.users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getAllOrders: () => {
    return db.data.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
}

export default database
