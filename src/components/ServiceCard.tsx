import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ServiceCategory } from '../data/services'
import { ChevronRight } from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'

interface ServiceCardProps {
  category: ServiceCategory
  index: number
}

const ServiceCard = ({ category, index }: ServiceCardProps) => {
  const { hapticFeedback } = useTelegram()
  const Icon = category.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/services/${category.id}`}
        onClick={() => hapticFeedback('light')}
        className="block"
      >
        <div className="glass-card service-card rounded-2xl p-4 group">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className={`relative p-3 rounded-xl bg-gradient-to-br ${category.gradient} icon-glow`}>
              <Icon size={24} className="text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                {category.nameUz}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {category.services.length} xizmat mavjud
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight 
              size={20} 
              className="text-gray-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" 
            />
          </div>

          {/* Mini Services Preview */}
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex flex-wrap gap-1.5">
              {category.services.slice(0, 4).map((service) => (
                <span
                  key={service.id}
                  className="px-2 py-1 text-[10px] rounded-full bg-white/5 text-gray-400"
                >
                  {service.nameUz}
                </span>
              ))}
              {category.services.length > 4 && (
                <span className="px-2 py-1 text-[10px] rounded-full bg-primary-500/20 text-primary-400">
                  +{category.services.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ServiceCard
