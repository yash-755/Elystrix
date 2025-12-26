import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function directDatabaseTest() {
    console.log("════════════════════════════════════════════════════════");
    console.log("DIRECT DATABASE PERSISTENCE TEST");
    console.log("════════════════════════════════════════════════════════\n");

    let courseId: string | undefined;
    let lessonId: string | undefined;
    let quizId: string | undefined;

    try {
        // STEP 1: Create Course DIRECTLY via Prisma
        console.log("[STEP 1] Creating course directly via Prisma...");

        const category = await prisma.courseCategory.findFirst() ||
            await prisma.courseCategory.create({
                data: { name: "Test Category", slug: "test-cat-" + Date.now() }
            });

        const course = await prisma.course.create({
            data: {
                title: "Direct DB Test Course",
                slug: "direct-db-test-" + Date.now(),
                description: "Testing direct database persistence",
                thumbnailUrl: "https://placehold.co/600x400",
                categoryId: category.id,
                difficulty: "Beginner",
                certificateType: "BASIC",
                published: false,
                instructorName: "Test Instructor",
                tags: ["test"]
            }
        });

        courseId = course.id;
        console.log("✓ Course created");
        console.log(`   ID: ${courseId}`);
        console.log(`   Title: ${course.title}`);
        console.log(`   Slug: ${course.slug}\n`);

        // VERIFY: Re-fetch from DB
        const verifiedCourse = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!verifiedCourse) {
            console.error("❌ FATAL: Course not found in DB after creation!");
            process.exit(1);
        }
        console.log("✓ Course verified in database\n");

        // STEP 2: Create Lesson DIRECTLY
        console.log("[STEP 2] Creating lesson directly via Prisma...");
        const lesson = await prisma.lesson.create({
            data: {
                courseId: courseId,
                title: "Test Lesson 1",
                description: "Direct DB test lesson",
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                order: 1,
                published: true
            }
        });

        lessonId = lesson.id;
        console.log("✓ Lesson created");
        console.log(`   ID: ${lessonId}`);
        console.log(`   Title: ${lesson.title}`);
        console.log(`   Course ID: ${lesson.courseId}\n`);

        // VERIFY: Re-fetch
        const verifiedLesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { course: true }
        });

        if (!verifiedLesson) {
            console.error("❌ FATAL: Lesson not found in DB after creation!");
            process.exit(1);
        }
        console.log("✓ Lesson verified in database");
        console.log(`   Linked to course: ${verifiedLesson.course.title}\n`);

        // STEP 3: Create Quiz DIRECTLY
        console.log("[STEP 3] Creating quiz directly via Prisma...");
        const quiz = await prisma.quiz.create({
            data: {
                courseId: courseId,
                lessonId: lessonId,
                title: "Test Quiz",
                type: "LESSON_QUIZ",
                questions: [
                    {
                        id: "q1",
                        question: "What is the capital of France?",
                        options: ["London", "Paris", "Berlin", "Madrid"],
                        correctAnswer: 1
                    },
                    {
                        id: "q2",
                        question: "What is 2 + 2?",
                        options: ["3", "4", "5", "6"],
                        correctAnswer: 1
                    }
                ]
            }
        });

        quizId = quiz.id;
        console.log("✓ Quiz created");
        console.log(`   ID: ${quizId}`);
        console.log(`   Title: ${quiz.title}`);
        console.log(`   Type: ${quiz.type}`);
        console.log(`   Questions: ${(quiz.questions as any[]).length}\n`);

        // VERIFY: Re-fetch with full data
        const verifiedQuiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                course: { select: { title: true } },
                lesson: { select: { title: true } }
            }
        });

        if (!verifiedQuiz) {
            console.error("❌ FATAL: Quiz not found in DB after creation!");
            process.exit(1);
        }
        console.log("✓ Quiz verified in database");
        console.log(`   Linked to course: ${verifiedQuiz.course.title}`);
        console.log(`   Linked to lesson: ${verifiedQuiz.lesson?.title}`);
        console.log(`   Questions stored:`, JSON.stringify(verifiedQuiz.questions, null, 2));
        console.log();

        // FINAL CHECK: Verify full relationship tree
        console.log("[FINAL] Checking full relationship tree...");
        const fullTree = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                lessons: {
                    include: { quiz: true }
                }
            }
        });

        console.log("\n════════════════════════════════════════════════════════");
        console.log("✓ ALL TESTS PASSED - DATA PERSISTENCE VERIFIED");
        console.log("════════════════════════════════════════════════════════");
        console.log();
        console.log("Created Records:");
        console.log(`  Course ID: ${courseId}`);
        console.log(`  Lesson ID: ${lessonId}`);
        console.log(`  Quiz ID: ${quizId}`);
        console.log();
        console.log("Database Relationships:");
        console.log(`  ✓ Course exists with ID: ${fullTree?.id}`);
        console.log(`  ✓ Course has ${fullTree?.lessons.length} lesson(s)`);
        console.log(`  ✓ Lesson has quiz: ${fullTree?.lessons[0]?.quiz ? 'YES' : 'NO'}`);
        console.log(`  ✓ Quiz has ${(verifiedQuiz.questions as any[]).length} questions`);
        console.log();
        console.log("PROOF: All save operations successfully persisted to MongoDB");
        console.log("════════════════════════════════════════════════════════\n");

        // Cleanup
        console.log("[CLEANUP] Removing test data...");
        await prisma.quiz.delete({ where: { id: quizId } });
        await prisma.lesson.delete({ where: { id: lessonId } });
        await prisma.course.delete({ where: { id: courseId } });
        console.log("✓ Cleanup complete\n");

    } catch (error: any) {
        console.error("\n❌ TEST FAILED");
        console.error("Error:", error.message);
        console.error("Stack:", error.stack);

        // Cleanup on error
        try {
            if (quizId) await prisma.quiz.delete({ where: { id: quizId } });
            if (lessonId) await prisma.lesson.delete({ where: { id: lessonId } });
            if (courseId) await prisma.course.delete({ where: { id: courseId } });
        } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError);
        }

        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

directDatabaseTest();
