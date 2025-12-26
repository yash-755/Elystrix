
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function run() {
    const course = await prisma.course.findFirst({
        where: { title: "Antigravity Demo Course" },
        orderBy: { createdAt: 'desc' }
    });
    if (course) {
        console.log("FOUND COURSE ID:", course.id);
        console.log("SLUG:", course.slug);
    } else {
        console.log("COURSE NOT FOUND");
    }
}
run();
