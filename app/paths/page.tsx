import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LearningPathCard } from "@/components/learning-path-card"
import { getPublicLearningPaths } from "@/app/actions/learning-paths"
import { AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PathsPage() {
  const learningPaths = await getPublicLearningPaths()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Learning Paths</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Structured roadmaps to help you achieve your career goals with curated courses and verified
                certifications.
              </p>
            </div>

            {learningPaths.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {learningPaths.map((path: any) => (
                  <LearningPathCard
                    key={path.id}
                    id={path.slug}
                    title={path.title}
                    description={path.description || ""}
                    coursesCount={path._count?.nodes || 0}
                    certificateType={path.certificateType || "BASIC"}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/10">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Paths Available</h3>
                <p className="text-muted-foreground">Check back soon for new learning paths.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
