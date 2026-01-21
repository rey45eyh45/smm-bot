import { motion } from 'framer-motion'
import { TrendingUp, Users, Clock, Shield, Zap, Award } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Tezkor yetkazish',
    desc: 'Buyurtma avtomatik bajariladi',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Xavfsiz to\'lov',
    desc: 'Payme, Click, Uzum',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Clock,
    title: '24/7 Xizmat',
    desc: 'Doimo faol tizim',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Award,
    title: 'Sifat kafolati',
    desc: 'Premium xizmatlar',
    gradient: 'from-purple-500 to-pink-500'
  }
]

const StatsSection = () => {
  return (
    <div className="px-4 py-6">
      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-3"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-2`}>
                <Icon size={18} className="text-white" />
              </div>
              <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">{feature.desc}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 glass-card rounded-xl p-4"
      >
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-400">
              <TrendingUp size={14} />
              <span className="text-lg font-bold">50K+</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">Buyurtmalar</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400">
              <Users size={14} />
              <span className="text-lg font-bold">10K+</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">Mijozlar</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-400">
              <Clock size={14} />
              <span className="text-lg font-bold">3 yil</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">Tajriba</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default StatsSection
