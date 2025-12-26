import Link from "next/link"
import { ArrowRight, Play, Award, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PLATFORM_STATS } from "@/lib/constants"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 dark:opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-20 dark:opacity-10" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="text-sm font-medium text-primary">Now with AI-powered learning paths</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            <span className="text-foreground">Learn Smarter with</span>
            <br />
            <span className="text-primary">YouTube + Certificates</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Transform your YouTube learning into verified credentials. Curated courses, structured paths, and recognized
            certificates that matter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/courses">
              <Button
                size="lg"
                className="text-lg px-8 h-14"
              >
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 h-14"
              >
                <Play className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {PLATFORM_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.icon === 'BookOpen' && <BookOpen className="h-6 w-6 text-primary" />}
                  {stat.icon === 'Users' && <Users className="h-6 w-6 text-primary" />}
                  {stat.icon === 'Award' && <Award className="h-6 w-6 text-primary" />}
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/10">
            <img src="/hero-preview.png" alt="Platform Preview" className="w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
