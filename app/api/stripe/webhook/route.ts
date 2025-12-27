import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;
    const stripe = getStripe();

    if (!stripe) {
        console.error("Stripe is not initialized (missing keys)");
        return new NextResponse("Service Unavailable - Stripe not configured", { status: 503 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error("STRIPE_WEBHOOK_SECRET is missing");
        return new NextResponse("Service Unavailable - Webhook secret missing", { status: 503 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        console.error("Webhook signature verification failed:", error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === "checkout.session.completed") {
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (userId && planId) {
            try {
                // Update User in Prisma (MongoDB)
                // Note: We search by userId (likely Firebase UID passed in metadata)
                const firebaseUid = userId;

                await prisma.user.update({
                    where: { firebaseUid: firebaseUid },
                    data: {
                        plan: planId,
                        subscriptionStatus: 'active',
                        stripeCustomerId: session.customer as string,
                        stripeSubscriptionId: session.subscription as string,
                    }
                });

                console.log(`Successfully updated user ${userId} to plan ${planId}`);
            } catch (error) {
                console.error("Error updating user in MongoDB:", error);
                return new NextResponse("Database update failed", { status: 500 });
            }
        }
    }

    if (event.type === "invoice.payment_succeeded") {
        // Handle recurring payments if needed
        // const subscriptionId = session.subscription;
    }

    return new NextResponse(null, { status: 200 });
}
