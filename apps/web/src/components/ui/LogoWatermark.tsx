import { cn } from '@/lib/utils'

/** Grand logo en filigrane, utilisé en fond de page pour renforcer l'identité visuelle. */
export function LogoWatermark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt=""
      aria-hidden="true"
      className={cn('pointer-events-none absolute select-none opacity-[0.06]', className)}
    />
  )
}
