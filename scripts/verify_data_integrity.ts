import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyDataIntegrity() {
    console.log("═══════════════════════════════════════════");
    console.log("DATA INTEGRITY VERIFICATION SCRIPT");
    console.log("═══════════════════════════════════════════\n");

    try {
        // 1. Verify Courses
        console.log("[] Checking Courses...");
        const courses = await prisma.course.findMany({
            where: { deletedAt: null },
            include: {
                category: true,
                lessons: {
                    include: { quiz: true },
                    orderBy: { order: 'asc' }
                },
                quizzes: {
                    where: { type: "FINAL_QUIZ" }
                }
            },
            take: 5
        });

        console.log(`   Found ${courses.length} active courses`);
        for (const course of courses) {
            console.log(`   - ${course.title}`);
            console.log(`     Category: ${course.category?.name || 'None'}`);
            console.log(`     Published: ${course.published}`);
            console.log(`     Lessons: ${course.lessons.length}`);
            console.log(`     Final Quiz: ${course.quizzes.length > 0 ? 'Yes' : 'No'}`);

            // Verify required fields
            if (!course.title || !course.slug) {
                console.error(`     ❌ MISSING REQUIRED FIELDS`);
            } else {
                console.log(`     ✓ Required fields present`);
            }
        }

        // 2. Verify Lessons
        console.log("\n[2] Checking Lessons...");
        const lessons = await prisma.lesson.findMany({
            include: { course: true, quiz: true },
            take: 10,
            orderBy: { createdAt: 'desc' }
        });

        console.log(`   Found ${lessons.length} lessons`);
        let validLessons = 0;
        let invalidLessons = 0;

        for (const lesson of lessons) {
            const isValid = lesson.title && lesson.courseId;
            if (isValid) {
                validLessons++;
                console.log(`   ✓ ${lesson.title}`);
                console.log(`     Video URL: ${lesson.videoUrl ? 'Set' : 'Not Set'}`);
                console.log(`     Published: ${lesson.published}`);
                console.log(`     Quiz: ${lesson.quiz ? 'Attached' : 'None'}`);
            } else {
                invalidLessons++;
                console.error(`   ❌ Invalid lesson ID ${lesson.id}: Missing required fields`);
            }
        }

        console.log(`\n   Summary: ${validLessons} valid, ${invalidLessons} invalid`);

        // 3. Verify Quizzes
        console.log("\n[3] Checking Quizzes...");
        const quizzes = await prisma.quiz.findMany({
            include: { course: true, lesson: true },
            take: 10,
            orderBy: { createdAt: 'desc' }
        });

        console.log(`   Found ${quizzes.length} quizzes`);
        let validQuizzes = 0;
        let invalidQuizzes = 0;

        for (const quiz of quizzes) {
            const questions = quiz.questions as any;
            const hasValidQuestions = Array.isArray(questions) && questions.length > 0;

            if (hasValidQuestions) {
                const firstQ = questions[0];
                const hasValidStructure =
                    firstQ.question &&
                    Array.isArray(firstQ.options) &&
                    typeof firstQ.correctAnswer === 'number';

                if (hasValidStructure) {
                    validQuizzes++;
                    console.log(`   ✓ ${quiz.title} (${quiz.type})`);
                    console.log(`     Questions: ${questions.length}`);
                    console.log(`     Course: ${quiz.course.title}`);
                    if (quiz.lesson) {
                        console.log(`     Lesson: ${quiz.lesson.title}`);
                    }
                } else {
                    invalidQuizzes++;
                    console.error(`   ❌ Invalid quiz structure for ${quiz.title}`);
                    console.error(`      Sample question:`, JSON.stringify(firstQ, null, 2));
                }
            } else {
                invalidQuizzes++;
                console.error(`   ❌ Quiz ${quiz.title} has no questions or invalid format`);
            }
        }

        console.log(`\n   Summary: ${validQuizzes} valid, ${invalidQuizzes} invalid`);

        // 4. Check Foreign Key Integrity
        console.log("\n[4] Checking Foreign Key Integrity...");

        const orphanedLessons = await prisma.lesson.findMany({
            where: {
                course: null
            }
        });

        if (orphanedLessons.length > 0) {
            console.error(`   ❌ Found ${orphanedLessons.length} orphaned lessons`);
        } else {
            console.log(`   ✓ No orphaned lessons`);
        }

        // 5. Final Report
        console.log("\n═══════════════════════════════════════════");
        console.log("VERIFICATION COMPLETE");
        console.log("═══════════════════════════════════════════");
        console.log(`Courses: ${courses.length} verified`);
        console.log(`Lessons: ${validLessons}/${lessons.length} valid`);
        console.log(`Quizzes: ${validQuizzes}/${quizzes.length} valid`);
        console.log(`Foreign Keys: ${orphanedLessons.length === 0 ? '✓ Intact' : '❌ Issues Found'}`);

        if (invalidLessons > 0 || invalidQuizzes > 0 || orphanedLessons.length > 0) {
            console.log("\n⚠️  ISSUES DETECTED - Review logs above");
            process.exit(1);
        } else {
            console.log("\n✓ ALL CHECKS PASSED");
        }

    } catch (error) {
        console.error("\n❌ VERIFICATION FAILED:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verifyDataIntegrity();
