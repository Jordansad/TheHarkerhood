import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, ClipboardList, NotebookPen, BookOpen,
  Flag, Award, HelpCircle, Bot, LogOut, Zap, Users, ScrollText, ShieldAlert, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/use-auth'
import { canViewAdmin } from '@/lib/can-view-admin'
import { ROLE_LABEL } from '@/lib/user-role'
import { Logo } from '@/components/ui/Logo'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/methodologies', label: 'Méthodologies', icon: ClipboardList },
  { to: '/activites', label: 'Activités', icon: Zap },
  { to: '/journal', label: 'Journal', icon: NotebookPen },
  { to: '/wiki', label: 'Wiki', icon: BookOpen },
  { to: '/ctf', label: 'CTF', icon: Flag },
  { to: '/certifications', label: 'Certifications', icon: Award },
  { to: '/quiz', label: 'Quiz', icon: HelpCircle },
  { to: '/mentor', label: 'Mentor IA', icon: Bot },
  { to: '/equipe', label: 'Équipe', icon: Users },
  { to: '/charte', label: 'Charte', icon: ScrollText },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const navItems = canViewAdmin(user?.role)
    ? [...NAV_ITEMS, { to: '/admin', label: 'Admin', icon: ShieldAlert }]
    : NAV_ITEMS

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface transition-transform duration-300 md:sticky md:top-0 md:z-auto md:translate-x-0 md:bg-surface/50',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
      <div className="flex items-center justify-between gap-2 px-5 py-5">
        <div className="flex items-center gap-2">
          <Logo size={26} />
          <span className="font-mono text-sm font-bold">HACKERHOOD</span>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text md:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="relative block rounded-lg" end={to === '/dashboard'} onClick={onClose}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-highlight"
                    className="glow-accent absolute inset-0 rounded-lg bg-accent/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={cn(
                    'relative z-10 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'text-accent' : 'text-text-muted hover:bg-surface-hover hover:text-text'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 px-2 truncate">
          <p className="text-xs text-text-muted">{user?.displayName}</p>
          {user && <p className="text-[10px] text-accent">{ROLE_LABEL[user.role]}</p>}
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-hover hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
      </aside>
    </>
  )
}
