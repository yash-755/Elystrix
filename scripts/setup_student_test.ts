import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function setupStudentTestData() {
    console.log("════════════════════════════════════════════════════════");
    console.log("STUDENT PANEL TEST DATA SETUP");
    console.log("════════════════════════════════════════════════════════\n");

    try {
        // Create a published course for student testing
        console.log("[SETUP] Creating published test course...");

        const category = await prisma.courseCategory.findFirst() ||
            await prisma.courseCategory.create({
                data: { name: "Web Development", slug: "web-dev" }
            });

        const course = await prisma.course.create({
            data: {
                title: "Student Test Course - Full Stack Development",
                slug: "student-test-fullstack-" + Date.now(),
                description: "A comprehensive course for testing student panel functionality",
                thumbnailUrl: "https://placehold.co/600x400/4F46E5/white?text=Full+Stack",
                categoryId: category.id,
                difficulty: "Intermediate",
                certificateType: "CAREER",
                published: true, // IMPORTANT: Published
                instructorName: "John Doe",
                instructorChannelName: "Coding with John",
                tags: ["javascript", "react", "nodejs"],
                price: 0
            }
        });

        console.log("✓ Published course created");
        console.log(`   ID: ${course.id}`);
        console.log(`   Title: ${course.title}`);
        console.log(`   Published: ${course.published}`);
        console.log(`   Deleted: ${course.deletedAt ? 'YES' : 'NO'}\n`);

        // Add a lesson to make it look complete
        const lesson = await prisma.lesson.create({
            data: {
                courseId: course.id,
                title: "Introduction to Full Stack Development",
                description: "Learn the basics of full stack development",
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                order: 1,
                published: true
            }
        });

        console.log("✓ Lesson added to course");
        console.log(`   Lesson ID: ${lesson.id}\n`);

        // Verify the course appears in published query
        console.log("[VERIFY] Checking if course appears in published query...");
        const publishedCourses = await prisma.course.findMany({
            where: {
                published: true,
                deletedAt: null
            },
            include: {
                category: true
            }
        });

        console.log(`✓ Found ${publishedCourses.length} published course(s)`);
        const ourCourse = publishedCourses.find(c => c.id === course.id);

        if (!ourCourse) {
            console.error("❌ CRITICAL: Course not appearing in published query!");
            process.exit(1);
        }

        console.log(`✓ Test course appears in published query\n`);

        console.log("════════════════════════════════════════════════════════");
        console.log("✓ STUDENT TEST DATA READY");
        console.log("════════════════════════════════════════════════════════");
        console.log();
        console.log("Published Course Details:");
        console.log(`  ID: ${course.id}`);
        console.log(`  Title: ${course.title}`);
        console.log(`  Category: ${category.name}`);
        console.log(`  URL: http://localhost:3000/courses/${course.slug}`);
        console.log();
        console.log("Student Panel Routes to Test:");
        console.log(`  Browse Courses: http://localhost:3000/courses`);
        console.log(`  My Courses: http://localhost:3000/dashboard/courses`);
        console.log();
        console.log("⚠️  NOTE: This course will persist in the database.");
        console.log("   To cleanup, run: npx tsx scripts/cleanup_test_courses.ts");
        console.log("════════════════════════════════════════════════════════\n");

        return { courseId: course.id, courseSlug: course.slug };

    } catch (error: any) {
        console.error("\n❌ SETUP FAILED");
        console.error("Error:", error.message);
        console.error("Stack:", error.stack);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

setupStudentTestData();
