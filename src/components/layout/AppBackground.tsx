import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface AppBackgroundProps {
  children: ReactNode
  className?: string
}

export default function AppBackground({ children, className }: AppBackgroundProps) {
  return (
    <div className={cn('relative min-h-screen text-slate-100 antialiased', className)}>
      <div className="fixed top-2 left-2 z-[9999] rounded-xl bg-fuchsia-600 px-3 py-2 text-white shadow-lg">
        THEME ACTIVE
      </div>
      <div className="pointer-events-none absolute inset-0 bg-slate-950" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-24 right-10 h-64 w-64 rounded-full bg-sky-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-64 w-64 rounded-full bg-emerald-500/15 blur-[120px]" />
      <div className="relative z-10 selection:bg-indigo-500/30 selection:text-slate-100">
        {children}
      </div>
    </div>
  )
}
