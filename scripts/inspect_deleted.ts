import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function inspectDeletedAtValues() {
    console.log("Inspecting deletedAt field values...\n");

    const courses = await prisma.course.findMany({
        where: { published: true },
        select: {
            title: true,
            published: true,
            deletedAt: true
        }
    });

    courses.forEach(c => {
        console.log(`Course: ${c.title}`);
        console.log(`  deletedAt value: ${c.deletedAt}`);
        console.log(`  deletedAt === null: ${c.deletedAt === null}`);
        console.log(`  deletedAt type: ${typeof c.deletedAt}`);
        console.log();
    });

    // Try different query patterns
    console.log("\nTrying different query patterns:");

    console.log("\n[1] Using NOT filter:");
    const result1 = await prisma.course.findMany({
        where: {
            published: true,
            NOT: { deletedAt: { not: null } }
        }
    });
    console.log(`Results: ${result1.length}`);

    console.log("\n[2] Omitting deletedAt filter:");
    const result2 = await prisma.course.findMany({
        where: { published: true }
    });
    console.log(`Results: ${result2.length}`);

    console.log("\n[3] Using undefined:");
    const result3 = await prisma.course.findMany({
        where: {
            published: true,
            deletedAt: undefined as any
        }
    });
    console.log(`Results: ${result3.length}`);

    await prisma.$disconnect();
}

inspectDeletedAtValues();
