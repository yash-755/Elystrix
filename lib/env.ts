
const requiredServerEnvs = [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "GEMINI_API_KEY", // Added strict server-side check
];

const requiredClientEnvs = [
    // "NEXT_PUBLIC_GEMINI_API_KEY", // Config Removed: Gemini is now server-side only
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
];

export function validateEnv() {
    const missingEnvs: string[] = [];
    const isServer = typeof window === "undefined";

    // Check client envs (available everywhere)
    requiredClientEnvs.forEach((key) => {
        if (!process.env[key]) {
            missingEnvs.push(key);
        }
    });

    // Check server envs (only on server)
    if (isServer) {
        requiredServerEnvs.forEach((key) => {
            if (!process.env[key]) {
                missingEnvs.push(key);
            }
        });
    }

    if (missingEnvs.length > 0) {
        const message =
            "\n" +
            "==================================================\n" +
            "❌ MISSING ENVIRONMENT VARIABLES\n" +
            "==================================================\n" +
            "The following environment variables are missing:\n" +
            missingEnvs.map((key) => ` - ${key}`).join("\n") +
            "\n\n" +
            "Please check your .env.local file.\n" +
            "==================================================\n";

        console.error(message);

        // Fail loudly in development
        if (process.env.NODE_ENV === "development") {
            throw new Error(`Missing required environment variables: ${missingEnvs.join(", ")}`);
        }
    }
}

// Run validation immediately when this file is imported
try {
    validateEnv();
} catch (error) {
    // In case validation throws, we let it bubble up or log it
    // If it throws in dev, it crashes the app (desired).
    // In prod, it logs error (from function) and proceeds? 
    // Wait, if I throw in validateEnv, this catch block catches it?
    // If I want to crash app, I should rethrow.
    if (process.env.NODE_ENV === "development") {
        throw error;
    }
}
