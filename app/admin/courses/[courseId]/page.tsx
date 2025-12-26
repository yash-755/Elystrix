import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { EditCourseClient } from "@/components/admin/course-form/edit-course-client"

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface EditCoursePageProps {
    params: Promise<{
        courseId: string
    }>
}

export default async function EditCoursePage(props: EditCoursePageProps) {
    const params = await props.params;

    if (!params || !params.courseId) {
        console.error("[EditCoursePage] No Course ID param provided (After await). Keys:", Object.keys(params || {}));
        return <div className="p-8 text-center text-red-500">Error: Invalid Course ID. URL params missing.</div>;
    }

    const { courseId } = params;

    try {
        console.log(`[EditCoursePage] Fetching course: ${courseId}`);
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                lessons: {
                    orderBy: { order: 'asc' },
                    include: {
                        quiz: true
                    }
                },
                quizzes: {
                    where: { type: "FINAL_QUIZ" }
                }
            }
        })

        if (!course) {
            console.error(`[EditCoursePage] Course with ID ${params.courseId} not found in DB`);
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
                    <h2 className="text-xl font-bold">Course Not Found</h2>
                    <p className="text-muted-foreground">The course you are looking for does not exist or has been deleted.</p>
                    <p className="text-xs text-muted-foreground font-mono">ID: {params.courseId}</p>
                </div>
            )
        }

        const categories = await prisma.courseCategory.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true, slug: true }
        });

        // Serialize dates and structure
        const serializedCourse = {
            ...course,
            updatedAt: course.updatedAt.toISOString(),
            createdAt: course.createdAt.toISOString(),
            lessons: course.lessons.map((l: any) => ({
                ...l,
                updatedAt: l.updatedAt.toISOString(),
                createdAt: l.createdAt.toISOString(),
                quiz: l.quiz ? { ...l.quiz, updatedAt: l.quiz.updatedAt.toISOString(), createdAt: l.quiz.createdAt.toISOString() } : null
            })),
            finalQuiz: course.quizzes[0] ? {
                ...course.quizzes[0],
                updatedAt: course.quizzes[0].updatedAt.toISOString(),
                createdAt: course.quizzes[0].createdAt.toISOString()
            } : null
        }

        return (
            <EditCourseClient course={serializedCourse} categories={categories} initialTab="details" />
        )
    } catch (error) {
        console.error("Error loading course:", error);
        return <div className="p-8 text-center text-red-500">Error loading course. Please check logs.</div>
    }
}

