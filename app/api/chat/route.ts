import { NextResponse } from "next/server"
import { getGroqClient, GROQ_CONFIG } from "@/lib/ai/groq"

export async function POST(req: Request) {
    try {
        const { message } = await req.json()

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }

        // System prompt for Elystrix platform
        const systemPrompt = `You are the Elystrix Platform Assistant. YOUR GOAL is to help users navigate the Elystrix EdTech platform, find courses, and understand learning paths.

CONTEXT:
- Elystrix is an online learning platform for developers.
- Features: Video courses, Interactive Quizzes, Learning Paths (Roadmaps), Certificates, Subscription Plans (Pro).
- Tone: Professional, encouraging, helpful, concise.

INSTRUCTIONS:
- Answer questions specifically about Elystrix, coding education, or platform features.
- If asked about "pricing" or "subscription", explain the Pro plan.
- If asked about "certificates", explain that they are awarded after completing courses/paths.
- If the user asks something unrelated (e.g., "Write a poem"), politely steer them back to learning or coding.
- Keep responses short (under 3 paragraphs).`

        // Get Groq client
        const groq = getGroqClient()

        // Create chat completion with Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            model: GROQ_CONFIG.model,
            temperature: GROQ_CONFIG.temperature,
            max_tokens: GROQ_CONFIG.max_tokens,
        })

        const reply = chatCompletion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again."

        return NextResponse.json({ reply })

    } catch (error: any) {
        console.error("Chat API Error:", error)

        // Handle rate limits and API errors gracefully
        if (error.status === 429 || error.message?.includes("rate limit")) {
            return NextResponse.json(
                { reply: "AI is temporarily unavailable. Please try again." },
                { status: 200 }
            )
        }

        return NextResponse.json(
            { reply: "AI is temporarily unavailable. Please try again." },
            { status: 200 }
        )
    }
}
