import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, LayoutGrid, ShoppingBag, Wallet, User } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'

const navItems = [
  { path: '/', icon: Home, label: 'Asosiy' },
  { path: '/services', icon: LayoutGrid, label: 'Xizmatlar' },
  { path: '/orders', icon: ShoppingBag, label: 'Buyurtmalar' },
  { path: '/balance', icon: Wallet, label: 'Balans' },
  { path: '/profile', icon: User, label: 'Profil' },
]

const Navigation = () => {
  const location = useLocation()
  const { hapticFeedback } = useTelegram()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-4 mb-4">
        <div className="glass-card rounded-2xl px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => hapticFeedback('light')}
                  className="relative flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-xl"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <Icon
                    size={22}
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-primary-400' : 'text-gray-500'
                    }`}
                  />
                  <span
                    className={`text-[10px] mt-1 font-medium transition-colors duration-300 ${
                      isActive ? 'text-primary-400' : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
