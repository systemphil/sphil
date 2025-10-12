import { SubscribeToNewsletter } from "features/marketing/components/SubscribeToNewsletter";
import { Heading } from "lib/components/ui/Heading";
import { Paragraph } from "lib/components/ui/Paragraph";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import { ScreenWrapper } from "lib/components/ui/ScreenWrapper";
import { TITLE } from "lib/config/consts";
import { Metadata } from "next";

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
        <ScreenWrapper className="flex flex-col justify-start md:justify-center items-center pt-6">
            <MarkEmailUnreadOutlinedIcon fontSize="large" />
            <Heading>Newsletter</Heading>
            <Paragraph className="mb-6">
                Subscribe to our newsletter to stay up to date on new events.
            </Paragraph>
            <div className="max-w-[500px]">
                <SubscribeToNewsletter />
            </div>
        </ScreenWrapper>
    );
}
