import { cn } from '@/lib/utils'

export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="The Hackerhood"
      width={size}
      height={size}
      className={cn('rounded-lg object-contain', className)}
    />
  )
}
