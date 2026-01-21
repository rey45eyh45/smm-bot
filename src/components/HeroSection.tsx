import { motion } from 'framer-motion'
import { ArrowRight, Gift, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTelegram } from '../context/TelegramContext'
import { useStore } from '../store/useStore'

const HeroSection = () => {
  const { user: telegramUser } = useTelegram()
  const { user } = useStore()

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5 relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-2xl" />
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Xush kelibsiz 👋</p>
              <h2 className="text-2xl font-bold text-white mt-1">
                {telegramUser?.first_name || user?.first_name || 'Foydalanuvchi'}
              </h2>
            </div>
            <Link to="/balance">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
              >
                <Wallet size={16} className="text-green-400" />
                <span className="text-green-400 font-bold text-sm">
                  {user?.balance?.toLocaleString() || '0'} so'm
                </span>
              </motion.div>
            </Link>
          </div>

          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Ijtimoiy tarmoqlaringizni tez va sifatli rivojlantiring. 
            Barcha xizmatlar avtomatik va 24/7 ishlaydi.
          </p>

          <Link to="/services">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full gradient-btn text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2"
            >
              Xizmatlarni ko'rish
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Promo Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 bg-gradient-to-r from-primary-600/20 via-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-primary-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
            <Gift size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-white">Yangi foydalanuvchilarga!</h4>
            <p className="text-xs text-gray-400">Birinchi buyurtmaga 20% chegirma</p>
          </div>
          <span className="px-2 py-1 bg-primary-500/30 rounded-full text-xs text-primary-300 font-medium">
            YANGI20
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default HeroSection
