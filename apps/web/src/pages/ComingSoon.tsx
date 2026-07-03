import type { LucideIcon } from 'lucide-react'

export function ComingSoon({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
      <Icon className="mb-4 h-10 w-10 text-text-muted" />
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mt-1.5 max-w-sm text-sm text-text-muted">{description}</p>
      <span className="mt-4 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
        À venir dans une prochaine phase
      </span>
    </div>
  )
}
