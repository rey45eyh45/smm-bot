import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react'
import { useTelegram } from '../context/TelegramContext'
import useStore from '../store/useStore'

const paymentMethods = [
  { id: 'payme', name: 'Payme', icon: '💳', color: 'from-cyan-500 to-blue-500' },
  { id: 'click', name: 'Click', icon: '📱', color: 'from-blue-500 to-indigo-500' },
  { id: 'uzum', name: 'Uzum Bank', icon: '🏦', color: 'from-purple-500 to-pink-500' },
]

const Balance = () => {
  const { hapticFeedback, showAlert } = useTelegram()
  const { user, transactions, fetchTransactions, deposit } = useStore()
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [depositing, setDepositing] = useState(false)

  useEffect(() => {
    if (user?.telegram_id) {
      fetchTransactions(user.telegram_id)
    }
  }, [user?.telegram_id])

  const handleDeposit = async () => {
    if (!amount || parseInt(amount) < 5000) {
      showAlert('Minimal summa: 5,000 so\'m')
      return
    }
    if (!selectedMethod) {
      showAlert('To\'lov usulini tanlang')
      return
    }
    if (!user) {
      showAlert('Foydalanuvchi topilmadi')
      return
    }

    setDepositing(true)
    hapticFeedback('heavy')

    const result = await deposit({
      telegram_id: user.telegram_id,
      amount: parseInt(amount),
      method: selectedMethod
    })

    setDepositing(false)

    if (result.success) {
      showAlert(`✅ ${new Intl.NumberFormat('uz-UZ').format(parseInt(amount))} so'm to'ldirish so'rovi qabul qilindi!\n\nBalans 3 soniyada yangilanadi.`)
      setShowDepositModal(false)
      setAmount('')
      setSelectedMethod('')
    } else {
      showAlert(result.error || 'Xatolik yuz berdi')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white"
        >
          Balans
        </motion.h1>
        <p className="text-gray-500 text-sm mt-1">
          Hisobingizni boshqaring
        </p>
      </div>

      {/* Balance Card */}
      <div className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 p-6"
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={18} className="text-white/80" />
              <span className="text-sm text-white/80">Joriy balans</span>
            </div>
            
            <h2 className="text-4xl font-bold text-white">
              {new Intl.NumberFormat('uz-UZ').format(user?.balance || 0)}
              <span className="text-lg font-normal ml-1">so'm</span>
            </h2>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  hapticFeedback('light')
                  setShowDepositModal(true)
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/30 transition-colors"
              >
                <Plus size={18} />
                To'ldirish
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white/80 hover:bg-white/20 transition-colors"
              >
                <History size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Deposit Amounts */}
      <div className="px-4 py-2">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Tez to'ldirish</h3>
        <div className="grid grid-cols-4 gap-2">
          {[10000, 25000, 50000, 100000].map((val, index) => (
            <motion.button
              key={val}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                hapticFeedback('light')
                setAmount(val.toString())
                setShowDepositModal(true)
              }}
              className="glass-card rounded-xl p-3 text-center hover:bg-white/10 transition-colors"
            >
              <span className="text-sm font-semibold text-white">
                {val >= 1000 ? `${val / 1000}K` : val}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-4 py-4">
        <h3 className="text-sm font-medium text-gray-400 mb-3">To'lov usullari</h3>
        <div className="space-y-2">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{method.name}</h4>
                <p className="text-xs text-gray-500">Tezkor va xavfsiz</p>
              </div>
              <ChevronRight size={18} className="text-gray-600" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-400">So'nggi operatsiyalar</h3>
          <button className="text-xs text-primary-400">Barchasi</button>
        </div>
        
        <div className="space-y-2">
          {transactions.length > 0 ? transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === 'deposit' 
                  ? 'bg-green-500/20' 
                  : 'bg-red-500/20'
              }`}>
                {tx.type === 'deposit' 
                  ? <ArrowDownLeft size={18} className="text-green-500" />
                  : <ArrowUpRight size={18} className="text-red-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm truncate">
                  {tx.description || (tx.type === 'deposit' ? `To'ldirish` : 'Xarid')}
                </h4>
                <p className="text-xs text-gray-500">
                  {new Date(tx.created_at).toLocaleDateString('uz-UZ')}
                </p>
              </div>
              <span className={`font-semibold ${
                tx.amount > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {tx.amount > 0 ? '+' : ''}{new Intl.NumberFormat('uz-UZ').format(tx.amount)}
              </span>
            </motion.div>
          )) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Operatsiyalar yo'q</p>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDepositModal(false)}
            className="fixed inset-0 bg-black/60 z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-dark-200 rounded-t-3xl"
          >
            <div className="pt-3 pb-2 px-4">
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />
            </div>

            <div className="px-4 pb-8">
              <h2 className="text-xl font-bold text-white mb-6">Balansni to'ldirish</h2>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Summa
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Summa kiriting"
                  className="input-field text-xl font-semibold"
                />
                <p className="text-xs text-gray-600 mt-1">Minimal: 5,000 so'm</p>
              </div>

              {/* Quick Amounts */}
              <div className="flex gap-2 mb-6">
                {[10000, 25000, 50000, 100000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      amount === val.toString()
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {val / 1000}K
                  </button>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full glass-card rounded-xl p-4 flex items-center gap-4 transition-all ${
                      selectedMethod === method.id ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>
                      {method.icon}
                    </div>
                    <span className="font-medium text-white">{method.name}</span>
                    {selectedMethod === method.id && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <Sparkles size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Deposit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeposit}
                disabled={depositing}
                className="w-full gradient-btn text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {depositing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Kutilmoqda...
                  </>
                ) : (
                  'To\'ldirish'
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

export default Balance
