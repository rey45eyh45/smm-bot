const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://smm-bot-production-7f9d.up.railway.app/api'

interface ApiResponse {
  success: boolean
  error?: string
  [key: string]: any
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_URL
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'So\'rov xatosi')
      }

      return data
    } catch (error: any) {
      console.error('API Error:', error)
      throw error
    }
  }

  // ==================== USERS ====================

  async authUser(userData: {
    telegram_id: number
    first_name: string
    last_name?: string
    username?: string
  }) {
    return this.request('/users/auth', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getUser(telegram_id: number) {
    return this.request(`/users/${telegram_id}`)
  }

  // ==================== ORDERS ====================

  async createOrder(orderData: {
    telegram_id: number
    service_id: string
    service_name: string
    category: string
    link: string
    quantity: number
    price: number
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getOrders(telegram_id: number, status?: string) {
    const query = status && status !== 'all' ? `?status=${status}` : ''
    return this.request(`/orders/${telegram_id}${query}`)
  }

  async getOrderDetail(order_id: string) {
    return this.request(`/orders/detail/${order_id}`)
  }

  // ==================== BALANCE ====================

  async deposit(data: {
    telegram_id: number
    amount: number
    method: string
  }) {
    return this.request('/balance/deposit', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTransactions(telegram_id: number) {
    return this.request(`/transactions/${telegram_id}`)
  }

  // ==================== PROMO ====================

  async applyPromo(data: {
    telegram_id: number
    code: string
    order_amount?: number
  }) {
    return this.request('/promo/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ==================== STATS ====================

  async getStats(telegram_id: number) {
    return this.request(`/stats/${telegram_id}`)
  }

  // ==================== HEALTH ====================

  async healthCheck() {
    return this.request('/health')
  }
}

export const api = new ApiService()
export default api
