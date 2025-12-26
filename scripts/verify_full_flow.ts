
import { createCourse, deleteCourse } from "../actions/courses";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyFlows() {
    console.log("------------------------------------------");
    console.log("STARTING ADMIN FLOW VERIFICATION (SCRIPT)");
    console.log("------------------------------------------");

    // 1. CREATE FLOW
    console.log("\n[1] Testing CREATE Flow...");
    let category = await prisma.courseCategory.findFirst();
    if (!category) {
        category = await prisma.courseCategory.create({ data: { name: "Debug Cat", slug: "debug-cat" } });
    }

    const createRes = await createCourse({
        title: "Antigravity Debug Course",
        description: "Created via verification script",
        thumbnail: "https://placehold.co/600x400",
        instructorName: "AG Bot",
        categoryId: category.id,
        published: false
    });

    if (!createRes.success || !createRes.courseId) {
        console.error("❌ CREATE FAILED:", createRes.error);
        process.exit(1);
    }
    console.log("✅ Course Created. ID:", createRes.courseId);

    const targetUrl = `http://localhost:3000/admin/courses/${createRes.courseId}?tab=lessons`;
    console.log("   Target URL:", targetUrl);

    // 2. VERIFY URL ACCESSIBILITY (Simulate Edit Page Load)
    console.log("\n[2] Testing EDIT Page Accessibility...");
    try {
        const res = await fetch(targetUrl);
        if (res.status === 200) {
            console.log(`✅ Page accessibility verified. Status: ${res.status}`);
            // We can't easily check content without DOM parser, but 200 OK on correct ID path is good signal.
        } else {
            console.error(`❌ Page returned status: ${res.status}`);
            // Check if 404
            if (res.status === 404) {
                console.error("❌ CRITICAL: 404 on Course Page!");
            }
        }
    } catch (e) {
        console.error("❌ Network error checking page:", e.message);
    }

    // 3. DELETE FLOW
    console.log("\n[3] Testing DELETE Flow...");
    const deleteRes = await deleteCourse(createRes.courseId);
    if (!deleteRes.success) {
        console.error("❌ DELETE FAILED:", deleteRes.error);
        process.exit(1);
    }
    console.log("✅ Delete Action Executed.");

    // 4. VERIFY DB STATE
    const check = await prisma.course.findUnique({ where: { id: createRes.courseId } });
    if (check?.deletedAt && !check.published) {
        console.log("✅ DB State Verified: Course is Soft-Deleted.");
    } else {
        console.error("❌ DB State Mismatch. Course still active or not deleted.");
        console.log("   State:", check);
    }

    // CLEANUP
    console.log("\n[Cleanup] Removing test record...");
    await prisma.course.delete({ where: { id: createRes.courseId } });
    console.log("✅ Cleanup Done.");
}

verifyFlows();
