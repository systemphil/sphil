import { Section } from "@react-email/components";

export function UnsubscribeNewsletter({
    unsubscribeId,
}: {
    unsubscribeId: string;
}) {
    return (
        <Section>
            <p className="text-gray-500 my-4 text-center">
                <a
                    href={`https://sphil.xyz/newsletter/unsubscribe/${unsubscribeId}`}
                    className="text-gray-600 underline hover:text-blue-700"
                >
                    Click here to unsubscribe
                </a>{" "}
                from this newsletter.
            </p>
        </Section>
    );
}
