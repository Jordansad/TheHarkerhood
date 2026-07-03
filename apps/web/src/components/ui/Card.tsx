import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_28px_-10px_var(--color-accent)]',
        className
      )}
      {...props}
    />
  )
}
