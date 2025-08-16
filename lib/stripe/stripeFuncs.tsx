import type Stripe from "stripe";
import { getStripe } from "./stripeInit";
import {
    dbEnrollUserInSeminarCohort,
    dbCreateCoursePurchase,
} from "lib/database/dbFuncs";
import { PriceTier } from "lib/server/ctrl";
import { STRIPE_FALLBACKS } from "lib/config/stripeFallbacks";
import { EmailService } from "lib/email/EmailService";

type StripeCreateProductProps = {
    name: string;
    description?: string;
    imageUrl?: string | null; // images cannot be nullified, only replaced
};

export async function stripeCreateProduct({
    name,
    description,
    imageUrl,
}: StripeCreateProductProps) {
    const stripe = getStripe();
    const product = await stripe.products.create({
        name: name,
        description: description ?? undefined,
        images: imageUrl ? [imageUrl] : undefined,
    });
    return product;
}

type StripeUpdateProductProps = {
    stripeProductId: string;
    name?: string;
    description?: string;
    imageUrl?: string | null; // images cannot be nullified, only replaced
};

export async function stripeUpdateProduct({
    stripeProductId,
    name,
    description,
    imageUrl,
}: StripeUpdateProductProps) {
    const stripe = getStripe();
    const product = await stripe.products.update(stripeProductId, {
        name: name ?? undefined,
        description: description ?? undefined,
        images: imageUrl ? [imageUrl] : undefined,
    });
    return product;
}

export async function stripeArchiveProduct({
    stripeProductId,
}: {
    stripeProductId: string;
}) {
    const stripe = getStripe();
    const product = await stripe.products.update(stripeProductId, {
        active: false,
    });
    return product;
}

interface StripeCreatePriceProps {
    stripeProductId: string;
    unitPrice: number;
    currency?: string;
}

export async function stripeCreatePrice({
    stripeProductId,
    unitPrice,
    currency = "usd",
}: StripeCreatePriceProps) {
    const stripe = getStripe();
    const price = await stripe.prices.create({
        unit_amount: unitPrice,
        currency: currency,
        product: stripeProductId,
    });
    return price;
}

export async function stripeRetrievePrice({
    stripePriceId,
}: {
    stripePriceId: string;
}) {
    const stripe = getStripe();
    const price = await stripe.prices.retrieve(stripePriceId);
    return price;
}

export async function stripeArchivePrice({
    stripePriceId,
}: {
    stripePriceId: string | undefined;
    unitPrice?: number;
    currency?: string;
}) {
    if (!stripePriceId) {
        return;
    }
    const stripe = getStripe();
    const price = await stripe.prices.update(stripePriceId, {
        active: false,
    });
    return price;
}

export async function stripeDeleteProduct({
    stripeProductId,
}: {
    stripeProductId: string;
}) {
    const stripe = getStripe();
    const product = await stripe.products.del(stripeProductId);
    return product;
}

type StripeCreateCheckoutSessionProps = {
    customerId: string;
    userId: string;
    purchase: {
        price: string;
        quantity: number;
        adjustable_quantity: {
            enabled: boolean;
        };
    };
    slug: string;
    courseId: string;
    imageUrl: string | null | undefined;
    name: string;
    description: string;
    priceTier: PriceTier;
    customerEmail: string;
};

export type StripeCheckoutSessionMetadata = {
    userId: string;
    purchase: string;
    courseId: string;
    imageUrl: string;
    name: string;
    description: string;
    courseLink: string;
    stripeCustomerId: string;
    priceTier: PriceTier;
    customerEmail: string;
};

export async function stripeCreateCheckoutSession({
    customerId,
    userId,
    purchase,
    slug,
    courseId,
    imageUrl,
    name,
    description,
    priceTier,
    customerEmail,
}: StripeCreateCheckoutSessionProps) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_ROOT;
    if (!baseUrl) throw new Error("Base URL is not defined");

    const stripe = getStripe();

    const params = {
        customer: customerId,
        client_reference_id: userId,
        payment_method_types: ["card", "link"],
        mode: "payment",
        line_items: [purchase],
        /**
         * * Note: priceId is split for the success URL and then re-attached in the db query.
         */
        success_url: `${baseUrl}/purchase-success?p=${
            purchase.price.split("_")[1]
        }&s=${slug}`,
        cancel_url: `${baseUrl}/symposia/courses/${slug}?canceled=true`,
        allow_promotion_codes: true,
        metadata: {
            stripeCustomerId: customerId,
            userId: userId,
            purchase: purchase.price,
            courseId: courseId,
            imageUrl: imageUrl ?? STRIPE_FALLBACKS.imageUrl,
            name: name,
            description: description,
            courseLink: `${baseUrl}/symposia/courses/${slug}`,
            priceTier,
            customerEmail,
        },
    } satisfies Stripe.Checkout.SessionCreateParams & {
        metadata: StripeCheckoutSessionMetadata;
    };

    const stripeSession = await stripe.checkout.sessions.create(params);

    if (!stripeSession) {
        throw new Error("Could not create checkout session");
    }

    return { url: stripeSession.url };
}

export async function stripeCreateCustomer({
    email,
    userId,
    name = undefined,
}: {
    email: string;
    userId: string;
    name?: string;
}) {
    const stripe = getStripe();
    const customer = await stripe.customers.create({
        name: name,
        email: email,
        metadata: {
            userId: userId,
        },
    });
    return customer;
}

export async function stripeGetCustomerEmail({
    customerId,
}: {
    customerId: string;
}) {
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(customerId);
    // FIXME typescript isn't picking up the type here because we must narrow it down first
    // @ts-expect-error
    return customer.email;
}

export type Product = {
    name: string;
    imagePath: string;
    description: string;
};

export type Order = {
    id: string;
    createdAt: Date;
    pricePaidInCents: number;
};

export async function handleSessionCompleted(
    event: Stripe.CheckoutSessionCompletedEvent
) {
    const sessionMetadata = event.data.object
        .metadata as StripeCheckoutSessionMetadata;
    if (event.data.object.payment_status !== "paid") {
        console.info(
            `⏹️ Payment status not paid for session ${event.data.object.id}`
        );
        return;
    }

    await dbCreateCoursePurchase({
        userId: sessionMetadata.userId,
        courseId: sessionMetadata.courseId,
    });

    const customerEmail = sessionMetadata.customerEmail;
    if (!customerEmail) {
        const message = `❌ No customer email found in session metadata. Session id ${event.data.object.id}`;
        console.error(message);
        void EmailService.adminAlert({ message });
        return;
    }

    const order = {
        id: event.data.object.id,
        createdAt: new Date(event.data.object.created * 1000),
        pricePaidInCents: event.data.object.amount_total ?? 0,
    };

    const product = {
        name: sessionMetadata.name,
        imagePath: sessionMetadata.imageUrl,
        description: sessionMetadata.description,
    };

    await EmailService.sendPurchaseReceiptEmail({
        sessionMetadata,
        order,
        customerEmail,
        product,
    });

    if (
        sessionMetadata.priceTier === "seminar" ||
        sessionMetadata.priceTier === "dialogue"
    ) {
        await EmailService.sendSeminarEmail({
            sessionMetadata,
            customerEmail,
            product,
        });

        await dbEnrollUserInSeminarCohort({
            courseId: sessionMetadata.courseId,
            userId: sessionMetadata.userId,
        });
    }

    await EmailService.adminSendPurchaseNotification({
        courseLink: sessionMetadata.courseLink,
        order,
        product,
        userId: sessionMetadata.userId,
    });

    return;
}

// interface CreateStripeRefundProps {
//     paymentIntentId: string,
//     stripe: Stripe
// }
// export async function createStripeRefund ({ paymentIntentId, stripe }: CreateStripeRefundProps) {
//     try {
//         const refund = await stripe.refunds.create({
//             payment_intent: paymentIntentId
//         });
//         return refund;
//     } catch(err) {
//         if (err instanceof Error) return err.message;
//     }
// }
