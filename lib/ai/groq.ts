import Groq from "groq-sdk";

// Use server-side environment variable only
const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
    console.error("❌ GROQ_API_KEY is missing in environment variables.");
}

let groqClient: Groq | null = null;

if (API_KEY) {
    groqClient = new Groq({
        apiKey: API_KEY,
    });
    console.log("✅ Groq AI connected successfully");
}

export const getGroqClient = () => {
    if (!groqClient) {
        throw new Error("Groq API Key is missing. Please set GROQ_API_KEY in .env");
    }
    return groqClient;
};

// Model configuration
export const GROQ_CONFIG = {
    model: "llama-3.1-8b-instant", // Free-tier friendly, fast model
    temperature: 0.6,
    max_tokens: 512,
};
