import { Paragraph } from "lib/components/ui/Paragraph";
import { ScreenWrapper } from "lib/components/ui/ScreenWrapper";
import { dbUnsubscribeNewsletterEmailIfExists } from "lib/database/dbFuncs";
import Link from "next/link";
import { z } from "zod";

export default async function NewsletterDeletePage({
    params,
}: {
    params: Promise<{ newsletterId: string }>;
}) {
    const { newsletterId } = await params;

    await unsubscribeNewsletter(newsletterId);

    return (
        <ScreenWrapper className="flex flex-col justify-start md:justify-center items-center pt-6">
            <Paragraph>
                Your email should be removed from the newsletter list
            </Paragraph>
            <Link href="/newsletter" className="hover:underline">
                Click here to re-subscribe
            </Link>
        </ScreenWrapper>
    );
}

async function unsubscribeNewsletter(id: string) {
    try {
        const validatedId = z.string().parse(id);
        await dbUnsubscribeNewsletterEmailIfExists({ id: validatedId });
        console.info("Email unsubscribed from newsletter");
    } catch (e) {
        console.error("Failed to unsubscribe newsletter email", e);
    }
}
