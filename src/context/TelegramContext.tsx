import React, { createContext, useContext, useEffect, useState } from 'react'
import useStore from '../store/useStore'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  language_code?: string
}

interface TelegramContextType {
  user: TelegramUser | null
  webApp: any
  ready: boolean
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
  showAlert: (message: string) => void
  showConfirm: (message: string) => Promise<boolean>
  close: () => void
  expand: () => void
  mainButton: {
    show: (text: string, onClick: () => void) => void
    hide: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
  }
}

const TelegramContext = createContext<TelegramContextType | null>(null)

export const useTelegram = () => {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return context
}

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [ready, setReady] = useState(false)
  const webApp = (window as any).Telegram?.WebApp
  const { authUser } = useStore()

  useEffect(() => {
    const initUser = async (telegramUser: TelegramUser) => {
      setUser(telegramUser)
      
      // Backend bilan autentifikatsiya
      try {
        await authUser({
          telegram_id: telegramUser.id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          username: telegramUser.username
        })
      } catch (error) {
        console.error('Auth error:', error)
      }
      
      setReady(true)
    }

    if (webApp) {
      webApp.ready()
      webApp.expand()
      webApp.enableClosingConfirmation()
      
      // Set header color
      webApp.setHeaderColor('#0f0f23')
      webApp.setBackgroundColor('#0f0f23')

      if (webApp.initDataUnsafe?.user) {
        initUser(webApp.initDataUnsafe.user)
      } else {
        // Demo user for testing outside Telegram
        initUser({
          id: 123456789,
          first_name: 'Demo',
          last_name: 'User',
          username: 'demo_user'
        })
      }
    } else {
      // Demo mode
      initUser({
        id: 123456789,
        first_name: 'Demo',
        last_name: 'User',
        username: 'demo_user'
      })
    }
  }, [])

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    webApp?.HapticFeedback?.impactOccurred(type)
  }

  const showAlert = (message: string) => {
    if (webApp?.showAlert) {
      webApp.showAlert(message)
    } else {
      alert(message)
    }
  }

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp?.showConfirm) {
        webApp.showConfirm(message, resolve)
      } else {
        resolve(confirm(message))
      }
    })
  }

  const close = () => {
    webApp?.close()
  }

  const expand = () => {
    webApp?.expand()
  }

  const mainButton = {
    show: (text: string, onClick: () => void) => {
      if (webApp?.MainButton) {
        webApp.MainButton.setText(text)
        webApp.MainButton.onClick(onClick)
        webApp.MainButton.show()
      }
    },
    hide: () => {
      webApp?.MainButton?.hide()
    },
    showProgress: (leaveActive?: boolean) => {
      webApp?.MainButton?.showProgress(leaveActive)
    },
    hideProgress: () => {
      webApp?.MainButton?.hideProgress()
    }
  }

  return (
    <TelegramContext.Provider value={{
      user,
      webApp,
      ready,
      hapticFeedback,
      showAlert,
      showConfirm,
      close,
      expand,
      mainButton
    }}>
      {children}
    </TelegramContext.Provider>
  )
}
