"use server"

import { prisma } from "@/lib/prisma"
import { getUserByFirebaseId } from "@/lib/users"

const COMPLETION_THRESHOLD = 70

export async function saveVideoProgress(
    firebaseUid: string,
    courseId: string,
    lessonId: string,
    percentage: number
) {
    if (!firebaseUid || !courseId || !lessonId) {
        throw new Error("Missing required fields")
    }

    const user = await getUserByFirebaseId(firebaseUid)
    if (!user) {
        throw new Error("User not found")
    }

    // 1. Upsert Lesson Progress
    // We use upsert to create or update
    // Note: We only set completed=true, never revert to false
    const isCompletedNow = percentage >= COMPLETION_THRESHOLD

    // Get existing progress to check if already completed
    const existingProgress = await prisma.userProgress.findUnique({
        where: {
            userId_lessonId: {
                userId: user.id,
                lessonId: lessonId
            }
        }
    })

    const wasCompleted = existingProgress?.completed || false
    const shouldMarkCompleted = wasCompleted || isCompletedNow

    const completedAt = shouldMarkCompleted && !wasCompleted ? new Date() : existingProgress?.completedAt

    await prisma.userProgress.upsert({
        where: {
            userId_lessonId: {
                userId: user.id,
                lessonId: lessonId
            }
        },
        update: {
            watchedPercentage: percentage > (existingProgress?.watchedPercentage || 0) ? percentage : undefined, // Only increase percentage? Or allow seek back? User said "Only counting real watch time deltas" - handled in client. Here we just save what client sends. But "Update watchedPercentage incrementally" implies we shouldn't decrease it? Usually max is better.
            // Re-reading: "Update watchedPercentage incrementally" -> Likely means strictly increasing.
            // I will take the MAX of existing and new percentage.
            completed: shouldMarkCompleted,
            completedAt: completedAt,
        },
        create: {
            userId: user.id,
            courseId,
            lessonId,
            watchedPercentage: percentage,
            completed: shouldMarkCompleted,
            completedAt: shouldMarkCompleted ? new Date() : null,
        }
    })

    // 2. Update Course Progress (Enrollment)
    // Re-calculate course progress regardless to ensure consistency
    // Count total published lessons
    const totalLessons = await prisma.lesson.count({
        where: {
            courseId: courseId,
            published: true
        }
    })

    // Count completed lessons by this user for this course
    const completedLessonsCount = await prisma.userProgress.count({
        where: {
            userId: user.id,
            courseId: courseId,
            completed: true,
            lesson: {
                published: true
            }
        }
    })

    const courseProgressPercent = totalLessons > 0
        ? Math.round((completedLessonsCount / totalLessons) * 100)
        : 0

    // Update Enrollment
    await prisma.enrollment.upsert({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: courseId
            }
        },
        update: {
            progress: courseProgressPercent,
            // I'll update lastAccessedAt.
            lastAccessedAt: new Date(),
            status: courseProgressPercent === 100 ? "completed" : "in-progress"
            // TODO: If becoming 100%, set completedAt
        },
        create: {
            userId: user.id,
            courseId: courseId,
            progress: courseProgressPercent,
            status: courseProgressPercent === 100 ? "completed" : "in-progress",
            startedAt: new Date(),
            lastAccessedAt: new Date()
        }
    })

    // Handle course completion date if 100%
    if (courseProgressPercent === 100) {
        await prisma.enrollment.update({
            where: { userId_courseId: { userId: user.id, courseId: courseId } },
            data: { completedAt: new Date() }
        })
    }

    return {
        success: true,
        lessonCompleted: shouldMarkCompleted,
        courseProgress: courseProgressPercent
    }
}

export async function getLessonProgress(firebaseUid: string, lessonId: string) {
    const user = await getUserByFirebaseId(firebaseUid)
    if (!user) return null

    const progress = await prisma.userProgress.findUnique({
        where: {
            userId_lessonId: {
                userId: user.id,
                lessonId: lessonId
            }
        }
    })
    return progress
}
