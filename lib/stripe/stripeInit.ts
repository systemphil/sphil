import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_API_KEY ?? "";

export const stripe = new Stripe(stripeApiKey, {
    apiVersion: "2024-09-30.acacia",
    typescript: true,
});
