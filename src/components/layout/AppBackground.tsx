import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface AppBackgroundProps {
  children: ReactNode
  className?: string
}

export default function AppBackground({ children, className }: AppBackgroundProps) {
  return (
    <div className={cn('relative min-h-screen bg-slate-950 text-slate-100 antialiased', className)}>
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl opacity-20" />
        <div className="absolute top-40 right-10 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl opacity-20" />
        <div className="absolute bottom-10 left-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl opacity-20" />
      </div>
      <div className="relative z-10 min-h-screen selection:bg-indigo-500/30 selection:text-slate-100">
        {children}
      </div>
    </div>
  )
}
