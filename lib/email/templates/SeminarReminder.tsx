import { Link, Section } from "@react-email/components";
import { EmailBaseLayout } from "./components/EmailBaseLayout";

export function SeminarReminder({ seminarLink }: { seminarLink: string }) {
    const preview = "Seminar in 1 hour";

    return (
        <EmailBaseLayout preview={preview}>
            <Section>
                <h1
                    className="text-2xl font-bold text-gray-900"
                    style={{ textAlign: "center" }}
                >
                    Seminar Reminder
                </h1>

                <p className="text-gray-600 my-4">
                    Reminder that the sPhil seminar starts in 1 hour. Join via
                    the link below
                </p>

                <ul className="text-gray-600 my-4">
                    <li>
                        📍 <Link href={seminarLink}>Zoom link</Link>
                    </li>
                </ul>
            </Section>
        </EmailBaseLayout>
    );
}

export default function Example() {
    return <SeminarReminder seminarLink="www.google.com" />;
}
