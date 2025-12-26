"use server"

import { prisma } from "@/lib/prisma"
import { getUserByFirebaseId } from "@/lib/users"

export async function getUserCourses(firebaseUid: string, filter: string = "all") {
    const user = await getUserByFirebaseId(firebaseUid)
    if (!user) return []

    // Build the query
    const whereClause: any = {
        userId: user.id
    }

    if (filter === "in-progress") {
        whereClause.status = "in-progress"
    } else if (filter === "completed") {
        whereClause.status = "completed"
    }

    try {
        const enrollments = await prisma.enrollment.findMany({
            where: whereClause,
            include: {
                course: true
            },
            orderBy: { lastAccessedAt: 'desc' }
        })

        // Map to UI friendly format
        return enrollments.map(enrollment => ({
            id: enrollment.course.id,
            title: enrollment.course.title,
            description: enrollment.course.description,
            thumbnail: enrollment.course.thumbnail,
            duration: enrollment.course.duration,
            level: (enrollment.course as any).difficulty,
            rating: enrollment.course.rating,
            category: enrollment.course.category,
            progress: enrollment.progress,
            status: enrollment.status,
            modules: 0 // Placeholder or fetch if relational
        }))

    } catch (error) {
        console.error("Error fetching user courses:", error)
        return []
    }
}

export async function getPublicCourse(idOrSlug: string) {
    // Try finding by ID first
    let isId = false
    try {
        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) isId = true
    } catch (e) { }

    let course = null

    if (isId) {
        course = await (prisma as any).Course.findUnique({
            where: { id: idOrSlug },
            include: {
                lessons: { orderBy: { order: "asc" } },
                category: true
            }
        })
    }

    // If not found by ID or not a valid ID format, try slug
    if (!course) {
        course = await (prisma as any).Course.findUnique({
            where: { slug: idOrSlug },
            include: {
                lessons: { orderBy: { order: "asc" } },
                category: true
            }
        })
    }

    return course
}

export async function getCourseViewerData(courseId: string, firebaseUid: string) {
    const user = await getUserByFirebaseId(firebaseUid)
    if (!user) throw new Error("User not found")

    // Fetch course and ALL lessons
    // Assuming schema usage: key is 'lessons' NOT 'chapters'
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            lessons: {
                where: { published: true },
                orderBy: { order: "asc" }
            }
        }
    })

    if (!course) return null

    // Fetch progress
    const progressDocs = await prisma.userProgress.findMany({
        where: { userId: user.id, courseId: course.id }
    })

    // Map progress by lessonId
    const progressMap: Record<string, { completed: boolean, percent: number }> = {}
    progressDocs.forEach((p: any) => {
        progressMap[p.lessonId] = { completed: p.completed, percent: p.watchedPercentage }
    })

    // Fetch enrollment for overall progress
    const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } }
    })

    // Map to CourseData structure
    // Since we don't have modules in DB, create one default module
    const mappedLessons = course.lessons.map((l: any) => ({
        id: l.id,
        title: l.title,
        description: l.description || null, // Include description from DB
        duration: "10:00", // DB doesn't have duration per lesson? Check schema. Lesson model has no duration.
        completed: progressMap[l.id]?.completed || false,
        watchedPercentage: progressMap[l.id]?.percent || 0,
        type: "video", // Default to video
        videoId: extractYouTubeId(l.videoUrl || ""),
    }))

    // Determine current lesson
    // 1. First uncompleted?
    // 2. Or just first?
    // Default to first
    let currentLesson = mappedLessons.find((l: any) => !l.completed) || mappedLessons[0]

    // If no lessons, provide a dummy?
    if (!mappedLessons.length) {
        // Handle empty course
        return null // or generic empty
    }

    const modules = [{
        id: "default-module",
        title: "Course Content",
        duration: course.duration || "0m",
        lessons: mappedLessons,
        expanded: true,
        completed: mappedLessons.every((l: any) => l.completed)
    }]

    const totalDuration = course.duration || "0h"

    return {
        id: course.id,
        title: course.title,
        instructor: "Elystrix Instructor", // Schema doesn't have instructor?
        progress: enrollment?.progress || 0,
        totalLessons: course.lessons.length,
        completedLessons: progressDocs.filter((p: any) => p.completed).length,
        totalDuration,
        currentLesson: {
            id: currentLesson.id,
            title: currentLesson.title,
            duration: currentLesson.duration,
            videoId: currentLesson.videoId,
            watchedPercentage: currentLesson.watchedPercentage,
            description: currentLesson.description
        },
        modules,
        resources: [], // TODO: Add resources if DB has them
        notes: [] // TODO: Add notes
    }
}

function extractYouTubeId(url: string) {
    if (!url) return ""
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url; // Fallback to returning original if no match (maybe it is already an ID)
}
