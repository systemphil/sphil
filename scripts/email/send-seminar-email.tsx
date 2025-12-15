import { SeminarsSLQB1 } from "lib/email/templates/SeminarsSLQB1";
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

    try {
        const emails = emailsRaw.split(",");
        if (emails.length === 0) {
            console.error("Emails empty");
            process.exit(1);
        }

        const subject = "The Quality of Being: Pt. 1 - Week One 🏛️";

        for (const email of emails) {
            const res = await resend.emails.send({
                from: `sPhil Courses Seminars 🏺 <${senderEmail}>`,
                to: email,
                subject,
                react: <SeminarsSLQB1 seminarLink={seminarLink} />,
            });

            if (res.error) {
                console.error(res.error.message);
            } else {
                console.info(`Email sent to: ${email}`);
            }
        }
    } catch (error) {
        console.error("Error sending emails:", error);
    }
}
