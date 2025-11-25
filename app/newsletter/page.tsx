import { TITLE } from "lib/config/consts";
import { Metadata } from "next";
import { NEWSLETTERS } from "lib/email/data/newsletters";
import { redirect } from "next/navigation";

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
        url: "https://sphil.xyz/newsletter",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
    },
};

export default function NewsletterIndexPage() {
    if (NEWSLETTERS.length > 0) {
        redirect(`/newsletter/${NEWSLETTERS[0].id}`);
    }

    return (
        <div className="h-full flex items-center justify-center text-gray-500">
            <p>No newsletters available.</p>
        </div>
    );
}
