import { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'secondary' | 'ghost'
  confirmClassName?: string
  onConfirm: () => void
  onCancel: () => void
  icon?: ReactNode
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  confirmClassName,
  onConfirm,
  onCancel,
  icon,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
        <div className="mb-4 flex items-start gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-200">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            {description && <p className="mt-1 text-sm text-slate-300">{description}</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} className={`flex-1 ${confirmClassName ?? ''}`} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
