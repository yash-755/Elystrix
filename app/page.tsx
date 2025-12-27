import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/marketing/Hero"
import { HowItWorks } from "@/components/marketing/HowItWorks"
import { Categories } from "@/components/marketing/Categories"
import { FeaturedPaths } from "@/components/marketing/FeaturedPaths"
import { Certificates } from "@/components/marketing/Certificates"
import { Testimonials } from "@/components/marketing/Testimonials"
import { CTA } from "@/components/marketing/CTA"
import { prisma } from "@/lib/prisma"
import { LandingGuard } from "@/components/landing-guard"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function HomePage() {
  // Fetch paths
  const paths = await prisma.learningPath.findMany({
    take: 3,
    orderBy: { createdAt: "desc" }
  })

  // Fetch category counts
  const allCourses = await prisma.course.findMany({
    select: { category: true }
  })

  const categoryCounts: Record<string, number> = {}
  allCourses.forEach((c: any) => {
    if (c.category) {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1
    }
  })

  return (
    <LandingGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <HowItWorks />
          <Categories categoryCounts={categoryCounts} />
          <FeaturedPaths paths={paths} />
          <Certificates />
          {/* Testimonials removed to avoid fake data */}
          <CTA />
        </main>
        <Footer />
      </div>
    </LandingGuard>
  )
}
