import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
    try {
        // Safety check for DATABASE_URL
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({
                categories: []
            })
        }

        const categories = await prisma.courseCategory.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                slug: true
            }
        })

        return NextResponse.json({ categories })
    } catch (error) {
        console.error("Error fetching course categories:", error)
        return NextResponse.json(
            { error: "Failed to fetch categories", categories: [] },
            { status: 500 }
        )
    }
}
