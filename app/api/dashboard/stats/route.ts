import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    try {
        // Safe return if no DB
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({
                totalEnrollments: 0,
                completedEnrollments: 0,
                certificatesCount: 0,
                quizAttemptsCount: 0,
                enrolledPathsCount: 0,
                recentEnrollment: null,
            });
        }

        const userId = request.nextUrl.searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        // Find user by Firebase UID
        const user = await prisma.user.findUnique({
            where: { firebaseUid: userId }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Fetch stats
        const [
            totalEnrollments,
            completedEnrollments,
            certificatesCount,
            quizAttemptsCount,
            enrolledPathsCount,
            recentEnrollment,
        ] = await Promise.all([
            prisma.enrollment.count({ where: { userId: user.id } }),
            prisma.enrollment.count({ where: { userId: user.id, status: "completed" } }),
            prisma.certificate.count({ where: { userId: user.id } }),
            prisma.quizAttempt.count({ where: { userId: user.id } }),
            prisma.userLearningPath.count({ where: { userId: user.id } }),
            prisma.enrollment.findFirst({
                where: { userId: user.id },
                orderBy: { lastAccessedAt: "desc" },
                include: { course: true },
            }),
        ])

        return NextResponse.json({
            totalEnrollments,
            completedEnrollments,
            certificatesCount,
            quizAttemptsCount,
            enrolledPathsCount,
            recentEnrollment,
        })
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}
