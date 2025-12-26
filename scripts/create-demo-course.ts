
import { PrismaClient } from "@prisma/client";
import { createCourse } from "../actions/courses";

const prisma = new PrismaClient();

async function run() {
    try {
        console.log("Creating Antigravity Demo Course...");

        // Find category
        let category = await prisma.courseCategory.findFirst({
            where: { name: "Backend Development" }
        });

        if (!category) {
            console.log("Category not found, creating it...");
            category = await prisma.courseCategory.create({
                data: {
                    name: "Backend Development",
                    slug: "backend-development"
                }
            });
        }

        const result = await createCourse({
            title: "Antigravity Demo Course",
            categoryId: category.id,
            difficulty: "Beginner",
            certificateType: "BASIC",
            published: false,
            instructorName: "Antigravity AI",
            instructorChannelName: "AI Channel",
            thumbnail: "https://example.com/ag-demo.jpg",
            tags: ["demo", "check"]
        });

        if (result.success && result.courseId) {
            console.log("SUCCESS: Course Created.");
            console.log("Course ID:", result.courseId);
            console.log("Redirect URL:", `/admin/courses/${result.courseId}`);

            // Verify DB persistence
            const saved = await prisma.course.findUnique({ where: { id: result.courseId } });
            if (saved) {
                console.log("VERIFIED: Course exists in DB.");
            } else {
                console.error("FAILED: Course not found in DB immediately.");
            }

        } else {
            console.error("FAILED to create course:", result.error);
        }

    } catch (e) {
        console.error("Script Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
