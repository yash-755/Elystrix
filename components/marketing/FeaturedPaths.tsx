import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LearningPathCard } from "@/components/learning-path-card"

interface FeaturedPathsProps {
  paths: any[] // Using any[] temporarily while schema generates, but practically it matches LearningPath structure
}

export function FeaturedPaths({ paths = [] }: FeaturedPathsProps) {
  if (paths.length === 0) return null

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Learning Paths</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Structured roadmaps to help you achieve your career goals
            </p>
          </div>
          <Link href="/paths" className="mt-4 md:mt-0">
            <Button variant="ghost" className="group text-primary">
              View All Paths
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {paths.map((path) => (
            <LearningPathCard key={path.id} {...path}
              // Map DB fields to Card props if needed
              coursesCount={path.courses?.length || 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
