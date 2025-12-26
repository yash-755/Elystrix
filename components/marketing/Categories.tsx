import Link from "next/link"
import { Code, Palette, TrendingUp, Database, Brain, Shield, Smartphone, Cloud } from "lucide-react"

// Define categories with slugs for matching
const categoriesConfig = [
  { icon: Code, name: "Web Development", slug: "web-development" },
  { icon: Palette, name: "UI/UX Design", slug: "ui-ux-design" },
  { icon: TrendingUp, name: "Data Science", slug: "data-science" },
  { icon: Database, name: "Backend", slug: "backend" },
  { icon: Brain, name: "Machine Learning", slug: "machine-learning" },
  { icon: Shield, name: "Cybersecurity", slug: "cybersecurity" },
  { icon: Smartphone, name: "Mobile Dev", slug: "mobile-development" },
  { icon: Cloud, name: "Cloud & DevOps", slug: "cloud-devops" },
]

interface CategoriesProps {
  categoryCounts?: Record<string, number>
}

export function Categories({ categoryCounts = {} }: CategoriesProps) {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Explore Categories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover courses across a wide range of tech domains
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categoriesConfig.map((category) => {
            // Match loosely or strictly. Assuming category field in DB stores the "Name" or "Slug"?
            // Schema comment said: category String? // e.g. "Web Development"
            // So we match by name.
            const count = categoryCounts[category.name] || 0

            return (
              <Link key={category.name} href={`/courses?category=${category.slug}`}>
                <div className="group bg-card rounded-2xl border border-border p-6 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <category.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{count} courses</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
