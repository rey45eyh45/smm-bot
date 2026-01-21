import { motion } from 'framer-motion'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import ServiceCard from '../components/ServiceCard'
import { categories } from '../data/services'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Popular Services */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-400" />
            <h3 className="font-semibold text-white">Mashhur xizmatlar</h3>
          </div>
          <Link to="/services" className="text-xs text-primary-400 flex items-center gap-1">
            Barchasi <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-3">
          {categories.slice(0, 4).map((category, index) => (
            <ServiceCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 py-6">
        <h3 className="font-semibold text-white mb-4">Qanday ishlaydi?</h3>
        <div className="space-y-3">
          {[
            { step: '01', title: 'Xizmatni tanlang', desc: 'Kerakli platformani va xizmat turini tanlang' },
            { step: '02', title: 'Ma\'lumot kiriting', desc: 'Havola va miqdorni kiriting' },
            { step: '03', title: 'To\'lov qiling', desc: 'Qulay usulda to\'lovni amalga oshiring' },
            { step: '04', title: 'Natijani kuting', desc: 'Buyurtma avtomatik bajariladi' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-lg font-bold gradient-text">{item.step}</span>
              </div>
              <div>
                <h4 className="font-medium text-white">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Support Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary-600/30 to-purple-600/30 border border-primary-500/20"
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl">💬</div>
          <div className="flex-1">
            <h4 className="font-semibold text-white">Yordam kerakmi?</h4>
            <p className="text-xs text-gray-400 mt-0.5">24/7 qo'llab-quvvatlash xizmati</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-colors"
          >
            Yozish
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default Home
