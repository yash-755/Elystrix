
import { deleteCourse } from "../actions/courses";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
    const courseId = "694ea6561a6570f63f74b1c4"; // From previous step
    console.log("Checking course status before delete...");

    const before = await prisma.course.findUnique({ where: { id: courseId } });
    if (!before) {
        console.log("Course not found (might differ from deletedAt cleanup). Trying to create new transient one.");
    } else {
        console.log("Course exists. Published:", before.published, "DeletedAt:", before.deletedAt);
    }

    console.log("Executing Delete Action...");
    const result = await deleteCourse(courseId);
    console.log("Delete result:", result);

    const after = await prisma.course.findUnique({ where: { id: courseId } });
    console.log("After delete - DeletedAt:", after?.deletedAt);

    if (after?.deletedAt && !after.published) {
        console.log("VERIFIED: Soft Delete Successful.");
        // Hard delete for cleanup
        await prisma.course.delete({ where: { id: courseId } });
    } else {
        console.error("FAILED: Delete logic did not update fields correctly.");
    }
}

run();
