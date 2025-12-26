import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const { pathId } = await req.json()

        if (!pathId) {
            return NextResponse.json({ success: false, error: "Path ID required" }, { status: 400 })
        }

        // Check if already enrolled
        const existing = await prisma.userLearningPath.findUnique({
            where: {
                userId_learningPathId: {
                    userId: user.id,
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
                userId: user.id,
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
