import { motion } from 'framer-motion'
import { Bell, Sparkles } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'
import { Link } from 'react-router-dom'

const Header = () => {
  const { user } = useTelegram()

  return (
    <header className="sticky top-0 z-40 safe-top">
      <div className="glass border-b border-white/5">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-400" />
            </motion.div>
            <div>
              <h1 className="text-sm font-bold gradient-text">SMM Xizmatlari</h1>
              <p className="text-[10px] text-gray-500">24/7 avtomatik</p>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>

            {/* User Avatar */}
            <Link to="/profile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.first_name?.[0] || 'U'}
                </div>
                <span className="text-sm font-medium text-white hidden sm:block">
                  {user?.first_name || 'User'}
                </span>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
