/**
 * SMM Panel API Service
 * Supports multiple SMM panels with a unified interface
 */

class SMMApiService {
  constructor() {
    // SMM Panel konfiguratsiyasi
    this.apiUrl = process.env.SMM_API_URL || 'https://smmworld.su/api/v2'
    this.apiKey = process.env.SMM_API_KEY || ''
    
    // Service ID mapping - SMM panel service ID'lari
    this.serviceMapping = {
      // Telegram
      'tg-members': process.env.SMM_TG_MEMBERS || '1001',
      'tg-views': process.env.SMM_TG_VIEWS || '1002',
      'tg-reactions': process.env.SMM_TG_REACTIONS || '1003',
      'tg-premium-members': process.env.SMM_TG_PREMIUM || '1004',
      
      // Instagram
      'ig-followers': process.env.SMM_IG_FOLLOWERS || '2001',
      'ig-likes': process.env.SMM_IG_LIKES || '2002',
      'ig-views': process.env.SMM_IG_VIEWS || '2003',
      'ig-comments': process.env.SMM_IG_COMMENTS || '2004',
      
      // YouTube
      'yt-subscribers': process.env.SMM_YT_SUBS || '3001',
      'yt-views': process.env.SMM_YT_VIEWS || '3002',
      'yt-likes': process.env.SMM_YT_LIKES || '3003',
      'yt-watch-time': process.env.SMM_YT_WATCH || '3004',
      
      // TikTok
      'tt-followers': process.env.SMM_TT_FOLLOWERS || '4001',
      'tt-likes': process.env.SMM_TT_LIKES || '4002',
      'tt-views': process.env.SMM_TT_VIEWS || '4003',
      'tt-shares': process.env.SMM_TT_SHARES || '4004',
    }
  }

  /**
   * SMM Panel API'ga so'rov yuborish
   */
  async makeRequest(action, params = {}) {
    try {
      const body = new URLSearchParams({
        key: this.apiKey,
        action,
        ...params
      })

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString()
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('SMM API error:', error)
      throw new Error('SMM API bilan bog\'lanishda xatolik')
    }
  }

  /**
   * Balansni tekshirish
   */
  async getBalance() {
    if (!this.apiKey) {
      return { balance: 'API key sozlanmagan', currency: 'USD' }
    }
    
    const result = await this.makeRequest('balance')
    return {
      balance: result.balance || 0,
      currency: result.currency || 'USD'
    }
  }

  /**
   * Mavjud xizmatlar ro'yxati
   */
  async getServices() {
    if (!this.apiKey) {
      return []
    }
    
    const result = await this.makeRequest('services')
    return Array.isArray(result) ? result : []
  }

  /**
   * Yangi buyurtma yaratish
   */
  async createOrder(serviceId, link, quantity) {
    // Service ID'ni SMM panel ID'siga o'girish
    const smmServiceId = this.serviceMapping[serviceId] || serviceId
    
    // API key yo'q bo'lsa, demo rejim
    if (!this.apiKey) {
      console.log(`📦 Demo buyurtma: ${serviceId} - ${quantity} ta - ${link}`)
      return {
        success: true,
        order: Math.floor(Math.random() * 1000000),
        demo: true
      }
    }

    const result = await this.makeRequest('add', {
      service: smmServiceId,
      link: link,
      quantity: quantity
    })

    if (result.error) {
      throw new Error(result.error)
    }

    return {
      success: true,
      order: result.order,
      demo: false
    }
  }

  /**
   * Buyurtma holatini tekshirish
   */
  async getOrderStatus(orderId) {
    if (!this.apiKey) {
      // Demo rejimda tasodifiy holat
      const statuses = ['Pending', 'In progress', 'Completed']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      return {
        status: randomStatus,
        charge: '0',
        start_count: '0',
        remains: '0'
      }
    }

    const result = await this.makeRequest('status', { order: orderId })
    return result
  }

  /**
   * Bir nechta buyurtmalarni tekshirish
   */
  async getMultipleOrderStatus(orderIds) {
    if (!this.apiKey) {
      return orderIds.map(id => ({
        order: id,
        status: 'Completed',
        charge: '0',
        start_count: '0',
        remains: '0'
      }))
    }

    const result = await this.makeRequest('status', { 
      orders: orderIds.join(',') 
    })
    return result
  }

  /**
   * Buyurtmani bekor qilish (refill qilish)
   */
  async refillOrder(orderId) {
    if (!this.apiKey) {
      return { refill: Math.floor(Math.random() * 1000) }
    }

    const result = await this.makeRequest('refill', { order: orderId })
    return result
  }

  /**
   * Buyurtmani bekor qilish
   */
  async cancelOrder(orderId) {
    if (!this.apiKey) {
      return { success: true, message: 'Demo order cancelled' }
    }

    const result = await this.makeRequest('cancel', { order: orderId })
    return result
  }
}

// Singleton instance
const smmApi = new SMMApiService()

export default smmApi
