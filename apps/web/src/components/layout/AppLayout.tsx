import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { LogoWatermark } from '@/components/ui/LogoWatermark'

export function AppLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="relative flex-1 overflow-y-auto px-8 py-8">
        <LogoWatermark className="left-1/2 top-1/2 h-[90vh] w-[90vh] -translate-x-1/2 -translate-y-1/2 fixed" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
