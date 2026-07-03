import * as Progress from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <Progress.Root
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-border', className)}
      value={value}
    >
      <Progress.Indicator
        className="h-full rounded-full bg-accent transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </Progress.Root>
  )
}
