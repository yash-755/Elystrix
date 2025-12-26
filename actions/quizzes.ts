"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type CreateQuizInput = {
    courseId: string
    lessonId?: string | null
    title: string
    questions: any[]
    type: "LESSON_QUIZ" | "FINAL_QUIZ"
}

export async function upsertQuiz(data: CreateQuizInput) {
    console.log("[Quiz Save] Starting quiz upsert:", {
        type: data.type,
        courseId: data.courseId,
        lessonId: data.lessonId,
        questionCount: data.questions.length
    })

    try {
        // If lesson quiz, ensure only one exists per lesson
        let existingQuiz = null;

        if (data.type === "LESSON_QUIZ" && data.lessonId) {
            existingQuiz = await (prisma as any).quiz.findFirst({
                where: { lessonId: data.lessonId }
            })
        } else if (data.type === "FINAL_QUIZ") {
            existingQuiz = await (prisma as any).quiz.findFirst({
                where: {
                    courseId: data.courseId,
                    type: "FINAL_QUIZ"
                }
            })
        }

        if (existingQuiz) {
            console.log("[Quiz Save] Updating existing quiz:", existingQuiz.id)
            const updated = await (prisma as any).quiz.update({
                where: { id: existingQuiz.id },
                data: {
                    title: data.title,
                    questions: data.questions,
                }
            })
            console.log("[Quiz Save] Quiz updated successfully:", updated.id)
            revalidatePath(`/admin/courses/${data.courseId}`)
            return { success: true, quiz: updated }
        } else {
            // Enforce validations
            if (data.type === "LESSON_QUIZ" && (data.questions.length > 10)) {
                console.error("[Quiz Save] Validation failed: Too many questions for lesson quiz")
                return { success: false, error: "Lesson quizzes cannot have more than 10 questions." }
            }
            if (data.type === "FINAL_QUIZ" && (data.questions.length > 30)) {
                console.error("[Quiz Save] Validation failed: Too many questions for final quiz")
                return { success: false, error: "Final quizzes cannot have more than 30 questions." }
            }

            console.log("[Quiz Save] Creating new quiz")
            const created = await (prisma as any).quiz.create({
                data: {
                    courseId: data.courseId,
                    lessonId: data.lessonId || null,
                    title: data.title,
                    type: data.type,
                    questions: data.questions
                }
            })
            console.log("[Quiz Save] Quiz created successfully:", created.id)
            revalidatePath(`/admin/courses/${data.courseId}`)
            return { success: true, quiz: created }
        }
    } catch (error: any) {
        console.error("[Quiz Save] Error saving quiz:", error.message, error)
        return { success: false, error: error.message }
    }
}

export async function deleteQuiz(quizId: string) {
    console.log("[Quiz Delete] Starting quiz deletion:", quizId)
    try {
        await (prisma as any).quiz.delete({ where: { id: quizId } })
        console.log("[Quiz Delete] Quiz deleted successfully:", quizId)
        return { success: true }
    } catch (error: any) {
        console.error("[Quiz Delete] Error deleting quiz:", error.message, error)
        return { success: false, error: error.message }
    }
}
