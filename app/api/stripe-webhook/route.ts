import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "lib/stripe/stripeInit";
import { handleSessionCompleted } from "lib/stripe/stripeFuncs";

export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export async function POST(req: NextRequest) {
    const stripe = getStripe();
    const event = await stripe.webhooks.constructEvent(
        await req.text(),
        req.headers.get("stripe-signature") as string,
        webhookSecret as string
    );

    // Handle the event
    switch (event.type) {
        case "charge.succeeded":
            break;
        case "checkout.session.completed":
            await handleSessionCompleted(event);
            break;
        case "payment_intent.created":
            break;
        case "payment_intent.succeeded":
            break;
        case "payment_intent.requires_action":
            break;
        case "product.updated":
            console.info("ℹ️  Product updated event received");
            break;
        case "product.created":
            break;
        default:
            if (process.env.NODE_ENV === "development") {
                console.info(`ℹ️ Unhandled event type: ${event.type}`);
            }
        // Unexpected event type
    }

    // Record the event in the database (unless development mode)
    // All details are recorded on Stripe so this is superfluous for our purposes.
    // if (process.env.NODE_ENV !== "development") {
    //     await dbCreateStripeEventRecord(event);
    // }

    return new NextResponse();
}
