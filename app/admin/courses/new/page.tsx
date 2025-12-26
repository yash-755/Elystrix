
import { PrismaClient } from "@prisma/client"
import { NewCourseClient } from "./client"

const prisma = new PrismaClient()

export default async function NewCoursePage() {
  const categories = await prisma.courseCategory.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true }
  });

  return (
    <NewCourseClient categories={categories} />
  )
}

