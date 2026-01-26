import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}

export default function Container({ className, ...props }: ContainerProps) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4', className)} {...props} />
}
