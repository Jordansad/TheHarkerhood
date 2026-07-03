import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const VARIANT_CLS: Record<Variant, string> = {
  primary: 'bg-accent text-black hover:bg-accent/90 font-semibold shadow-[0_0_16px_-2px_var(--color-accent)] hover:shadow-[0_0_22px_-2px_var(--color-accent)]',
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
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0',
        VARIANT_CLS[variant],
        className
      )}
      {...props}
    />
  )
})
