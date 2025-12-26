
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.findFirst({
        where: { email: "yashuttam730@gmail.com" } // The user we just tested with
    })

    if (!user) {
        console.log("User not found")
        return
    }

    // Find a course (any course) to link
    let course = await prisma.course.findFirst()
    if (!course) {
        // Create a dummy course if none exists
        course = await prisma.course.create({
            data: {
                slug: "test-course-" + Date.now(),
                title: "Reac.js Mastery Verify",
                price: 0,
                published: true,
                thumbnailUrl: "https://placehold.co/600x400"
            }
        })
    }

    // Issue certificate
    try {
        const cert = await prisma.certificate.create({
            data: {
                credentialId: "CERT-" + Date.now(),
                userId: user.id,
                courseId: course.id,
                studentName: user.name || "Test User",
                courseName: course.title,
                instructorName: "Elystrix AI",
                tier: "gold",
                imageUrl: "https://placehold.co/800x600/png?text=Certificate",
                pdfUrl: "https://placehold.co/800x600.pdf"
            }
        })
        console.log("Certificate created:", cert)
    } catch (e) {
        console.error("Error creating certificate:", e)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
