import { SeminarReminder } from "lib/email/templates/SeminarReminder";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.EMAIL_SEND;
const emailsRaw = process.env.SEMINAR_EMAILS;
const seminarLink = process.env.SEMINAR_LINK;

main().catch((e) => {
    console.error(e.stack);
    process.exit(1);
});

async function main() {
    await sendEmails();
}

async function sendEmails() {
    if (!senderEmail) {
        console.error("❌ No sender email found in process.env");
        process.exit(1);
    }
    if (!emailsRaw) {
        console.error("Missing emails");
        process.exit(1);
    }
    if (!seminarLink) {
        console.error("Missing seminar link");
        process.exit(1);
    }

    const year = 2025;
    const month = 3; // indexed from 0
    const day = 27;
    const hour = 18;
    const minutes = 0;

    const scheduledAt = new Date(
        Date.UTC(year, month, day, hour, minutes, 0)
    ).toISOString();

    console.info("Scheduling for", scheduledAt);

    try {
        const emails = emailsRaw.split(",");
        if (emails.length === 0) {
            console.error("Emails empty");
            process.exit(1);
        }

        const subject = "Symposia Seminar Reminder 🔔";

        for (const email of emails) {
            const res = await resend.emails.send({
                from: `sPhil Symposia Seminars 🏺 <${senderEmail}>`,
                to: email,
                subject,
                react: <SeminarReminder seminarLink={seminarLink} />,
                scheduledAt,
            });

            if (res.error) {
                console.error(res.error.message);
            } else {
                console.info(`Scheduled email to: ${email}`);
            }
        }
    } catch (error) {
        console.error("Error sending emails:", error);
    }
}
