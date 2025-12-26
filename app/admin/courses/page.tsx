import { prisma } from "@/lib/prisma"
import { CoursesTable } from "@/components/admin/courses-table"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function AdminCoursesPage() {
  const courses = await (prisma as any).Course.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      category: true,
      difficulty: true,
      published: true,
      price: true,
      updatedAt: true,
    }
  })

  // Serialize dates for Client Component
  const serializedCourses = courses.map((course: any) => ({
    ...course,
    updatedAt: course.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      {/* Stats Cards - Kept on Server Side if just display, or move to Client? */}
      {/* Moving stats to page.tsx to keep them server rendered is fine, but layout might look split. */}
      {/* To match original design, we render stats here then the table. */}

      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Courses</p>
            <p className="text-2xl font-bold">{courses.length}</p>
          </CardContent>
        </Card>
      </div>

      <CoursesTable initialCourses={serializedCourses} />
    </div>
  )
}
