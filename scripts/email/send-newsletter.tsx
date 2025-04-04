import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { NewsletterEnrollmentClosing } from "lib/components/email/NewsletterEnrollmentClosing";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.EMAIL_SEND;

main().catch((e) => {
    console.error(e.stack);
    process.exit(1);
});

async function main() {
    await sendNewsletter();
}

async function sendNewsletter() {
    if (!senderEmail) {
        console.error("❌ No sender email found in process.env");
        process.exit(1);
    }
    try {
        // TODO add ID for the unsubscribe link when that is implemented

        const subscribers = await prisma.newsletterEmail.findMany({
            select: { email: true },
        });

        const subject =
            "Enrollment is Closing: The Science of Logic is the Metaphysician's Purgatorio ⛰️";

        for (const { email } of subscribers) {
            await resend.emails.send({
                from: `sPhil Newsletter 🦉 <${senderEmail}>`,
                to: email,
                subject,
                react: <NewsletterEnrollmentClosing />,
            });

            console.log(`Email sent to: ${email}`);
        }
    } catch (error) {
        console.error("Error sending emails:", error);
    } finally {
        await prisma.$disconnect();
    }
}
