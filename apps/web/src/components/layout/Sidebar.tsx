import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Map, ClipboardList, NotebookPen, BookOpen,
  Flag, Award, HelpCircle, Bot, LogOut, Terminal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/use-auth'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/methodologies', label: 'Méthodologies', icon: ClipboardList },
  { to: '/journal', label: 'Journal', icon: NotebookPen },
  { to: '/wiki', label: 'Wiki', icon: BookOpen },
  { to: '/ctf', label: 'CTF', icon: Flag },
  { to: '/certifications', label: 'Certifications', icon: Award },
  { to: '/quiz', label: 'Quiz', icon: HelpCircle },
  { to: '/mentor', label: 'Mentor IA', icon: Bot },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface/50">
      <div className="flex items-center gap-2 px-5 py-5">
        <Terminal className="h-5 w-5 text-accent" />
        <span className="font-mono text-sm font-bold tracking-wide">THE HACKERHOOD</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'glow-accent bg-accent/10 text-accent'
                  : 'text-text-muted hover:bg-surface-hover hover:text-text'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 px-2 text-xs text-text-muted truncate">{user?.displayName}</div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-hover hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
