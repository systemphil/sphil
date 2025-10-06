import { Section } from "@react-email/components";
import { EmailBaseLayout } from "./components/EmailBaseLayout";

export function NewsletterCourseAnnouncement() {
    const preview = `A Philosophical Pilgrimage Awaits`;

    return (
        <EmailBaseLayout preview={preview} isSupport={false}>
            <Section>
                <h1
                    className="text-2xl font-bold text-gray-900"
                    style={{ textAlign: "center" }}
                >
                    A Philosophical Pilgrimage Awaits
                </h1>

                <p className="text-gray-500 my-4">
                    We&apos;ve been hard at work crafting this course, and
                    we&apos;re truly excited to share it with you. This is a
                    deep dive into one of the most profound works in philosophy,
                    and we couldn&apos;t be happier with what we have put
                    together. So without further ado:
                </p>
                <p className="text-gray-500 my-4">
                    <strong>
                        Enrollment is now open for The Quality of Being
                    </strong>{" "}
                    (part 1)—an in-depth course designed to guide you through
                    one of the most profound works in philosophy—Hegel&apos;s{" "}
                    <i>Science of Logic </i>. Over twelve weeks, you will
                    explore Hegel&apos;s dialectical method, uncover the
                    foundations of logic, metaphysics, epistemology and
                    ontology, and engage in rigorous discussions that will
                    challenge and expand your understanding of thought and
                    reality itself.
                </p>
                <p className="text-gray-500 my-4">
                    We will be examining closely Hegel&apos;s method of
                    presuppositionless thinking and interrogate the development
                    of the categories (or foundational ontological concepts)
                    like being, nothing, becoming, existence, quality,
                    something, other, being-for-other, being-in-itself,
                    determination, constitution and limit and every little
                    nuance between. Truly, we will mentally wrestle with the
                    philosopher!
                </p>
                <ul className="text-gray-500 my-4">
                    <li>📅 First seminar: April 6</li>
                    <li>📍 Where: Online via Zoom</li>
                    <li>
                        🧑‍🏫 Instructor: Filip Niklas (assisted by Ahilleas Rokni)
                    </li>
                </ul>
                <p className="text-gray-500 my-4">
                    Choose the level of engagement that suits you: from
                    self-study with pre-recorded lectures to interactive live
                    seminars and private one-on-one sessions.
                </p>

                <p className="text-gray-500 my-4">
                    <strong>Guest Lecture by Professor Stephen Houlgate</strong>{" "}
                    – a world-renowned Hegel scholar. We&apos;re honored to
                    welcome Prof. Houlgate to our final seminar, where he will
                    share his profound insights into Hegel&apos;s philosophy.
                    With decades of scholarship and a deep understanding of the{" "}
                    <em>Science of Logic</em>, he will guide us through some of
                    its most challenging yet rewarding concepts. This is a rare
                    opportunity to engage with one of the leading thinkers in
                    Hegel studies—don&apos;t miss it!
                </p>

                <p className="text-gray-500 my-4">
                    <a
                        href="https://sphil.xyz/courses/science-of-logic-the-quality-of-being-part-1"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-blue-400 underline"
                    >
                        Enroll now
                    </a>
                    &nbsp;to secure your place and join a community of deep
                    thinkers.
                </p>

                <p className="text-gray-500 my-4">
                    Spots are limited—don&apos;t miss this opportunity to engage
                    with Hegel&apos;s Science of Logic in a structured and
                    transformative way!
                </p>

                <p className="text-gray-500 my-4">Yours Sincerely,</p>

                <p className="text-gray-500 my-4">
                    Filip Niklas and Ahilleas Rokni
                </p>
            </Section>
        </EmailBaseLayout>
    );
}

export default function Example() {
    return <NewsletterCourseAnnouncement />;
}
