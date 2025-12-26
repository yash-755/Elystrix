"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type CreateLessonInput = {
    courseId: string
    title: string
    description?: string
    videoUrl?: string
    order?: number
    published?: boolean
}

export async function createLesson(data: CreateLessonInput) {
    try {
        // Get highest order
        const lastLesson = await (prisma as any).lesson.findFirst({
            where: { courseId: data.courseId },
            orderBy: { order: 'desc' },
        })
        const newOrder = (lastLesson?.order ?? 0) + 1

        const lesson = await (prisma as any).lesson.create({
            data: {
                courseId: data.courseId,
                title: data.title,
                description: data.description,
                videoUrl: data.videoUrl,
                order: data.order ?? newOrder,
                published: data.published ?? false,
            },
        })

        revalidatePath(`/admin/courses/${data.courseId}`)
        return { success: true, lesson }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateLesson(lessonId: string, data: Partial<CreateLessonInput>) {
    try {
        const lesson = await (prisma as any).lesson.update({
            where: { id: lessonId },
            data: {
                title: data.title,
                description: data.description,
                videoUrl: data.videoUrl,
                published: data.published,
            },
        })

        revalidatePath(`/admin/courses/${lesson.courseId}`)
        return { success: true, lesson }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteLesson(lessonId: string) {
    try {
        const lesson = await prisma.lesson.delete({
            where: { id: lessonId },
        })
        revalidatePath(`/admin/courses/${lesson.courseId}`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function reorderLessons(courseId: string, orderedIds: string[]) {
    try {
        const transaction = orderedIds.map((id, index) =>
            prisma.lesson.update({
                where: { id },
                data: { order: index + 1 },
            })
        )
        await prisma.$transaction(transaction)
        revalidatePath(`/admin/courses/${courseId}`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
