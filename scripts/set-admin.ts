
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@elystrix.com'

    // Update ANY user with this email to be admin
    const { count } = await prisma.user.updateMany({
        where: { email },
        data: { role: 'admin' }
    })

    console.log(`Updated ${count} users with email ${email} to role: admin`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
