import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserSubscription } from "@/app/actions/subscription"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    try {
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

        // Fetch subscription and stats
        const [subscription, coursesAccessed, certificatesEarned, quizAttempts] = await Promise.all([
            getUserSubscription(user.id),
            prisma.enrollment.count({ where: { userId: user.id } }),
            prisma.certificate.count({ where: { userId: user.id } }),
            prisma.quizAttempt.count({ where: { userId: user.id } }),
        ])

        return NextResponse.json({
            subscription,
            coursesAccessed,
            certificatesEarned,
            quizAttempts,
        })
    } catch (error) {
        console.error('Error fetching subscription data:', error)
        return NextResponse.json({ error: 'Failed to fetch subscription data' }, { status: 500 })
    }
}
