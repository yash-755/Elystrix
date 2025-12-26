import Link from "next/link"
import { Clock, BookOpen, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface CourseCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  modules: number
  level: "Beginner" | "Intermediate" | "Advanced"
  rating?: number
  category: string
  progress?: number
}

export function CourseCard({
  id,
  title,
  description,
  thumbnail,
  duration,
  modules,
  level,
  rating,
  category,
  progress,
}: CourseCardProps) {
  const levelColors = {
    Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    Intermediate: "bg-primary/10 text-primary border-primary/20",
    Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  return (
    <Link href={`/courses/${id}`}>
      <div className="group relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge variant="outline" className={cn("absolute top-3 left-3", levelColors[level])}>
            {level}
          </Badge>
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{category}</p>
          <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {duration}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {modules} modules
              </span>
            </div>
            {rating && (
              <span className="flex items-center gap-1 text-primary">
                <Star className="h-4 w-4 fill-primary" />
                {rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
