import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_API_KEY ?? "";

export function getStripe() {
    if (!stripeApiKey) {
        throw new Error("Stripe API key missing");
    }
    return new Stripe(stripeApiKey, {
        apiVersion: "2024-09-30.acacia",
        typescript: true,
    });
}
