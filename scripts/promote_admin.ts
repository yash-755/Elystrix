
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin_qa_test@example.com'
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'admin' },
        })
        console.log(`Successfully updated role for user: ${user.email} to ${user.role}`)
    } catch (e) {
        console.error(`Error updating user role: ${e}`)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
