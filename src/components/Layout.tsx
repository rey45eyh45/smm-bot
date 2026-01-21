import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navigation from './Navigation'
import Header from './Header'

const Layout = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-dark-400 flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-60 h-60 bg-purple-500/15 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 right-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-[60px]" />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 relative z-10 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  )
}

export default Layout
