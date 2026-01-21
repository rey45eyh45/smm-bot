import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronRight, Calculator, Clock, Info, ShoppingCart, Tag, Loader2 } from 'lucide-react'
import { getCategoryById, getServiceIcon, formatPrice, formatNumber, Service } from '../data/services'
import { useTelegram } from '../context/TelegramContext'
import useStore from '../store/useStore'
import api from '../services/api'

const ServiceDetail = () => {
  const { category } = useParams()
  const navigate = useNavigate()
  const { hapticFeedback, showAlert } = useTelegram()
  const { user, createOrder, setHideNavigation } = useStore()
  
  const categoryData = getCategoryById(category || '')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [quantity, setQuantity] = useState('')
  const [link, setLink] = useState('')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoLoading, setPromoLoading] = useState(false)

  useEffect(() => {
    setHideNavigation(showOrderForm)
  }, [showOrderForm])

  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-white">Kategoriya topilmadi</h2>
          <Link to="/services" className="text-primary-400 text-sm mt-2 inline-block">
            Orqaga qaytish
          </Link>
        </div>
      </div>
    )
  }

  const Icon = categoryData.icon
  const basePrice = selectedService && quantity 
    ? (selectedService.price * parseInt(quantity || '0') / 1000)
    : 0
  const totalPrice = basePrice - promoDiscount

  const handleServiceSelect = (service: Service) => {
    hapticFeedback('light')
    setSelectedService(service)
    setQuantity(service.minQuantity.toString())
    setPromoCode('')
    setPromoDiscount(0)
    setPromoApplied(false)
    setShowOrderForm(true)
  }

  const handleApplyPromo = async () => {
    if (!promoCode || !user) return
    
    setPromoLoading(true)
    try {
      const response = await api.applyPromo({
        telegram_id: user.telegram_id,
        code: promoCode,
        order_amount: basePrice
      })
      
      if (response.success && response.promo) {
        setPromoDiscount(response.promo.calculated_discount)
        setPromoApplied(true)
        hapticFeedback('heavy')
        showAlert(`✅ Promo kod qo'llandi!\nChegirma: ${formatPrice(response.promo.calculated_discount)}`)
      }
    } catch (error: any) {
      showAlert(error.message || 'Promo kod xato')
      setPromoApplied(false)
      setPromoDiscount(0)
    } finally {
      setPromoLoading(false)
    }
  }

  const handleOrder = async () => {
    if (!link) {
      showAlert('Iltimos, havola kiriting!')
      return
    }
    if (!quantity || parseInt(quantity) < (selectedService?.minQuantity || 0)) {
      showAlert(`Minimal miqdor: ${selectedService?.minQuantity}`)
      return
    }
    if (!user) {
      showAlert('Foydalanuvchi topilmadi')
      return
    }
    if ((user.balance || 0) < totalPrice) {
      showAlert(`Balans yetarli emas!\n\nKerakli: ${formatPrice(totalPrice)}\nBalans: ${formatPrice(user.balance || 0)}`)
      return
    }
    
    hapticFeedback('heavy')

    const result = await createOrder({
      telegram_id: user.telegram_id,
      service_id: selectedService!.id,
      service_name: selectedService!.nameUz,
      category: categoryData.id,
      link,
      quantity: parseInt(quantity),
      price: totalPrice
    })

    if (result.success) {
      showAlert(`✅ Buyurtma qabul qilindi!\n\n📦 ID: ${result.order?.order_id}\n📌 ${selectedService?.nameUz}\n📊 Miqdor: ${formatNumber(parseInt(quantity))}\n💰 Summa: ${formatPrice(totalPrice)}`)
      setShowOrderForm(false)
      setSelectedService(null)
      setLink('')
      setQuantity('')
      setPromoCode('')
      setPromoDiscount(0)
      setPromoApplied(false)
    } else {
      showAlert(result.error || 'Xatolik yuz berdi')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Orqaga</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryData.gradient}`}>
            <Icon size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{categoryData.nameUz}</h1>
            <p className="text-gray-500 text-sm">{categoryData.services.length} xizmat mavjud</p>
          </div>
        </motion.div>
      </div>

      {/* Services List */}
      <div className="px-4 py-4 space-y-3">
        {categoryData.services.map((service, index) => {
          const ServiceIcon = getServiceIcon(service.icon)
          const isSelected = selectedService?.id === service.id
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleServiceSelect(service)}
              className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${categoryData.gradient}/20`}>
                  <ServiceIcon size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{service.nameUz}</h3>
                    <ChevronRight size={18} className="text-gray-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calculator size={12} className="text-primary-400" />
                      <span className="text-gray-400">
                        {formatPrice(service.price)}<span className="text-gray-600">/1K</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock size={12} className="text-green-400" />
                      <span className="text-gray-400">{service.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && selectedService && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderForm(false)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-dark-200 rounded-t-3xl max-h-[85vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="sticky top-0 bg-dark-200 pt-3 pb-2 px-4">
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />
              </div>

              <div className="px-4 pb-8">
                {/* Service Info */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryData.gradient}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedService.nameUz}</h2>
                    <p className="text-sm text-gray-500">{categoryData.nameUz}</p>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Link Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Havola
                    </label>
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://..."
                      className="input-field"
                    />
                    <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1">
                      <Info size={12} />
                      Post yoki profil havolasini kiriting
                    </p>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Miqdor
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min={selectedService.minQuantity}
                      max={selectedService.maxQuantity}
                      className="input-field"
                    />
                    <div className="flex justify-between mt-1.5">
                      <span className="text-xs text-gray-600">
                        Min: {formatNumber(selectedService.minQuantity)}
                      </span>
                      <span className="text-xs text-gray-600">
                        Max: {formatNumber(selectedService.maxQuantity)}
                      </span>
                    </div>

                    {/* Quick Select */}
                    <div className="flex gap-2 mt-3">
                      {[1000, 5000, 10000, 50000].map((val) => (
                        val <= selectedService.maxQuantity && val >= selectedService.minQuantity && (
                          <button
                            key={val}
                            onClick={() => setQuantity(val.toString())}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              quantity === val.toString()
                                ? 'bg-primary-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {formatNumber(val)}
                          </button>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="glass-card rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Narx (1K)</span>
                      <span className="text-white">{formatPrice(selectedService.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Miqdor</span>
                      <span className="text-white">{formatNumber(parseInt(quantity || '0'))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Yetkazish</span>
                      <span className="text-green-400">{selectedService.deliveryTime}</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Chegirma</span>
                        <span className="text-green-400">-{formatPrice(promoDiscount)}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-white">Jami</span>
                        <span className="text-lg font-bold gradient-text">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      <Tag size={14} className="inline mr-1" />
                      Promo kod (ixtiyoriy)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="YANGI20"
                        disabled={promoApplied}
                        className="input-field flex-1"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleApplyPromo}
                        disabled={promoLoading || promoApplied || !promoCode}
                        className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 ${
                          promoApplied 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30'
                        } disabled:opacity-50 transition-all`}
                      >
                        {promoLoading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : promoApplied ? (
                          '✓ Qo\'llandi'
                        ) : (
                          'Qo\'llash'
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Order Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOrder}
                    className="w-full gradient-btn text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Buyurtma berish
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ServiceDetail
