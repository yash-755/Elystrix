import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    try {
        const stripe = getStripe();
        if (!stripe) {
            return new NextResponse("Stripe configuration missing", { status: 503 });
        }

        const body = await req.json();
        const { planId, userId, userEmail, returnUrl } = body;

        if (!planId || !userId || !userEmail) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // 1. Fetch Pricing from Firestore (Admin Controlled)
        // Replaced file-based getPlans with Prisma DB call
        const plans = await prisma.plan.findMany();
        const selectedPlan = plans.find((p) => p.id === planId || p.key === planId || p.name.toLowerCase() === planId.toLowerCase());

        if (!selectedPlan) {
            return new NextResponse("Invalid Plan ID", { status: 400 });
        }

        // 2. Validate Price
        // Ensure we have a valid positive price.
        if (selectedPlan.sellingPrice <= 0) {
            return new NextResponse("Cannot checkout a free plan via Stripe", { status: 400 });
        }

        // 3. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr", // Assuming INR based on context
                        product_data: {
                            name: `${selectedPlan.name} Plan`,
                            description: selectedPlan.description,
                            metadata: {
                                planId: selectedPlan.id,
                            }
                        },
                        unit_amount: selectedPlan.sellingPrice * 100, // Stripe expects paise/cents
                        recurring: {
                            interval: "month", // Hardcoded for now, could be dynamic from plan.period
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: userId,
                planId: selectedPlan.id,
            },
            customer_email: userEmail,
            success_url: `${returnUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?payment=cancelled`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
