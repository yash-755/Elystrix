"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"


export type CreateCourseInput = {
    title: string
    description?: string
    thumbnail?: string
    // price removed
    categoryId?: string // Changed from category string to ID
    difficulty?: string
    certificateType?: string
    published?: boolean
    instructorName?: string
    instructorChannelName?: string
    tags?: string[]
}

export async function createCourse(data: CreateCourseInput) {
    try {
        if (!data.title) throw new Error("Title is required");

        console.log("[CreateCourse] Starting creation for:", data.title);

        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4)

        const course = await prisma.course.create({
            data: {
                title: data.title,
                slug,
                description: data.description,
                thumbnail: data.thumbnail,
                thumbnailUrl: data.thumbnail,
                price: 0,
                // If categoryId is empty string, make it undefined to avoid Prisma error
                // OR ensure your schema handles optional relation correctly.
                // Assuming schema requires it if passed, or if Relation is optional?
                // Schema says: categoryId String? @db.ObjectId. So it can be null/undefined.
                category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
                difficulty: data.difficulty,
                certificateType: data.certificateType || "BASIC",
                published: data.published || false,
                instructorName: data.instructorName,
                instructorChannelName: data.instructorChannelName,
                tags: data.tags || []
            },
        })

        if (!course || !course.id) {
            console.error("[CreateCourse] Failed to retrieve ID after creation");
            throw new Error("Database failed to return a valid course ID.");
        }

        console.log("[CreateCourse] Success. New Course ID:", course.id);

        try {
            revalidatePath("/admin/courses")
            revalidatePath("/dashboard")
            revalidatePath("/dashboard/courses")
            revalidatePath("/courses")
        } catch (e) {
            console.warn("Revalidation failed (likely due to script execution):", e)
        }

        return { success: true, courseId: course.id }
    } catch (error: any) {
        console.error("[CreateCourse] Error:", error)
        return { success: false, error: error.message || "Failed to create course" }
    }
}

export async function updateCourse(id: string, data: Partial<CreateCourseInput>) {
    try {
        const course = await (prisma as any).course.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                thumbnail: data.thumbnail,
                thumbnailUrl: data.thumbnail,
                // price ignored
                categoryId: data.categoryId,
                difficulty: data.difficulty,
                certificateType: data.certificateType,
                published: data.published,
                instructorName: data.instructorName,
                instructorChannelName: data.instructorChannelName,
                tags: data.tags
            },
        })

        revalidatePath("/admin/courses")
        revalidatePath(`/admin/courses/${id}`)
        revalidatePath("/dashboard")
        revalidatePath("/dashboard/courses")
        revalidatePath("/courses")
        revalidatePath(`/courses/${course.slug}`)

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteCourse(courseId: string) {
    try {
        // Use a transaction to ensure atomic update
        // We are doing a SOFT delete as per schema structure
        await prisma.course.update({
            where: { id: courseId },
            data: {
                deletedAt: new Date(),
                published: false
            }
        })

        try {
            revalidatePath("/admin/courses")
            revalidatePath("/dashboard")
            revalidatePath("/courses")
        } catch (e) {
            console.warn("Revalidation failed:", e)
        }

        return { success: true }
    } catch (error: any) {
        console.error("Delete Course Error:", error);
        return { success: false, error: error.message }
    }
}

export async function togglePublishCourse(courseId: string, isPublished: boolean) {
    try {
        const course = await (prisma as any).course.update({
            where: { id: courseId },
            data: { published: isPublished }
        })

        try {
            revalidatePath("/admin/courses")
            revalidatePath(`/admin/courses/${courseId}`)
            revalidatePath("/dashboard")
            revalidatePath("/courses")
            revalidatePath(`/courses/${course.slug}`)
        } catch (e) {
            console.warn("Revalidation failed:", e)
        }

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
