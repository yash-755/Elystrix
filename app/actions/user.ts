"use server"

import { prisma } from "@/lib/prisma"

export async function getUserDashboardData(firebaseUid: string) {
    if (!firebaseUid) return null

    try {
        const user = await prisma.user.findUnique({
            where: { firebaseUid },
            include: {
                certificates: true,
                quizAttempts: true,
                enrollments: {
                    include: {
                        course: true
                    }
                }
            }
        })

        if (!user) return null

        // 1. Calculate Stats
        const enrolledCount = user.enrollments.length
        const certificatesCount = user.certificates.length
        const quizAttemptsCount = user.quizAttempts.length

        // Calculate total hours (approximate from course string duration if needed, or just count courses for now)
        // For accurate hours, we'd need to parse "8h 30m" string or store duration in minutes. 
        // For now, let's just count completed courses * fixed estimate or just sum enrollments?
        // Let's rely on stored progress if we had it. Use 0 or logic:
        const totalHours = 0

        // 2. Continue Learning
        // Filter enrollments that are in-progress
        const inProgressEnrollments = user.enrollments.filter(e => e.status !== "completed")
        const continueLearning = inProgressEnrollments.map(enrollment => ({
            id: enrollment.course.id,
            title: enrollment.course.title,
            thumbnail: enrollment.course.thumbnail,
            progress: enrollment.progress,
            currentLesson: "Continue where you left off", // Placeholder until we track exact lesson
            nextLessonDuration: "~15m" // Placeholder
        }))

        // 3. Recommended Courses
        // Fetch published courses NOT enrolled by user
        const enrolledCourseIds = user.enrollments.map(e => e.courseId)

        const recommendedCourses = await prisma.course.findMany({
            where: {
                published: true,
                id: { notIn: enrolledCourseIds }
            },
            take: 3,
            orderBy: { rating: 'desc' }
        })

        return {
            stats: {
                enrolled: enrolledCount,
                certificates: certificatesCount,
                quizzes: quizAttemptsCount,
                hours: totalHours
            },
            continueLearning: continueLearning,
            recommendedCourses: recommendedCourses
        }
    } catch (error) {
        console.error("Error fetching user dashboard data:", error)
        return null
    }
}

// --- User Role Helper ---
export async function getUserRole(firebaseUid: string) {
    if (!firebaseUid) return null
    try {
        const user = await prisma.user.findUnique({
            where: { firebaseUid },
            select: { role: true }
        })
        return user?.role || "student"
    } catch (e) {
        return "student"
    }
}
// --- User Profile Helper ---
export async function getUserProfile(firebaseUid: string) {
    if (!firebaseUid) return null
    try {
        const user = await prisma.user.findUnique({
            where: { firebaseUid },
            select: {
                id: true,
                email: true,
                name: true,
                profileImageUrl: true,
                role: true,
                plan: true,
                // Extended Profile
                headline: true,
                bio: true,
                country: true,
                state: true,
                city: true,
                phone: true,
                language: true,
                linkedinProfile: true,
                twitterProfile: true,
                githubProfile: true,
                website: true,
                qualification: true,
                degree: true,
                college: true,
                graduationYear: true,
                careerStatus: true,
                targetRole: true,
                skills: true
            }
        })
        return user
    } catch (e) {
        console.error("Error fetching user profile:", e)
        return null
    }
}

// --- Update Profile Action ---
export async function updateUserProfile(firebaseUid: string, data: any) {
    if (!firebaseUid) return { success: false, error: "Unauthorized" }

    // Basic validation
    if (data.bio && data.bio.length > 500) {
        return { success: false, error: "Bio is too long (max 500 chars)" }
    }
    if (data.headline && data.headline.length > 100) {
        return { success: false, error: "Headline is too long (max 100 chars)" }
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { firebaseUid },
            data: {
                name: data.name,
                headline: data.headline,
                bio: data.bio,
                country: data.country,
                state: data.state,
                city: data.city,
                phone: data.phone,
                language: data.language,
                linkedinProfile: data.linkedinProfile,
                twitterProfile: data.twitterProfile,
                githubProfile: data.githubProfile,
                website: data.website,
                qualification: data.qualification,
                degree: data.degree,
                college: data.college,
                graduationYear: data.graduationYear,
                careerStatus: data.careerStatus,
                targetRole: data.targetRole,
                skills: data.skills // Array of strings
            }
        })

        return { success: true, user: updatedUser }
    } catch (e) {
        console.error("Error updating user profile:", e)
        return { success: false, error: "Failed to update profile" }
    }
}
