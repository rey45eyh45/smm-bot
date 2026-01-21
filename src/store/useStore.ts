import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

interface User {
  id: number
  telegram_id: number
  first_name: string
  last_name?: string
  username?: string
  balance: number
  total_orders: number
  total_spent: number
  is_premium: number
  referral_code: string
  created_at: string
}

interface Order {
  id: number
  order_id: string
  user_id: number
  service_id: string
  service_name: string
  category: string
  link: string
  quantity: number
  price: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  progress: number
  created_at: string
  completed_at?: string
}

interface Transaction {
  id: number
  transaction_id: string
  user_id: number
  type: 'deposit' | 'purchase' | 'refund'
  amount: number
  method?: string
  status: string
  description: string
  created_at: string
}

interface AppState {
  user: User | null
  orders: Order[]
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  hideNavigation: boolean

  // Actions
  setUser: (user: User | null) => void
  setOrders: (orders: Order[]) => void
  setTransactions: (transactions: Transaction[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setHideNavigation: (hide: boolean) => void

  // API Actions
  authUser: (userData: { telegram_id: number; first_name: string; last_name?: string; username?: string }) => Promise<void>
  fetchUser: (telegram_id: number) => Promise<void>
  fetchOrders: (telegram_id: number, status?: string) => Promise<void>
  fetchTransactions: (telegram_id: number) => Promise<void>
  createOrder: (orderData: any) => Promise<{ success: boolean; error?: string; order?: Order }>
  deposit: (data: { telegram_id: number; amount: number; method: string }) => Promise<{ success: boolean; error?: string }>
  updateBalance: (amount: number) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      transactions: [],
      isLoading: false,
      error: null,
      hideNavigation: false,

      setUser: (user) => set({ user }),
      setOrders: (orders) => set({ orders }),
      setTransactions: (transactions) => set({ transactions }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setHideNavigation: (hideNavigation) => set({ hideNavigation }),

      authUser: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.authUser(userData)
          if (response.success && response.user) {
            set({ user: response.user })
          }
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      fetchUser: async (telegram_id) => {
        try {
          const response = await api.getUser(telegram_id)
          if (response.success && response.user) {
            set({ user: response.user })
          }
        } catch (error: any) {
          console.error('Fetch user error:', error)
        }
      },

      fetchOrders: async (telegram_id, status) => {
        set({ isLoading: true })
        try {
          const response = await api.getOrders(telegram_id, status)
          if (response.success && response.orders) {
            set({ orders: response.orders })
          }
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      fetchTransactions: async (telegram_id) => {
        try {
          const response = await api.getTransactions(telegram_id)
          if (response.success && response.transactions) {
            set({ transactions: response.transactions })
          }
        } catch (error: any) {
          console.error('Fetch transactions error:', error)
        }
      },

      createOrder: async (orderData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.createOrder(orderData)
          if (response.success) {
            // Update user balance
            if (response.user) {
              set({ user: response.user })
            }
            // Add order to list
            if (response.order) {
              set((state) => ({ orders: [response.order, ...state.orders] }))
            }
            return { success: true, order: response.order }
          }
          return { success: false, error: response.error }
        } catch (error: any) {
          set({ error: error.message })
          return { success: false, error: error.message }
        } finally {
          set({ isLoading: false })
        }
      },

      deposit: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.deposit(data)
          if (response.success) {
            // Balans 3 soniyadan keyin yangilanadi (server tomonida)
            setTimeout(() => {
              get().fetchUser(data.telegram_id)
              get().fetchTransactions(data.telegram_id)
            }, 3500)
            return { success: true }
          }
          return { success: false, error: response.error }
        } catch (error: any) {
          set({ error: error.message })
          return { success: false, error: error.message }
        } finally {
          set({ isLoading: false })
        }
      },

      updateBalance: (amount) => {
        set((state) => ({
          user: state.user ? { ...state.user, balance: state.user.balance + amount } : null
        }))
      }
    }),
    {
      name: 'smm-bot-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
)

export default useStore
