"use server"

import { prisma } from "@/lib/prisma"
import { getUserByFirebaseId } from "@/lib/users"

export async function getUserQuizAttempts(firebaseUid: string) {
    const user = await getUserByFirebaseId(firebaseUid)
    if (!user) return []

    try {
        const attempts = await prisma.quizAttempt.findMany({
            where: { userId: user.id },
            include: {
                quiz: {
                    select: {
                        title: true,
                        courseId: true // Assuming quiz links to course
                    }
                }
            },
            orderBy: { completedAt: 'desc' },
        })

        // We might want to resolve Course Name if it's not directly on Quiz.
        // Quiz model has `courseId`. We can fetch course title if needed or assume quiz.title is enough.
        // Schema: Quiz has `courseId` and `title`. 
        // Let's try to include course title if possible, or just use quiz title.
        // Prisma include limitation: if Quiz doesn't relate to Course in schema, we can't include.
        // Looking at schema: `Quiz` has `courseId` (String). It does NOT have a relation to `Course` defined in schema provided earlier.
        // Earlier schema:
        // model Quiz { id, courseId (String), title ... } (No @relation to Course)
        // So we can't include course. 
        // We will just use quiz title.

        return attempts.map(attempt => ({
            id: attempt.id,
            courseName: attempt.quiz.title, // Using quiz title as course name proxy or title
            attemptDate: attempt.completedAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
            score: attempt.score,
            passingScore: 70, // Hardcoded or fetch from Quiz if added
            status: attempt.passed ? "passed" : "failed",
            canRetake: !attempt.passed // Simple logic
        }))
    } catch (error) {
        console.error("Error fetching quiz attempts:", error)
        return []
    }
}

export async function getQuizById(id: string) {
    try {
        const quiz = await prisma.quiz.findUnique({ where: { id } })
        if (!quiz) return null

        // Fetch course title manually since no relation
        let courseTitle = "Course Quiz"
        if (quiz.courseId) {
            const course = await (prisma as any).Course.findUnique({ where: { id: quiz.courseId } })
            if (course) courseTitle = course.title
        }

        return {
            id: quiz.id,
            title: quiz.title,
            courseTitle,
            questions: Array.isArray(quiz.questions) ? quiz.questions : [],
            totalQuestions: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
            timeLimit: 15, // Default
            passingScore: 70, // Default
        }
    } catch (error) {
        console.error("Error fetching quiz:", error)
        return null
    }
}
