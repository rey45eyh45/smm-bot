import { motion } from 'framer-motion'
import { Check, Clock, XCircle, ChevronRight } from 'lucide-react'

export interface Order {
  id: string
  service: string
  quantity: number
  link: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  price: number
  createdAt: string
  progress?: number
}

interface OrderItemProps {
  order: Order
  onClick?: () => void
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    label: 'Kutilmoqda'
  },
  processing: {
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: 'Jarayonda'
  },
  completed: {
    icon: Check,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    label: 'Bajarildi'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    label: 'Bekor qilindi'
  }
}

const OrderItem = ({ order, onClick }: OrderItemProps) => {
  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="glass-card rounded-xl p-4 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">#{order.id}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bgColor} ${status.color}`}>
              <span className="flex items-center gap-1">
                <StatusIcon size={10} />
                {status.label}
              </span>
            </span>
          </div>
          <h4 className="font-medium text-white mt-1 truncate">{order.service}</h4>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{order.link}</p>
        </div>
        <ChevronRight size={18} className="text-gray-600 flex-shrink-0" />
      </div>

      {/* Progress Bar */}
      {order.status === 'processing' && order.progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Jarayon</span>
            <span className="text-primary-400">{order.progress}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${order.progress}%` }}
              className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span className="text-sm font-semibold text-white">
          {new Intl.NumberFormat('uz-UZ').format(order.price)} so'm
        </span>
        <span className="text-[10px] text-gray-500">
          {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
        </span>
      </div>
    </motion.div>
  )
}

export default OrderItem
