import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TelegramProvider } from './context/TelegramContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Orders from './pages/Orders'
import Balance from './pages/Balance'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

function App() {
  return (
    <TelegramProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:category" element={<ServiceDetail />} />
            <Route path="orders" element={<Orders />} />
            <Route path="balance" element={<Balance />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </TelegramProvider>
  )
}

export default App
