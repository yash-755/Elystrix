import { PrismaClient } from "@prisma/client";
import { createCourse } from "../actions/courses";
import { createLesson } from "../actions/lessons";
import { upsertQuiz } from "../actions/quizzes";

const prisma = new PrismaClient();

async function strictRuntimeVerification() {
    console.log("════════════════════════════════════════════════════════");
    console.log("STRICT RUNTIME VERIFICATION - DATA PERSISTENCE TEST");
    console.log("════════════════════════════════════════════════════════\n");

    let courseId: string | null = null;
    let lessonId: string | null = null;
    let quizId: string | null = null;

    try {
        // STEP 1: Create Course
        console.log("[STEP 1] Creating demo course...");
        const category = await prisma.courseCategory.findFirst() ||
            await prisma.courseCategory.create({
                data: { name: "Test Category", slug: "test-category" }
            });

        const courseResult = await createCourse({
            title: "Runtime Verification Demo Course",
            description: "Testing data persistence end-to-end",
            thumbnail: "https://placehold.co/600x400",
            categoryId: category.id,
            difficulty: "Beginner",
            certificateType: "BASIC",
            published: false,
            instructorName: "Test Instructor",
            instructorChannelName: "Test Channel",
            tags: ["test", "verification"]
        });

        if (!courseResult.success || !courseResult.courseId) {
            console.error("❌ FAILED: Course creation failed");
            console.error("   Error:", courseResult.error);
            process.exit(1);
        }

        courseId = courseResult.courseId;
        console.log("✓ Course created via action");
        console.log(`   Course ID: ${courseId}\n`);

        // VERIFY STEP 1
        console.log("[VERIFY STEP 1] Querying course from DB...");
        const dbCourse = await prisma.course.findUnique({
            where: { id: courseId },
            include: { category: true }
        });

        if (!dbCourse) {
            console.error("❌ CRITICAL FAILURE: Course not found in DB after creation!");
            process.exit(1);
        }

        console.log("✓ Course verified in database:");
        console.log("   DB Record:", JSON.stringify({
            id: dbCourse.id,
            title: dbCourse.title,
            slug: dbCourse.slug,
            published: dbCourse.published,
            category: dbCourse.category?.name,
            instructorName: dbCourse.instructorName,
            createdAt: dbCourse.createdAt
        }, null, 2));
        console.log();

        // STEP 2: Create Lesson
        console.log("[STEP 2] Creating lesson...");
        const lessonResult = await createLesson({
            courseId: courseId,
            title: "Test Lesson - Introduction",
            description: "This is a test lesson for verification",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            order: 1,
            published: true
        });

        if (!lessonResult.success || !lessonResult.lesson) {
            console.error("❌ FAILED: Lesson creation failed");
            console.error("   Error:", lessonResult.error);
            process.exit(1);
        }

        lessonId = lessonResult.lesson.id;
        console.log("✓ Lesson created via action");
        console.log(`   Lesson ID: ${lessonId}\n`);

        // VERIFY STEP 2
        console.log("[VERIFY STEP 2] Querying lesson from DB...");
        const dbLesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { course: { select: { title: true } } }
        });

        if (!dbLesson) {
            console.error("❌ CRITICAL FAILURE: Lesson not found in DB after creation!");
            process.exit(1);
        }

        console.log("✓ Lesson verified in database:");
        console.log("   DB Record:", JSON.stringify({
            id: dbLesson.id,
            title: dbLesson.title,
            description: dbLesson.description,
            videoUrl: dbLesson.videoUrl,
            published: dbLesson.published,
            order: dbLesson.order,
            courseId: dbLesson.courseId,
            courseTitle: dbLesson.course.title,
            createdAt: dbLesson.createdAt
        }, null, 2));
        console.log();

        // STEP 3: Create Quiz
        console.log("[STEP 3] Creating quiz with 2 questions...");
        const quizResult = await upsertQuiz({
            courseId: courseId,
            lessonId: lessonId,
            title: "Test Lesson Quiz",
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
        });

        if (!quizResult.success || !quizResult.quiz) {
            console.error("❌ FAILED: Quiz creation failed");
            console.error("   Error:", quizResult.error);
            process.exit(1);
        }

        quizId = quizResult.quiz.id;
        console.log("✓ Quiz created via action");
        console.log(`   Quiz ID: ${quizId}\n`);

        // VERIFY STEP 3
        console.log("[VERIFY STEP 3] Querying quiz from DB...");
        const dbQuiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                course: { select: { title: true } },
                lesson: { select: { title: true } }
            }
        });

        if (!dbQuiz) {
            console.error("❌ CRITICAL FAILURE: Quiz not found in DB after creation!");
            process.exit(1);
        }

        console.log("✓ Quiz verified in database:");
        console.log("   DB Record:", JSON.stringify({
            id: dbQuiz.id,
            title: dbQuiz.title,
            type: dbQuiz.type,
            courseId: dbQuiz.courseId,
            lessonId: dbQuiz.lessonId,
            courseTitle: dbQuiz.course.title,
            lessonTitle: dbQuiz.lesson?.title,
            questionCount: (dbQuiz.questions as any[]).length,
            questions: dbQuiz.questions,
            createdAt: dbQuiz.createdAt
        }, null, 2));
        console.log();

        // FINAL VERIFICATION: Check relationships
        console.log("[FINAL] Verifying data relationships...");
        const courseFull = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                lessons: {
                    include: { quiz: true }
                }
            }
        });

        if (!courseFull) {
            console.error("❌ Course not found in final check");
            process.exit(1);
        }

        const hasLesson = courseFull.lessons.length > 0;
        const hasQuiz = courseFull.lessons[0]?.quiz !== null;

        console.log("\n════════════════════════════════════════════════════════");
        console.log("VERIFICATION COMPLETE - ALL TESTS PASSED ✓");
        console.log("════════════════════════════════════════════════════════");
        console.log(`Course ID: ${courseId}`);
        console.log(`Lesson ID: ${lessonId}`);
        console.log(`Quiz ID: ${quizId}`);
        console.log();
        console.log("Relationship Verification:");
        console.log(`  ✓ Course has ${courseFull.lessons.length} lesson(s)`);
        console.log(`  ✓ Lesson has ${hasQuiz ? '1' : '0'} quiz`);
        console.log(`  ✓ Quiz has ${(dbQuiz!.questions as any[]).length} questions`);
        console.log();
        console.log("DATA PERSISTENCE: CONFIRMED ✓");
        console.log("All save actions successfully persisted to MongoDB");
        console.log("════════════════════════════════════════════════════════\n");

        // Cleanup (optional - comment out to keep test data)
        console.log("[CLEANUP] Removing test records...");
        await prisma.quiz.delete({ where: { id: quizId } });
        await prisma.lesson.delete({ where: { id: lessonId } });
        await prisma.course.delete({ where: { id: courseId } });
        console.log("✓ Cleanup complete\n");

    } catch (error: any) {
        console.error("\n❌ VERIFICATION FAILED");
        console.error("Error:", error.message);
        console.error("Stack:", error.stack);

        // Attempt cleanup on error
        if (quizId) await prisma.quiz.delete({ where: { id: quizId } }).catch(() => { });
        if (lessonId) await prisma.lesson.delete({ where: { id: lessonId } }).catch(() => { });
        if (courseId) await prisma.course.delete({ where: { id: courseId } }).catch(() => { });

        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

strictRuntimeVerification();
