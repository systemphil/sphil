import { AboutUs } from "features/marketing/components/AboutUs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | sPhil",
    description:
        "Learn about sPhil's mission to make profound philosophical education accessible. Meet our team of scholars dedicated to guiding you through the world's greatest texts.",
    openGraph: {
        title: "About Us | sPhil",
        description:
            "Scholars united by a love for the great texts and a commitment to making profound philosophy accessible to all.",
        type: "website",
    },
};

export default function AboutUsPage() {
    return <AboutUs />;
}
