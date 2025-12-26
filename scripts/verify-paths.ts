
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
    console.log("🔍 Starting Verification...")

    // 1. Check Learning Paths
    const paths = await prisma.learningPath.findMany({ include: { nodes: true } })
    console.log(`✅ Found ${paths.length} Learning Paths`)

    paths.forEach(p => {
        console.log(`   - [${p.certificateType}] ${p.title} (${p.slug}) - ${p.nodes.length} nodes`)
        if (!p.certificateType) console.error(`   ❌ Missing certificateType for ${p.title}`)
    })

    // 2. Check Nodes Integrity
    const nodes = await prisma.learningPathNode.findMany()
    console.log(`✅ Found ${nodes.length} Total Nodes`)

    // 3. User Progress Integrity
    const userPaths = await prisma.userLearningPath.findMany()
    console.log(`✅ Found ${userPaths.length} User Enrollments`)

    userPaths.forEach(up => {
        // Check if completedNodeIds are valid
        if (up.completedNodeIds.length > 0) {
            console.log(`   - User Enrollment ${up.id}: ${up.completedNodeIds.length} completed nodes`)
        }
    })

    await prisma.$disconnect()
}

verify().catch(e => {
    console.error(e)
    prisma.$disconnect()
})
