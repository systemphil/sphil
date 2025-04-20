import { Link, Section } from "@react-email/components";
import { EmailBaseLayout } from "./components/EmailBaseLayout";

export function SeminarsSLQB1({ seminarLink }: { seminarLink: string }) {
    const preview = "Seminar Information";

    return (
        <EmailBaseLayout preview={preview}>
            <Section>
                <h1
                    className="text-2xl font-bold text-gray-900"
                    style={{ textAlign: "center" }}
                >
                    The Metaphysician&apos;s Purgatorio
                </h1>

                <p className="text-gray-600 my-4">
                    Thank you for enrolling in the seminar for the Quality of
                    Being course! Our first seminar is right around the corner
                    and below is some practical information.
                </p>

                <ul className="text-gray-600 my-4">
                    <li>📅 First seminar: April 6, 21:00 CEST/12:00 PM PST</li>
                    <li>
                        📍 Where: <Link href={seminarLink}>Zoom link</Link>
                    </li>
                    <li>
                        📖 What to prepare: Be sure to have watched the first
                        lecture and done the required reading. Try think
                        carefully about the questions and be sure to write down
                        your own and bring them to the seminar!
                    </li>
                </ul>

                <p className="text-gray-600 my-4">
                    Looking forward to meeting you all!
                </p>

                <p className="text-gray-600 my-4">Yours Sincerely,</p>

                <p className="text-gray-600 my-4">
                    Filip Niklas and Ahilleas Rokni
                </p>
            </Section>
        </EmailBaseLayout>
    );
}

export default function ExampleSeminars() {
    return <SeminarsSLQB1 seminarLink="www.google.com" />;
}
