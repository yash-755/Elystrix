export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { NewCourseClient } from "./client"

export default async function NewCoursePage() {
  const categories = await prisma.courseCategory.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  })

  return <NewCourseClient categories={categories} />
}
