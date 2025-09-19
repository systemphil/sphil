import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_API_KEY ?? "";

export function getStripe() {
    if (!stripeApiKey) {
        throw new Error("Stripe API key missing");
    }
    return new Stripe(stripeApiKey, {
        apiVersion: "2025-08-27.basil",
        typescript: true,
    });
}
