import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function debugPublishedQuery() {
    console.log("═══════════════════════════════════════════");
    console.log("DEBUG: Published Courses Query");
    console.log("═══════════════════════════════════════════\n");

    try {
        // Check all courses
        console.log("[1] Fetching ALL courses (no filter)...");
        const allCourses = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                published: true,
                deletedAt: true
            }
        });

        console.log(`Total courses in DB: ${allCourses.length}`);
        allCourses.forEach(c => {
            console.log(`  - ${c.title}`);
            console.log(`    Published: ${c.published}, Deleted: ${c.deletedAt ? 'YES' : 'NO'}`);
        });
        console.log();

        // Check with published filter
        console.log("[2] Fetching with published=true filter...");
        const publishedOnly = await prisma.course.findMany({
            where: { published: true },
            select: {
                id: true,
                title: true,
                published: true,
                deletedAt: true
            }
        });

        console.log(`Courses with published=true: ${publishedOnly.length}`);
        publishedOnly.forEach(c => {
            console.log(`  - ${c.title}`);
            console.log(`    Deleted: ${c.deletedAt ? 'YES' : 'NO'}`);
        });
        console.log();

        // Check with both filters
        console.log("[3] Fetching with published=true AND deletedAt=null...");
        const publishedNotDeleted = await prisma.course.findMany({
            where: {
                published: true,
                deletedAt: null
            },
            select: {
                id: true,
                title: true,
                published: true,
                deletedAt: true
            }
        });

        console.log(`Courses with published=true AND deletedAt=null: ${publishedNotDeleted.length}`);
        publishedNotDeleted.forEach(c => {
            console.log(`  - ${c.title}`);
        });
        console.log();

        // Check Prisma schema for Course model
        console.log("[4] Checking if 'published' field exists...");
        const testCourse = await prisma.course.findFirst();
        if (testCourse) {
            console.log("Sample course fields:", Object.keys(testCourse));
            console.log("Published field type:", typeof (testCourse as any).published);
        }

    } catch (error: any) {
        console.error("Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

debugPublishedQuery();
