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
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          FC Manager Pro
        </h1>
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
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
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
