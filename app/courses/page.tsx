import CoursesPageClient from "@/components/courses-page-client"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function CoursesPage() {
  const courses = await (prisma as any).Course.findMany({
    where: {
      published: true
    },
    include: {
      category: true
    },
    orderBy: { createdAt: 'desc' }
  })

  const categories = await (prisma as any).CourseCategory.findMany({
    orderBy: { name: 'asc' }
  })

  return <CoursesPageClient initialCourses={courses} categories={categories} />
}
