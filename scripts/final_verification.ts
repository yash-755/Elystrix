import { createCourse, deleteCourse } from "../actions/courses";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function finalVerification() {
    console.log("════════════════════════════════════════");
    console.log("FINAL ADMIN COURSE FLOW VERIFICATION");
    console.log("════════════════════════════════════════\n");

    // 1. CREATE
    console.log("✓ Step 1: Creating demo course...");
    const category = await prisma.courseCategory.findFirst() ||
        await prisma.courseCategory.create({ data: { name: "Test Cat", slug: "test-cat" } });

    const createResult = await createCourse({
        title: "Antigravity Final Verification Course",
        description: "Testing Create → Edit → Delete flow",
        thumbnail: "https://placehold.co/600x400",
        instructorName: "Verification Bot",
        categoryId: category.id,
        published: false
    });

    if (!createResult.success || !createResult.courseId) {
        console.error("✗ CREATE FAILED:", createResult.error);
        process.exit(1);
    }
    console.log(`✓ Course Created: ${createResult.courseId}\n`);

    const courseId = createResult.courseId;
    const editUrl = `http://localhost:3000/admin/courses/${courseId}`;

    // 2. EDIT PAGE ACCESSIBILITY
    console.log("✓ Step 2: Verifying Edit page accessibility...");
    console.log(`  URL: ${editUrl}`);
    try {
        const response = await fetch(editUrl);
        if (response.status === 200) {
            console.log(`✓ Edit page returned 200 OK\n`);
        } else {
            console.error(`✗ Edit page returned ${response.status}`);
            process.exit(1);
        }
    } catch (e) {
        console.error("✗ Failed to fetch edit page:", e.message);
        process.exit(1);
    }

    // 3. DATABASE VERIFICATION
    console.log("✓ Step 3: Verifying course exists in database...");
    const dbCourse = await prisma.course.findUnique({ where: { id: courseId } });
    if (!dbCourse) {
        console.error("✗ Course not found in database");
        process.exit(1);
    }
    console.log(`✓ Course found in DB: "${dbCourse.title}"\n`);

    // 4. DELETE
    console.log("✓ Step 4: Executing delete action...");
    const deleteResult = await deleteCourse(courseId);
    if (!deleteResult.success) {
        console.error("✗ DELETE FAILED:", deleteResult.error);
        process.exit(1);
    }
    console.log("✓ Delete action successful\n");

    // 5. VERIFY SOFT DELETE
    console.log("✓ Step 5: Verifying soft delete state...");
    const deletedCourse = await prisma.course.findUnique({ where: { id: courseId } });
    if (!deletedCourse?.deletedAt || deletedCourse.published) {
        console.error("✗ Course not properly soft-deleted");
        console.log("  State:", deletedCourse);
        process.exit(1);
    }
    console.log("✓ Soft delete confirmed (deletedAt set, published=false)\n");

    // CLEANUP
    await prisma.course.delete({ where: { id: courseId } });
    console.log("✓ Cleanup complete\n");

    console.log("════════════════════════════════════════");
    console.log("ALL CHECKS PASSED ✓");
    console.log("════════════════════════════════════════");
}

finalVerification();
