import Link from "next/link"
import { ArrowRight, BookOpen, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface LearningPathCardProps {
  id: string
  title: string
  description: string
  coursesCount: number
  estimatedHours?: number // Made optional
  certificateType?: string
  progress?: number
  href?: string // Allow overriding the link (e.g. for public vs dashboard)
}

export function LearningPathCard({
  id,
  title,
  coursesCount,
  estimatedHours,
  certificateType = "BASIC",
  progress = 0,
  href
}: LearningPathCardProps) {
  // Config for badges
  const certConfig: Record<string, { label: string; color: string }> = {
    PREMIUM: { label: "Premium Certificate", color: "text-amber-600 bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800" },
    CAREER: { label: "Career Certificate", color: "text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" },
    BASIC: { label: "Basic Certificate", color: "text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" },
  }

  const fallbackCert = {
    label: "Basic Certificate",
    color: "text-muted-foreground bg-muted border-border"
  }

  const cert = certConfig[certificateType] ?? fallbackCert
  const targetHref = href || `/paths/${id}` // Default to public route if not specified

  return (
    <Link href={targetHref} className="block group">
      <div className="bg-card hover:bg-muted/50 border border-border rounded-lg p-4 transition-all hover:border-primary/50 flex flex-col sm:flex-row sm:items-center gap-4">

        {/* Left: Icon/Badge Placeholder or just Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border", cert.color)}>
              {cert.label}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              • {coursesCount} Modules
            </span>
          </div>
          <h3 className="font-semibold text-base text-foreground group-hover:text-primary truncate transition-colors">
            {title}
          </h3>
        </div>

        {/* Right: Meta & Action */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground shrink-0 mt-2 sm:mt-0">
          {estimatedHours && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{estimatedHours}h</span>
            </div>
          )}

          {progress > 0 ? (
            <div className="w-24 flex flex-col gap-1">
              <div className="flex justify-between text-[10px]">
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          ) : (
            <div className="flex items-center gap-1 text-primary font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              View Path <ArrowRight className="h-3.5 w-3.5" />
            </div>
          )}
        </div>

      </div>
    </Link>
  )
}
