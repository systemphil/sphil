import type Stripe from "stripe";
import { getStripe } from "./stripeInit";
import { dbUpdateUserPurchases } from "lib/database/dbFuncs";
import { resend } from "lib/email/emailInit";
import { PurchaseReceiptEmail } from "lib/components/email/PurchaseReceipt";
import { PurchaseNotification } from "lib/components/email/PurchaseNotification";

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
    stripePriceId: string;
    unitPrice?: number;
    currency?: string;
}) {
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
    customerEmail,
}: StripeCreateCheckoutSessionProps) {
    const baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) throw new Error("NEXTAUTH_URL is not defined");

    const stripe = getStripe();
    const stripeSession = await stripe.checkout.sessions.create({
        customer_email: customerEmail,
        client_reference_id: userId,
        payment_method_types: ["card", "paypal"],
        mode: "payment",
        line_items: [purchase],
        /**
         * * Note: priceId is split for the success URL and then re-attached in the db query.
         */
        success_url: `${baseUrl}/purchase-success?p=${
            purchase.price.split("_")[1]
        }&s=${slug}`,
        cancel_url: `${baseUrl}/courses/${slug}?canceled=true`,
        metadata: {
            stripeCustomerId: customerId,
            userId: userId,
            purchase: purchase.price,
            courseId: courseId,
            /**
             * TODO fix fallback image
             */
            imageUrl:
                imageUrl ??
                "https://avatars.githubusercontent.com/u/147748257?s=200&v=4",
            name: name,
            description: description,
            courseLink: `${baseUrl}/courses/${slug}`,
        } satisfies StripeCheckoutSessionMetadata,
    });

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
    // TODO typescript isn't picking up the type here for some reason
    // @ts-expect-error
    return customer.email;
}

export async function handleSessionCompleted(
    event: Stripe.CheckoutSessionCompletedEvent
) {
    const sessionMetadata = event.data.object
        .metadata as StripeCheckoutSessionMetadata;
    if (event.data.object.payment_status !== "paid") {
        console.error(
            `❌ Payment status not paid for session ${event.data.object.id}`
        );
        return;
    }

    const updatedUser = await dbUpdateUserPurchases({
        userId: sessionMetadata.userId,
        courseId: sessionMetadata.courseId,
        purchasePriceId: sessionMetadata.purchase,
    });

    const customerEmail = event.data.object.customer_email;
    if (!customerEmail) {
        console.error(
            `❌ No customer email found in session metadata. Session id ${event.data.object.id}`
        );
        return updatedUser;
    }
    const senderEmail = process.env.EMAIL_SEND;
    if (!senderEmail) {
        console.error("❌ No sender email found in process.env");
        return updatedUser;
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

    await resend.emails.send({
        from: `No Reply <${senderEmail}>`,
        to: customerEmail,
        subject: `Order Confirmation - ${product.name}`,
        react: (
            <PurchaseReceiptEmail
                key={order.id}
                order={order}
                product={product}
                courseLink={sessionMetadata.courseLink}
            />
        ),
    });

    const receiverEmail = process.env.EMAIL_RECEIVE;
    if (receiverEmail) {
        await resend.emails.send({
            from: `No Reply <${senderEmail}>`,
            to: receiverEmail,
            subject: `New Purchase $${order.pricePaidInCents / 100} - ${
                product.name
            } - ${updatedUser.email}`,
            react: (
                <PurchaseNotification
                    user={updatedUser}
                    key={order.id}
                    order={order}
                    product={product}
                    courseLink={sessionMetadata.courseLink}
                />
            ),
        });
    } else {
        console.error("❌ No receiver email found in process.env");
    }

    return updatedUser;
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
