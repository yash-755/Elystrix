import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    positive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border p-6 transition-all hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-sm font-medium px-2 py-1 rounded-full",
              trend.positive ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10",
            )}
          >
            {trend.positive ? "+" : "-"}
            {trend.value}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
      {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
    </div>
  )
}
