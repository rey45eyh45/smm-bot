import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useState } from 'react'
import ServiceCard from '../components/ServiceCard'
import { categories } from '../data/services'

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories.filter(
    cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.nameUz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.services.some(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nameUz.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white"
        >
          Xizmatlar
        </motion.h1>
        <p className="text-gray-500 text-sm mt-1">
          Barcha platformalar uchun SMM xizmatlari
        </p>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Xizmatlarni qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11"
          />
        </motion.div>
      </div>

      {/* Quick Filters */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Barchasi', 'Telegram', 'Instagram', 'YouTube', 'TikTok', 'SMS'].map((filter, index) => (
            <motion.button
              key={filter}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                index === 0 
                  ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div className="px-4 py-4 space-y-3">
        {filteredCategories.map((category, index) => (
          <ServiceCard key={category.id} category={category} index={index} />
        ))}

        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-white">Topilmadi</h3>
            <p className="text-sm text-gray-500 mt-1">Qidiruv so'zini o'zgartiring</p>
          </motion.div>
        )}
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h4 className="font-medium text-white text-sm">Muhim ma'lumot</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Barcha xizmatlarimiz real va xavfsiz. Akkauntlaringizga hech qanday zarar yetmaydi. 
              Buyurtmalar avtomatik tizim orqali bajariladi.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Services
