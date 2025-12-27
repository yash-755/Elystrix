import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({ success: false, error: "Database unavailable" }, { status: 503 })
        }

        // Note: This endpoint requires authentication to be handled client-side
        // The userId should be passed in the request body
        const { pathId, userId } = await req.json()

        if (!userId || !pathId) {
            return NextResponse.json({ success: false, error: "User ID and Path ID required" }, { status: 400 })
        }

        // Check if already enrolled
        const existing = await prisma.userLearningPath.findUnique({
            where: {
                userId_learningPathId: {
                    userId: userId,
                    learningPathId: pathId,
                },
            },
        })

        if (existing) {
            return NextResponse.json({ success: true, message: "Already enrolled" })
        }

        // Create enrollment
        await prisma.userLearningPath.create({
            data: {
                userId: userId,
                learningPathId: pathId,
                progress: 0,
                status: "in-progress",
                completedNodeIds: [],
            },
        })

        revalidatePath("/dashboard/paths")
        revalidatePath(`/dashboard/paths/${pathId}`)
        revalidatePath("/paths")

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Enrollment error:", error)
        return NextResponse.json({ success: false, error: error.message || "Internal error" }, { status: 500 })
    }
}
