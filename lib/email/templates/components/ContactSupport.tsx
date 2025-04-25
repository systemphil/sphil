import { Section } from "@react-email/components";

export function ContactSupport() {
    return (
        <Section>
            <p className="text-gray-500 my-4 text-center">
                If there are any issues, please contact{" "}
                <a
                    href="mailto:support@systemphil.com"
                    className="text-gray-600 underline hover:text-blue-700"
                >
                    support@systemphil.com
                </a>
                .
            </p>
        </Section>
    );
}
