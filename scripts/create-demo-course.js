const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDemoCourse() {
    try {
        console.log("Creating Demo Course...");
        const title = "Firebase Demo Course";
        const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

        // Find a category or create one
        let category = await prisma.courseCategory.findFirst();
        if (!category) {
            category = await prisma.courseCategory.create({
                data: {
                    name: "Backend Development",
                    slug: "backend-dev"
                }
            });
        }

        const course = await prisma.course.create({
            data: {
                title,
                slug,
                description: "A demo course to verify admin flow.",
                thumbnail: "https://placehold.co/600x400",
                thumbnailUrl: "https://placehold.co/600x400",
                price: 0,
                categoryId: category.id,
                difficulty: "Beginner",
                certificateType: "BASIC",
                published: false,
                instructorName: "Admin User",
                instructorChannelName: "Admin Channel",
                tags: ["firebase", "demo"]
            }
        });

        console.log("SUCCESS: Course Created.");
        console.log("ID:", course.id);
        console.log("Slug:", course.slug);
        console.log("Redirect Target:", `/admin/courses/${course.id}?tab=lessons`);

    } catch (error) {
        console.error("ERROR Creating Course:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createDemoCourse();
