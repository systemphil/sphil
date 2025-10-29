import "server-only";
import { dbGetUserData } from "lib/database/dbFuncs";
import { resend } from "./emailInit";
import { EmailPurchaseAdminNotification } from "./templates/EmailPurchaseNotification";
import {
    Order,
    Product,
    StripeCheckoutSessionMetadata,
} from "lib/stripe/stripeFuncs";
import { EmailSeminarNotification } from "./templates/EmailSeminarNotification";
import { EmailPurchaseReceipt } from "./templates/EmailPurchaseReceipt";

export class EmailService {
    private static resend = resend;

    private static getAdminEmail(): string {
        const email = process.env.EMAIL_RECEIVE;
        if (!email) {
            throw new Error("EMAIL_RECEIVE environment variable is not set");
        }
        return email;
    }

    private static getSenderEmail(): string {
        const email = process.env.EMAIL_SEND;
        if (!email) {
            throw new Error("EMAIL_SEND environment variable is not set");
        }
        return email;
    }

    public static async adminAlert({ message }: { message: string }) {
        await this.resend.emails.send({
            from: `No Reply <${this.getSenderEmail()}>`,
            to: this.getAdminEmail(),
            subject: `🚨 sPhil Server Error`,
            text: message,
            html: `<div><pre>${message}</pre><br /><br />Timestamp: ${new Date().toLocaleDateString()}</div>`,
        });
    }

    public static async sendSeminarEmail({
        sessionMetadata,
        customerEmail,
        product,
    }: {
        sessionMetadata: StripeCheckoutSessionMetadata;
        customerEmail: string;
        product: Product;
    }) {
        try {
            await this.resend.emails.send({
                from: `No Reply <${this.getSenderEmail()}>`,
                to: customerEmail,
                subject: `Seminar Information - ${product.name}`,
                react: (
                    <EmailSeminarNotification
                        courseLink={sessionMetadata.courseLink}
                        product={product}
                    />
                ),
            });
        } catch (e) {
            await this.adminAlert({
                message: JSON.stringify(e, null, 2),
            });
        }
    }

    public static async sendPurchaseReceiptEmail({
        sessionMetadata,
        customerEmail,
        order,
        product,
    }: {
        sessionMetadata: StripeCheckoutSessionMetadata;
        customerEmail: string;
        order: Order;
        product: Product;
    }) {
        try {
            await this.resend.emails.send({
                from: `No Reply <${this.getSenderEmail()}>`,
                to: customerEmail,
                subject: `Order Confirmation - ${product.name}`,
                react: (
                    <EmailPurchaseReceipt
                        key={order.id}
                        order={order}
                        product={product}
                        courseLink={sessionMetadata.courseLink}
                    />
                ),
            });
        } catch (e) {
            await this.adminAlert({
                message: JSON.stringify(e, null, 2),
            });
        }
    }

    public static async adminSendPurchaseNotification({
        userId,
        product,
        order,
        courseLink,
    }: {
        product: Product;
        order: Order;
        userId: string;
        courseLink: string;
    }) {
        const user = await dbGetUserData(userId);

        if (!user) {
            await this.adminAlert({
                message:
                    "Failed to get user during adminSendPurchaseNotification",
            });
            return;
        }

        await this.resend.emails.send({
            from: `No Reply <${this.getSenderEmail()}>`,
            to: this.getAdminEmail(),
            subject: `New Purchase $${order.pricePaidInCents / 100} - ${
                product.name
            } - ${user.email}`,
            react: (
                <EmailPurchaseAdminNotification
                    user={user}
                    key={order.id}
                    order={order}
                    product={product}
                    courseLink={courseLink}
                />
            ),
        });
    }
}
