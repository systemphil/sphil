import { PrismaClient } from "@prisma/client";
import { Newsletter_20261011_PlatoGorgias_Email } from "lib/email/templates/Newsletter_20261011_PlatoGorgias";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.EMAIL_SEND;
const isDryRun = process.argv.includes("--dry-run");

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
        const subscribers = await getRecipients();
        if (isDryRun) {
            console.info(
                `🧪 Dry run: would send to ${subscribers.length} emails. Nothing written or sent.`
            );
            return;
        }
        // const subscribers = [
        //     {
        //         email: "service@systemphil.com",
        //         id: "test123",
        //     },
        // ];

        const subject = "Communiqué Scholasticus";

        for (const { email, id } of subscribers) {
            const res = await resend.emails.send({
                from: `sPhil Newsletter 🦉 <${senderEmail}>`,
                to: email,
                subject,
                react: (
                    <Newsletter_20261011_PlatoGorgias_Email
                        unsubscribeId={id}
                    />
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

const normalize = (email: string) => email.trim().toLowerCase();

/**
 * Merges newsletter subscribers with all registered users into a unique set of emails.
 * Users without a NewsletterEmail entry get one created so that their unsubscribe link
 * works. Entries marked as unsubscribed are always excluded.
 */
async function getRecipients(): Promise<{ email: string; id: string }[]> {
    const [newsletterEntries, users] = await Promise.all([
        prisma.newsletterEmail.findMany({
            select: { email: true, id: true, subscribed: true },
        }),
        prisma.user.findMany({ select: { email: true } }),
    ]);

    const knownEmails = new Set(newsletterEntries.map((n) => normalize(n.email)));
    const missingUserEmails = [
        ...new Map(
            users
                .filter((u) => u.email && !knownEmails.has(normalize(u.email)))
                .map((u) => [normalize(u.email), u.email.trim()])
        ).values(),
    ];

    console.info(
        `📋 ${newsletterEntries.length} newsletter entries, ${users.length} users, ${missingUserEmails.length} users not yet on the newsletter list`
    );

    let entries = newsletterEntries;
    if (missingUserEmails.length > 0) {
        if (isDryRun) {
            entries = [
                ...entries,
                ...missingUserEmails.map((email) => ({
                    email,
                    id: "dry-run",
                    subscribed: true,
                })),
            ];
        } else {
            await prisma.newsletterEmail.createMany({
                data: missingUserEmails.map((email) => ({ email })),
                skipDuplicates: true,
            });
            entries = await prisma.newsletterEmail.findMany({
                select: { email: true, id: true, subscribed: true },
            });
        }
    }

    const recipients = new Map<string, { email: string; id: string }>();
    const unsubscribed = new Set(
        entries.filter((e) => !e.subscribed).map((e) => normalize(e.email))
    );
    for (const { email, id } of entries) {
        const key = normalize(email);
        if (unsubscribed.has(key) || recipients.has(key)) continue;
        recipients.set(key, { email, id });
    }

    console.info(
        `🚫 Skipping ${unsubscribed.size} unsubscribed, ✉️ ${recipients.size} unique recipients`
    );
    return [...recipients.values()];
}
