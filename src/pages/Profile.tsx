import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  MessageCircle,
  Star,
  Gift,
  Copy,
  Check
} from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'
import { useStore } from '../store/useStore'
import { useState } from 'react'

const menuItems = [
  {
    group: 'Akkaunt',
    items: [
      { icon: User, label: 'Profil ma\'lumotlari', desc: 'Ism, telefon, email' },
      { icon: Bell, label: 'Bildirishnomalar', desc: 'Push xabarnomalar' },
      { icon: Shield, label: 'Xavfsizlik', desc: 'Parol, 2FA' },
    ]
  },
  {
    group: 'Sozlamalar',
    items: [
      { icon: Moon, label: 'Mavzu', desc: 'Qorong\'i rejim' },
      { icon: Globe, label: 'Til', desc: 'O\'zbek' },
    ]
  },
  {
    group: 'Yordam',
    items: [
      { icon: HelpCircle, label: 'Yordam markazi', desc: 'Ko\'p beriladigan savollar' },
      { icon: MessageCircle, label: 'Qo\'llab-quvvatlash', desc: '24/7 onlayn yordam' },
      { icon: Star, label: 'Baho berish', desc: 'Ilovani baholang' },
    ]
  }
]

const Profile = () => {
  const { user: telegramUser, hapticFeedback, showConfirm, close } = useTelegram()
  const { user } = useStore()
  const [copied, setCopied] = useState(false)

  const copyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(`https://t.me/YourBot?start=${user.referral_code}`)
      setCopied(true)
      hapticFeedback('heavy')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const months = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30))
    return months < 1 ? 'Yangi' : `${months} oy`
  }

  const handleLogout = async () => {
    const confirmed = await showConfirm('Haqiqatan ham chiqmoqchimisiz?')
    if (confirmed) {
      hapticFeedback('heavy')
      close()
    }
  }

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <div className="px-4 pt-4 pb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden"
        >
          {/* Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-2xl" />
          
          <div className="relative flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {user?.first_name?.[0] || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-dark-200 flex items-center justify-center">
                <span className="text-[8px] text-white">✓</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">
                {telegramUser?.first_name || user?.first_name} {telegramUser?.last_name || user?.last_name || ''}
              </h2>
              {(telegramUser?.username || user?.username) && (
                <p className="text-sm text-gray-500">@{telegramUser?.username || user?.username}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {user?.is_premium ? (
                  <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                    Premium
                  </span>
                ) : null}
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  Faol
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around mt-6 pt-4 border-t border-white/10">
            <div className="text-center">
              <span className="text-xl font-bold text-white">{user?.total_orders || 0}</span>
              <p className="text-[10px] text-gray-500 mt-0.5">Buyurtmalar</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <span className="text-xl font-bold text-white">
                {user?.balance ? (user.balance >= 1000 ? `${(user.balance / 1000).toFixed(0)}K` : user.balance) : 0}
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">Balans</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <span className="text-xl font-bold text-white">{user?.created_at ? formatDate(user.created_at) : '0'}</span>
              <p className="text-[10px] text-gray-500 mt-0.5">A'zolik</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Referral Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/20"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
            <Gift size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white text-sm">Do'stlaringizni taklif qiling</h4>
            <p className="text-xs text-gray-400">Har bir do'stingiz uchun 10% bonus oling</p>
            {user?.referral_code && (
              <p className="text-xs text-yellow-400 mt-1 font-mono">{user.referral_code}</p>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={copyReferralCode}
            className="p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors"
          >
            {copied ? (
              <Check size={18} className="text-green-400" />
            ) : (
              <Copy size={18} className="text-yellow-400" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Menu Groups */}
      <div className="px-4 pb-8">
        {menuItems.map((group, groupIndex) => (
          <motion.div
            key={group.group}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="mb-6"
          >
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-1">
              {group.group}
            </h3>
            <div className="glass-card rounded-xl overflow-hidden">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.label}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => hapticFeedback('light')}
                    className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${
                      itemIndex < group.items.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Icon size={18} className="text-gray-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-white text-sm">{item.label}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-600" />
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        ))}

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full glass-card rounded-xl p-4 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Chiqish</span>
        </motion.button>

        {/* Version */}
        <p className="text-center text-xs text-gray-600 mt-6">
          SMM Bot v1.0.0
        </p>
      </div>
    </div>
  )
}

export default Profile
