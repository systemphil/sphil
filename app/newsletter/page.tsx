import { ScreenWrapper } from "lib/components/ui/ScreenWrapper";
import { TITLE } from "lib/config/consts";
import { Metadata } from "next";
import { NewsletterBrowser } from "lib/email/templates/components/NewsletterBrowser";

const title = `${TITLE} - Newsletter`;
const description =
    "Guided studies of the world's foundational philosophical and literary texts designed for close reading and lasting understanding. Sign up for the newsletter.";

export const metadata: Metadata = {
    title,
    description,
    openGraph: {
        title,
        description,
        type: "website",
        url: "https://sphil.xyz/courses",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
    },
};

export default function NewsletterPage() {
    return (
        <ScreenWrapper className="flex flex-col justify-start md:justify-center items-center py-6">
            <NewsletterBrowser />
        </ScreenWrapper>
    );
}
