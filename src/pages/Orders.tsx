import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Filter, Search, Package, RefreshCw } from 'lucide-react'
import OrderItem from '../components/OrderItem'
import useStore from '../store/useStore'

const tabs = [
  { id: 'all', label: 'Barchasi' },
  { id: 'pending', label: 'Kutilmoqda' },
  { id: 'processing', label: 'Jarayonda' },
  { id: 'completed', label: 'Bajarildi' },
]

const Orders = () => {
  const { user, orders, fetchOrders, isLoading } = useStore()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user?.telegram_id) {
      fetchOrders(user.telegram_id)
    }
  }, [user?.telegram_id])

  useEffect(() => {
    if (user?.telegram_id) {
      fetchOrders(user.telegram_id, activeTab)
    }
  }, [activeTab])

  // Auto-refresh har 10 soniyada
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.telegram_id) {
        fetchOrders(user.telegram_id, activeTab)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [user?.telegram_id, activeTab])

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab
    const matchesSearch = order.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.order_id?.includes(searchQuery)
    return matchesTab && matchesSearch
  })

  const handleRefresh = () => {
    if (user?.telegram_id) {
      fetchOrders(user.telegram_id, activeTab)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white"
            >
              Buyurtmalar
            </motion.h1>
            <p className="text-gray-500 text-sm mt-1">
              Barcha buyurtmalaringiz tarixi
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9, rotate: 180 }}
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={18} className={`text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4 py-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buyurtma ID yoki xizmat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11 pr-12"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Filter size={16} className="text-gray-400" />
          </button>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 py-4 space-y-3">
        {isLoading && orders.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw size={32} className="text-primary-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Yuklanmoqda...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.order_id || order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <OrderItem order={{
                id: order.order_id,
                service: order.service_name,
                quantity: order.quantity,
                link: order.link,
                status: order.status,
                price: order.price,
                createdAt: order.created_at,
                progress: order.progress
              }} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">Buyurtmalar yo'q</h3>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'all' 
                ? 'Siz hali buyurtma bermadingiz' 
                : 'Bu statusda buyurtmalar topilmadi'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Stats */}
      {orders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-6 glass-card rounded-xl p-4"
        >
          <div className="flex items-center justify-around">
            <div className="text-center">
              <span className="text-lg font-bold text-white">{orders.length}</span>
              <p className="text-[10px] text-gray-500 mt-0.5">Jami</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <span className="text-lg font-bold text-green-400">
                {orders.filter(o => o.status === 'completed').length}
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">Bajarildi</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <span className="text-lg font-bold text-blue-400">
                {orders.filter(o => o.status === 'processing').length}
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">Jarayonda</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Orders
