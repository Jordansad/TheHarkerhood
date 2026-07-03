import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const VARIANT_CLS: Record<Variant, string> = {
  primary: 'bg-accent text-black hover:bg-accent/90 font-semibold',
  secondary: 'bg-surface border border-border hover:bg-surface-hover text-text',
  ghost: 'hover:bg-surface text-text-muted hover:text-text',
  danger: 'bg-danger/10 border border-danger/40 text-danger hover:bg-danger/20',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = 'primary', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none',
        VARIANT_CLS[variant],
        className
      )}
      {...props}
    />
  )
})
