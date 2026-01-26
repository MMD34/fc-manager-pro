import { Link, useLocation } from 'react-router-dom'
import { Home, Users, ArrowRightLeft, DollarSign, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SidebarProps {
  careerId: string
}

const navItems = [
  { path: 'overview', label: 'Overview', icon: Home },
  { path: 'squad', label: 'Squad', icon: Users },
  { path: 'transfers', label: 'Transfers', icon: ArrowRightLeft },
  { path: 'finances', label: 'Finances', icon: DollarSign },
  { path: 'journal', label: 'Journal', icon: BookOpen },
]

export default function Sidebar({ careerId }: SidebarProps) {
  const location = useLocation()

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-950/40 backdrop-blur-xl flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-slate-100">FC Manager Pro</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const path = `/career/${careerId}/${item.path}`
            const isActive = location.pathname === path
            const Icon = item.icon

            return (
              <li key={item.path}>
                <Link
                  to={path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive ? 'bg-indigo-500/15 text-indigo-200' : 'text-slate-300 hover:bg-white/5'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
