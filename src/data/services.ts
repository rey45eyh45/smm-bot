import { 
  Send, 
  Instagram, 
  Youtube, 
  Music2, 
  Phone,
  Users,
  Eye,
  Heart,
  ThumbsUp,
  MessageCircle,
  Share2,
  PlayCircle,
  UserPlus
} from 'lucide-react'

export interface Service {
  id: string
  name: string
  nameUz: string
  description: string
  price: number
  minQuantity: number
  maxQuantity: number
  deliveryTime: string
  icon: string
}

export interface ServiceCategory {
  id: string
  name: string
  nameUz: string
  icon: any
  color: string
  gradient: string
  services: Service[]
}

export const categories: ServiceCategory[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    nameUz: 'Telegram',
    icon: Send,
    color: '#0088cc',
    gradient: 'from-blue-500 to-cyan-400',
    services: [
      {
        id: 'tg-subscribers',
        name: 'Subscribers',
        nameUz: 'Obunachi',
        description: 'Kanalingizga real obunachi qo\'shing',
        price: 15,
        minQuantity: 100,
        maxQuantity: 100000,
        deliveryTime: '1-24 soat',
        icon: 'users'
      },
      {
        id: 'tg-views',
        name: 'Post Views',
        nameUz: 'Post ko\'rishlar',
        description: 'Postlaringizga ko\'rish qo\'shing',
        price: 5,
        minQuantity: 100,
        maxQuantity: 1000000,
        deliveryTime: '0-1 soat',
        icon: 'eye'
      },
      {
        id: 'tg-reactions',
        name: 'Reactions',
        nameUz: 'Reaksiyalar',
        description: 'Postlaringizga reaksiya qo\'shing',
        price: 8,
        minQuantity: 50,
        maxQuantity: 50000,
        deliveryTime: '0-6 soat',
        icon: 'heart'
      },
      {
        id: 'tg-comments',
        name: 'Comments',
        nameUz: 'Izohlar',
        description: 'Postlaringizga izoh qo\'shing',
        price: 50,
        minQuantity: 10,
        maxQuantity: 5000,
        deliveryTime: '1-12 soat',
        icon: 'message'
      },
      {
        id: 'tg-shares',
        name: 'Shares',
        nameUz: 'Ulashishlar',
        description: 'Postlaringizni ulashish',
        price: 20,
        minQuantity: 50,
        maxQuantity: 10000,
        deliveryTime: '1-6 soat',
        icon: 'share'
      }
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    nameUz: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    gradient: 'from-pink-500 via-purple-500 to-orange-400',
    services: [
      {
        id: 'ig-followers',
        name: 'Followers',
        nameUz: 'Obunachilar',
        description: 'Profilingizga follower qo\'shing',
        price: 25,
        minQuantity: 100,
        maxQuantity: 100000,
        deliveryTime: '1-48 soat',
        icon: 'users'
      },
      {
        id: 'ig-likes',
        name: 'Likes',
        nameUz: 'Layklar',
        description: 'Postlaringizga like qo\'shing',
        price: 10,
        minQuantity: 50,
        maxQuantity: 50000,
        deliveryTime: '0-6 soat',
        icon: 'heart'
      },
      {
        id: 'ig-views',
        name: 'Video Views',
        nameUz: 'Video ko\'rishlar',
        description: 'Video va Reels ko\'rishlar',
        price: 8,
        minQuantity: 100,
        maxQuantity: 1000000,
        deliveryTime: '0-3 soat',
        icon: 'play'
      },
      {
        id: 'ig-comments',
        name: 'Comments',
        nameUz: 'Izohlar',
        description: 'Postlaringizga izoh qo\'shing',
        price: 60,
        minQuantity: 10,
        maxQuantity: 5000,
        deliveryTime: '1-24 soat',
        icon: 'message'
      },
      {
        id: 'ig-story-views',
        name: 'Story Views',
        nameUz: 'Story ko\'rishlar',
        description: 'Story ko\'rishlarini oshiring',
        price: 12,
        minQuantity: 100,
        maxQuantity: 50000,
        deliveryTime: '0-1 soat',
        icon: 'eye'
      }
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    nameUz: 'YouTube',
    icon: Youtube,
    color: '#FF0000',
    gradient: 'from-red-500 to-red-600',
    services: [
      {
        id: 'yt-subscribers',
        name: 'Subscribers',
        nameUz: 'Obunachilar',
        description: 'Kanalingizga obunachi qo\'shing',
        price: 80,
        minQuantity: 100,
        maxQuantity: 50000,
        deliveryTime: '1-7 kun',
        icon: 'users'
      },
      {
        id: 'yt-views',
        name: 'Views',
        nameUz: 'Ko\'rishlar',
        description: 'Videolaringizga ko\'rish qo\'shing',
        price: 30,
        minQuantity: 500,
        maxQuantity: 1000000,
        deliveryTime: '1-24 soat',
        icon: 'eye'
      },
      {
        id: 'yt-likes',
        name: 'Likes',
        nameUz: 'Layklar',
        description: 'Videolaringizga like qo\'shing',
        price: 40,
        minQuantity: 50,
        maxQuantity: 50000,
        deliveryTime: '1-48 soat',
        icon: 'thumbsup'
      },
      {
        id: 'yt-comments',
        name: 'Comments',
        nameUz: 'Izohlar',
        description: 'Videolaringizga izoh qo\'shing',
        price: 100,
        minQuantity: 10,
        maxQuantity: 5000,
        deliveryTime: '1-3 kun',
        icon: 'message'
      },
      {
        id: 'yt-watch-time',
        name: 'Watch Time',
        nameUz: 'Ko\'rish vaqti',
        description: 'Monetizatsiya uchun soatlar',
        price: 200,
        minQuantity: 100,
        maxQuantity: 10000,
        deliveryTime: '1-7 kun',
        icon: 'play'
      }
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    nameUz: 'TikTok',
    icon: Music2,
    color: '#000000',
    gradient: 'from-pink-500 via-black to-cyan-400',
    services: [
      {
        id: 'tt-followers',
        name: 'Followers',
        nameUz: 'Obunachilar',
        description: 'Profilingizga follower qo\'shing',
        price: 20,
        minQuantity: 100,
        maxQuantity: 100000,
        deliveryTime: '1-24 soat',
        icon: 'users'
      },
      {
        id: 'tt-likes',
        name: 'Likes',
        nameUz: 'Layklar',
        description: 'Videolaringizga like qo\'shing',
        price: 8,
        minQuantity: 100,
        maxQuantity: 100000,
        deliveryTime: '0-6 soat',
        icon: 'heart'
      },
      {
        id: 'tt-views',
        name: 'Views',
        nameUz: 'Ko\'rishlar',
        description: 'Videolaringizga ko\'rish qo\'shing',
        price: 5,
        minQuantity: 1000,
        maxQuantity: 10000000,
        deliveryTime: '0-3 soat',
        icon: 'eye'
      },
      {
        id: 'tt-shares',
        name: 'Shares',
        nameUz: 'Ulashishlar',
        description: 'Videolaringizni ulashish',
        price: 15,
        minQuantity: 100,
        maxQuantity: 50000,
        deliveryTime: '1-12 soat',
        icon: 'share'
      },
      {
        id: 'tt-comments',
        name: 'Comments',
        nameUz: 'Izohlar',
        description: 'Videolaringizga izoh qo\'shing',
        price: 50,
        minQuantity: 10,
        maxQuantity: 5000,
        deliveryTime: '1-24 soat',
        icon: 'message'
      }
    ]
  },
  {
    id: 'sms',
    name: 'Virtual Numbers',
    nameUz: 'Virtual Raqamlar',
    icon: Phone,
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-400',
    services: [
      {
        id: 'sms-telegram',
        name: 'Telegram SMS',
        nameUz: 'Telegram uchun SMS',
        description: 'Telegram ro\'yxatdan o\'tish',
        price: 3000,
        minQuantity: 1,
        maxQuantity: 100,
        deliveryTime: '0-5 daqiqa',
        icon: 'phone'
      },
      {
        id: 'sms-instagram',
        name: 'Instagram SMS',
        nameUz: 'Instagram uchun SMS',
        description: 'Instagram ro\'yxatdan o\'tish',
        price: 4000,
        minQuantity: 1,
        maxQuantity: 100,
        deliveryTime: '0-5 daqiqa',
        icon: 'phone'
      },
      {
        id: 'sms-whatsapp',
        name: 'WhatsApp SMS',
        nameUz: 'WhatsApp uchun SMS',
        description: 'WhatsApp ro\'yxatdan o\'tish',
        price: 5000,
        minQuantity: 1,
        maxQuantity: 100,
        deliveryTime: '0-5 daqiqa',
        icon: 'phone'
      },
      {
        id: 'sms-google',
        name: 'Google SMS',
        nameUz: 'Google uchun SMS',
        description: 'Google ro\'yxatdan o\'tish',
        price: 3500,
        minQuantity: 1,
        maxQuantity: 100,
        deliveryTime: '0-5 daqiqa',
        icon: 'phone'
      },
      {
        id: 'sms-other',
        name: 'Other Services',
        nameUz: 'Boshqa xizmatlar',
        description: 'Boshqa platformalar uchun',
        price: 2500,
        minQuantity: 1,
        maxQuantity: 100,
        deliveryTime: '0-10 daqiqa',
        icon: 'phone'
      }
    ]
  }
]

export const getServiceIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    users: Users,
    eye: Eye,
    heart: Heart,
    thumbsup: ThumbsUp,
    message: MessageCircle,
    share: Share2,
    play: PlayCircle,
    phone: Phone,
    userplus: UserPlus
  }
  return icons[iconName] || Users
}

export const getCategoryById = (id: string) => {
  return categories.find(cat => cat.id === id)
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
}

export const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
