import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp,
  RefreshCw,
  Check,
  X,
  Clock,
  Search,
  Wallet
} from 'lucide-react'

const ADMIN_ID = 5425876649 // Admin Telegram ID
const API_URL = 'http://localhost:3001/api'

interface Stats {
  totalUsers: number
  totalOrders: number
  todayOrders: number
  todayRevenue: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
}

interface Order {
  id: number
  order_id: string
  user_id: number
  service_name: string
  category: string
  link: string
  quantity: number
  price: number
  status: string
  progress: number
  created_at: string
  user?: {
    first_name: string
    username: string
  }
}

interface User {
  telegram_id: number
  first_name: string
  last_name: string
  username: string
  balance: number
  total_orders: number
  total_spent: number
  referral_count: number
  created_at: string
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'users'>('stats')
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [orderFilter, setOrderFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [smmBalance, setSmmBalance] = useState<string>('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const headers = { 'X-Admin-ID': ADMIN_ID.toString() }
      
      const [statsRes, ordersRes, usersRes, smmRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers }),
        fetch(`${API_URL}/admin/orders?status=${orderFilter}`, { headers }),
        fetch(`${API_URL}/admin/users`, { headers }),
        fetch(`${API_URL}/admin/smm-balance`, { headers })
      ])
      
      const statsData = await statsRes.json()
      const ordersData = await ordersRes.json()
      const usersData = await usersRes.json()
      const smmData = await smmRes.json()
      
      if (statsData.success) setStats(statsData.stats)
      if (ordersData.success) setOrders(ordersData.orders)
      if (usersData.success) setUsers(usersData.users)
      if (smmData.success) setSmmBalance(smmData.balance?.balance || 'N/A')
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [orderFilter])

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-ID': ADMIN_ID.toString()
        },
        body: JSON.stringify({ status, progress: status === 'completed' ? 100 : 50 })
      })
      
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString() + ' so\'m'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('uz-UZ')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10'
      case 'processing': return 'text-blue-400 bg-blue-400/10'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10'
      case 'cancelled': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true
    return (
      order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true
    return (
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.telegram_id.toString().includes(searchQuery)
    )
  })

  return (
    <div className="min-h-screen bg-dark-300 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-gray-500">SMM Bot boshqaruvi</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={fetchData}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={20} className={`text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'stats', label: 'Statistika', icon: TrendingUp },
          { id: 'orders', label: 'Buyurtmalar', icon: Package },
          { id: 'users', label: 'Foydalanuvchilar', icon: Users }
        ].map(tab => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Users size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500">Foydalanuvchilar</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Package size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                  <p className="text-xs text-gray-500">Buyurtmalar</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Clock size={20} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.todayOrders}</p>
                  <p className="text-xs text-gray-500">Bugun</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <DollarSign size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatPrice(stats.totalRevenue)}</p>
                  <p className="text-xs text-gray-500">Jami daromad</p>
                </div>
              </div>
            </div>
          </div>

          {/* SMM Balance */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500">
                  <Wallet size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">SMM Panel Balans</p>
                  <p className="text-lg font-bold text-white">${smmBalance}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Stats */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold text-white mb-3">Buyurtmalar holati</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Kutilmoqda</span>
                <span className="text-yellow-400 font-medium">{stats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Bajarilgan</span>
                <span className="text-green-400 font-medium">{stats.completedOrders}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
            >
              <option value="all">Barchasi</option>
              <option value="pending">Kutilmoqda</option>
              <option value="processing">Jarayonda</option>
              <option value="completed">Bajarilgan</option>
              <option value="cancelled">Bekor qilingan</option>
            </select>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.map(order => (
              <motion.div
                key={order.order_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-500 font-mono">{order.order_id}</p>
                    <p className="font-medium text-white">{order.service_name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-gray-400">
                    👤 {order.user?.first_name || 'Unknown'}
                  </span>
                  <span className="text-primary-400 font-medium">
                    {formatPrice(order.price)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>📊 {order.quantity.toLocaleString()} ta</span>
                  <span>{formatDate(order.created_at)}</span>
                </div>

                {/* Actions */}
                {order.status === 'pending' || order.status === 'processing' ? (
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateOrderStatus(order.order_id, 'completed')}
                      className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Check size={14} /> Bajarildi
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateOrderStatus(order.order_id, 'cancelled')}
                      className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <X size={14} /> Bekor
                    </motion.button>
                  </div>
                ) : null}
              </motion.div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500">Buyurtmalar yo'q</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Foydalanuvchi qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {filteredUsers.map(user => (
              <motion.div
                key={user.telegram_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user.first_name?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-gray-500">@{user.username || user.telegram_id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/5 rounded-lg py-2">
                    <p className="text-sm font-bold text-white">{formatPrice(user.balance)}</p>
                    <p className="text-[10px] text-gray-500">Balans</p>
                  </div>
                  <div className="bg-white/5 rounded-lg py-2">
                    <p className="text-sm font-bold text-white">{user.total_orders}</p>
                    <p className="text-[10px] text-gray-500">Buyurtmalar</p>
                  </div>
                  <div className="bg-white/5 rounded-lg py-2">
                    <p className="text-sm font-bold text-white">{user.referral_count || 0}</p>
                    <p className="text-[10px] text-gray-500">Referral</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500">Foydalanuvchilar yo'q</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Admin
