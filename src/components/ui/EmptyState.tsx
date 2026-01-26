import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-300">
          {icon}
        </div>
      )}
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      {description && <p className="mt-2 text-sm text-slate-300">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
