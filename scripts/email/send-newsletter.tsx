import { PrismaClient } from "@prisma/client";
import { Newsletter_20251201_sPhil2026_Email } from "lib/email/templates/Newsletter_20251201_sPhil2026";
import { Resend } from "resend";

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
        const subscribers = await prisma.newsletterEmail.findMany({
            select: { email: true, id: true },
        });
        // const subscribers = [
        //     {
        //         email: "service@systemphil.com",
        //         id: "test123",
        //     },
        // ];

        const subject = "Courses coming out next year!";

        for (const { email, id } of subscribers) {
            const res = await resend.emails.send({
                from: `sPhil Newsletter 🦉 <${senderEmail}>`,
                to: email,
                subject,
                react: (
                    <Newsletter_20251201_sPhil2026_Email unsubscribeId={id} />
                ),
            });

            if (res.error) {
                console.error(res.error.message);
            } else {
                console.info(`Email sent to: ${email}`);
            }
        }
        console.info(`Sent ${subscribers.length} emails`);
    } catch (error) {
        console.error("Error sending emails:", error);
    } finally {
        await prisma.$disconnect();
    }
}
