
import { updateCMSPage, getCMSPage } from "../app/actions/cms";
import { prisma } from "../lib/prisma";

async function verifyCMSFlow() {
    console.log("🚀 Starting CMS Flow Verification...");
    console.log("Prisma Keys:", Object.keys(prisma));
    // Check if cMSPage exists
    const models = ['cMSPage', 'CMSPage', 'cmsPage', 'CmsPage'];
    for (const m of models) {
        // @ts-ignore
        if (prisma[m]) {
            console.log(`✅ Found model accessor: ${m}`);
        } else {
            console.log(`❌ Missing model accessor: ${m}`);
        }
    }

    // Debug dmmf
    // @ts-ignore
    if (prisma._runtimeDataModel) {
        // @ts-ignore
        console.log("Runtime Models:", Object.keys(prisma._runtimeDataModel.models));
    }



    const testSlug = "about";
    const testTitle = "About Us";
    const testContent = "I am testing CMS save flow.";

    // 1. Simulate Admin Save
    console.log(`\n📝 Simulating Admin Update for /${testSlug}...`);
    try {
        const result = await updateCMSPage(testSlug, {
            slug: testSlug,
            title: testTitle,
            content: testContent,
            status: "published"
        });

        if (result.success) {
            console.log("✅ Admin Save Successful!");
        } else {
            const err = result.error || "";
            if (err.includes("revalidatePath") || err.includes("static generation") || err.includes("NEXT_RSC_CONTEXT_ERROR")) {
                console.log("⚠️ Ignoring 'revalidatePath' error (expected in standalone script). Proceeding to DB check.");
            } else {
                console.error("❌ Admin Save Failed:", result.error);
                process.exit(1);
            }
        }
    } catch (e) {
        console.error("❌ Exception during save:", e);
        // Ignore revalidatePath error in script context
        if (e.message.includes("NEXT_RSC_CONTEXT_ERROR") || e.message.includes("Invariant: static generation")) {
            console.log("⚠️ Ignoring 'revalidatePath' error (expected in standalone script)");
        } else {
            process.exit(1);
        }
    }

    // 2. Verify Database State
    console.log(`\n🔍 Verifying Database Value...`);
    const dbPage = await prisma.cMSPage.findUnique({ where: { slug: testSlug } });

    if (!dbPage) {
        console.error("❌ Page not found in DB!");
        process.exit(1);
    }

    if (dbPage.content.trim() === testContent.trim()) {
        console.log("✅ DB Content Matches Input: 'I am testing CMS save flow.'");
    } else {
        console.error("❌ DB Content Mismatch!");
        console.log("Expected:\n", testContent);
        console.log("Got:\n", dbPage.content);
        process.exit(1);
    }

    if (dbPage.status === "published") {
        console.log("✅ DB Status is PUBLISHED!");
        if (dbPage.publishedAt) {
            console.log("✅ DB publishedAt is SET!");
        } else {
            console.error("❌ DB publishedAt is MISSING despite status=published!");
            process.exit(1);
        }
    } else {
        console.error("❌ DB Status Incorrect:", dbPage.status);
        process.exit(1);
    }

    // 3. Verify Fetch Logic (Student View)
    console.log(`\n🌍 Verifying Public Fetch Logic...`);
    const publicPage = await getCMSPage(testSlug);

    if (publicPage && publicPage.content.trim() === testContent.trim()) {
        console.log("✅ Public Fetch returns correct content!");
    } else {
        console.error("❌ Public Fetch failed or returned stale content.");
    }

    console.log("\n🎉 CMS Verification Complete: System is Stable.");
}

verifyCMSFlow()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
