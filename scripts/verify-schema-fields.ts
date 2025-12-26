
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Verifying Prisma Client Schema Fields...")

    try {
        // 1. Verify User.profileImageUrl
        // We don't need real data, just need to see if the query compiles/runs without "Unknown field" error.
        // We use findFirst.
        await prisma.user.findFirst({
            select: {
                id: true,
                profileImageUrl: true, // This line will throw if field doesn't exist in Client
            }
        })
        console.log("✅ User.profileImageUrl exists.")

        // 2. Verify Course.thumbnailUrl
        await prisma.course.findFirst({
            select: {
                id: true,
                thumbnailUrl: true // This will throw if field doesn't exist
            }
        })
        console.log("✅ Course.thumbnailUrl exists.")

        console.log("All schema verifications passed!")

    } catch (error) {
        console.error("❌ Verification Failed:", error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
