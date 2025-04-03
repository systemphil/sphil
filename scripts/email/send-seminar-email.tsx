import { Resend } from "resend";
import { SeminarsSLQB1 } from "lib/components/email/SeminarsSLQB1";

const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.EMAIL_SEND;
const emailsRaw = process.env.SEMINAR_EMAILS;

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
    if (!emailsRaw) {
        console.error("Missing emails");
        process.exit(1);
    }
    try {
        const emails = emailsRaw.split(",");

        const subject = "The Quality of Being (Part 1): First Week 🏛️";

        for (const email of emails) {
            await resend.emails.send({
                from: `sPhil Symposia Seminars 🏺 <${senderEmail}>`,
                to: email,
                subject,
                react: <SeminarsSLQB1 />,
            });

            console.info(`Email sent to: ${email}`);
        }
    } catch (error) {
        console.error("Error sending emails:", error);
    }
}
