/**
 * FINAL PRODUCTION VERIFICATION SCRIPT
 * Tests all critical flows end-to-end with DB verification
 */

import { PrismaClient } from "@prisma/client";
import { createCourse } from "../actions/courses";
import { createLesson } from "../actions/lessons";
import { upsertQuiz } from "../actions/quizzes";

const prisma = new PrismaClient();

async function finalProductionVerification() {
    console.log("═══════════════════════════════════════════════════════");
    console.log("FINAL PRODUCTION VERIFICATION - ALL FLOWS");
    console.log("═══════════════════════════════════════════════════════\n");

    let courseId: string | null = null;
    let lessonId: string | null = null;
    let quizId: string | null = null;

    const results = {
        courseCreate: false,
        lessonCreate: false,
        quizCreate: false,
        dataIntegrity: false,
        relationships: false
    };

    try {
        // ===== STEP 1: CREATE COURSE =====
        console.log("[STEP 1] Creating demo course via action...");
        const category = await prisma.courseCategory.findFirst() ||
            await prisma.courseCategory.create({
                data: { name: "Final Test Category", slug: "final-test-" + Date.now() }
            });

        const courseResult = await createCourse({
            title: "FINAL VERIFICATION - Production Test Course",
            description: "Complete end-to-end verification of all flows",
            thumbnail: "https://placehold.co/600x400/10B981/white?text=VERIFIED",
            categoryId: category.id,
            difficulty: "Advanced",
            certificateType: "CAREER",
            published: true, // Published for student panel testing
            instructorName: "Production Tester",
            instructorChannelName: "DevOps Channel",
            tags: ["production", "verification", "e2e"]
        });

        if (!courseResult.success || !courseResult.courseId) {
            console.error("❌ FAILED: Course creation");
            console.error("   Error:", courseResult.error);
            throw new Error("Course creation failed");
        }

        courseId = courseResult.courseId;
        results.courseCreate = true;
        console.log("✓ Course created");
        console.log(`   ID: ${courseId}\n`);

        // Verify in DB
        const dbCourse = await prisma.course.findUnique({
            where: { id: courseId },
            include: { category: true }
        });

        if (!dbCourse) {
            throw new Error("Course not found in DB after creation!");
        }

        console.log("✓ Course verified in database:");
        console.log(JSON.stringify({
            id: dbCourse.id,
            title: dbCourse.title,
            published: dbCourse.published,
            category: dbCourse.category?.name
        }, null, 2));
        console.log();

        // ===== STEP 2: CREATE LESSON =====
        console.log("[STEP 2] Creating lesson via action...");
        const lessonResult = await createLesson({
            courseId: courseId,
            title: "Production Test Lesson - Advanced Concepts",
            description: "Testing lesson creation and DB persistence",
            videoUrl: "https://www.youtube.com/watch?v=test123",
            order: 1,
            published: true
        });

        if (!lessonResult.success || !lessonResult.lesson) {
            console.error("❌ FAILED: Lesson creation");
            console.error("   Error:", lessonResult.error);
            throw new Error("Lesson creation failed");
        }

        lessonId = lessonResult.lesson.id;
        results.lessonCreate = true;
        console.log("✓ Lesson created");
        console.log(`   ID: ${lessonId}\n`);

        // Verify in DB
        const dbLesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { course: { select: { title: true } } }
        });

        if (!dbLesson) {
            throw new Error("Lesson not found in DB after creation!");
        }

        console.log("✓ Lesson verified in database:");
        console.log(JSON.stringify({
            id: dbLesson.id,
            title: dbLesson.title,
            videoUrl: dbLesson.videoUrl,
            courseTitle: dbLesson.course.title
        }, null, 2));
        console.log();

        // ===== STEP 3: CREATE QUIZ =====
        console.log("[STEP 3] Creating quiz with 3 questions via action...");
        const quizResult = await upsertQuiz({
            courseId: courseId,
            lessonId: lessonId,
            title: "Production Test Quiz",
            type: "LESSON_QUIZ",
            questions: [
                {
                    id: "prod_q1",
                    question: "What is the purpose of this verification?",
                    options: ["To break things", "To verify production readiness", "Random testing", "None"],
                    correctAnswer: 1
                },
                {
                    id: "prod_q2",
                    question: "Which database are we using?",
                    options: ["PostgreSQL", "MongoDB", "MySQL", "SQLite"],
                    correctAnswer: 1
                },
                {
                    id: "prod_q3",
                    question: "Is data persistence critical?",
                    options: ["No", "Maybe", "Yes", "Sometimes"],
                    correctAnswer: 2
                }
            ]
        });

        if (!quizResult.success || !quizResult.quiz) {
            console.error("❌ FAILED: Quiz creation");
            console.error("   Error:", quizResult.error);
            throw new Error("Quiz creation failed");
        }

        quizId = quizResult.quiz.id;
        results.quizCreate = true;
        console.log("✓ Quiz created");
        console.log(`   ID: ${quizId}\n`);

        // Verify in DB
        const dbQuiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                course: { select: { title: true } },
                lesson: { select: { title: true } }
            }
        });

        if (!dbQuiz) {
            throw new Error("Quiz not found in DB after creation!");
        }

        console.log("✓ Quiz verified in database:");
        console.log(JSON.stringify({
            id: dbQuiz.id,
            title: dbQuiz.title,
            type: dbQuiz.type,
            questionCount: (dbQuiz.questions as any[]).length,
            courseTitle: dbQuiz.course.title,
            lessonTitle: dbQuiz.lesson?.title
        }, null, 2));
        console.log();

        results.dataIntegrity = true;

        // ===== STEP 4: VERIFY RELATIONSHIPS =====
        console.log("[STEP 4] Verifying complete relationship tree...");
        const fullCourse = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                lessons: {
                    include: { quiz: true },
                    orderBy: { order: 'asc' }
                },
                category: true
            }
        });

        if (!fullCourse) {
            throw new Error("Course not found in relationship check!");
        }

        const hasLesson = fullCourse.lessons.length > 0;
        const hasQuiz = fullCourse.lessons[0]?.quiz !== null;

        if (!hasLesson || !hasQuiz) {
            throw new Error("Relationship verification failed!");
        }

        results.relationships = true;

        console.log("✓ Relationship tree verified:");
        console.log(JSON.stringify({
            course: {
                id: fullCourse.id,
                title: fullCourse.title,
                published: fullCourse.published,
                category: fullCourse.category?.name
            },
            lessons: fullCourse.lessons.map(l => ({
                id: l.id,
                title: l.title,
                hasQuiz: !!l.quiz
            }))
        }, null, 2));
        console.log();

        // ===== FINAL REPORT =====
        console.log("═══════════════════════════════════════════════════════");
        console.log("✅ ALL TESTS PASSED - PRODUCTION READY");
        console.log("═══════════════════════════════════════════════════════");
        console.log();
        console.log("Test Results:");
        console.log(`  ✓ Course Creation: ${results.courseCreate ? 'PASS' : 'FAIL'}`);
        console.log(`  ✓ Lesson Creation: ${results.lessonCreate ? 'PASS' : 'FAIL'}`);
        console.log(`  ✓ Quiz Creation: ${results.quizCreate ? 'PASS' : 'FAIL'}`);
        console.log(`  ✓ Data Integrity: ${results.dataIntegrity ? 'PASS' : 'FAIL'}`);
        console.log(`  ✓ Relationships: ${results.relationships ? 'PASS' : 'FAIL'}`);
        console.log();
        console.log("Created IDs:");
        console.log(`  Course: ${courseId}`);
        console.log(`  Lesson: ${lessonId}`);
        console.log(`  Quiz: ${quizId}`);
        console.log();
        console.log("Student Panel Test URLs:");
        console.log(`  Browse Courses: http://localhost:3000/courses`);
        console.log(`  Course Details: http://localhost:3000/courses/${courseId}`);
        console.log();
        console.log("Admin Panel Test URLs:");
        console.log(`  Edit Course: http://localhost:3000/admin/courses/${courseId}`);
        console.log(`  Edit Course (Lessons Tab): http://localhost:3000/admin/courses/${courseId}?tab=lessons`);
        console.log(`  Edit Course (Quiz Tab): http://localhost:3000/admin/courses/${courseId}?tab=final-quiz`);
        console.log();
        console.log("⚠️  Course will persist in database for verification.");
        console.log("   Run manual browser tests before cleanup.");
        console.log("═══════════════════════════════════════════════════════\n");

    } catch (error: any) {
        console.error("\n❌ VERIFICATION FAILED");
        console.error("Error:", error.message);
        console.error("Stack:", error.stack);
        console.error();
        console.error("Results achieved:");
        console.error(JSON.stringify(results, null, 2));

        // Attempt cleanup
        try {
            if (quizId) await prisma.quiz.delete({ where: { id: quizId } });
            if (lessonId) await prisma.lesson.delete({ where: { id: lessonId } });
            if (courseId) await prisma.course.delete({ where: { id: courseId } });
        } catch (cleanupError) {
            console.error("Cleanup failed:", cleanupError);
        }

        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

finalProductionVerification();
