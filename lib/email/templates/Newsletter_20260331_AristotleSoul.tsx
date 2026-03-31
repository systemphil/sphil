import { Section } from "@react-email/components";
import { EmailBaseLayout } from "./components/EmailBaseLayout";
import { NewsletterWebLayout } from "./components/NewsLetterWebLayout";
import { UnsubscribeNewsletter } from "./components/UnsubscribeNewsletter";
import { EmailA, EmailH1, EmailP } from "./components/EmailHtml";
import { VideoLink } from "./components/VideoLink";

const preview = `The Soul of Aristotle`;

function Content() {
    return (
        <Section>
            <EmailH1>{preview}</EmailH1>

            <EmailP>
                Dear friends of the Logos, we are pleased inform you about our
                course titled <i>The Soul of Aristotle: From Life to Logic</i>.
            </EmailP>

            <EmailP>
                Our course is{" "}
                <EmailA href="https://sphil.xyz/courses/aristotle-soul">
                    open for enrollment
                </EmailA>
                ! We are offering a live seminar course reading Aristotle's{" "}
                <i>On the Soul</i> — one of the most important and, perhaps,
                misunderstood works in the history of philosophy. Across seven
                lectures, we will work through the text from the ground up,
                beginning with the questions that drove Aristotle to write it:
                What is the soul? How does it relate to the body? How does
                perceiving become thinking? These are not dusty museum-piece
                questions, but existential concerns; they sit at the center of
                every contemporary debate about consciousness, animal cognition,
                and whether a machine could ever truly think. Aristotle's answer
                cuts past the tired standoff between materialism and dualism,
                offering a genuinely different framework that modern philosophy
                has largely forgotten.
            </EmailP>

            <EmailP>
                The course follows the arc of <i>On the Soul</i> itself — from
                nutrition and growth through the five senses to imagination,
                intellect and desire — showing how each layer of the soul builds
                on the one before it. We will follow the text closely, paying
                attention to key Greek terminology, and see how Aristotle's
                careful distinctions dissolve problems that still paralyze us
                today. No prior background in philosophy or Greek is required —
                just a willingness to slow down and think carefully about what
                it means to be alive. Enrollment is open, with live sessions
                beginning in April 15th.
            </EmailP>

            <VideoLink
                text="View the course announcement video here"
                ytUrl="https://youtu.be/2QKvsZ8fh8E?si=C0DB_N2lezxt7izG"
            />

            <EmailP>
                The first four lectures (1hr15mins+ each) are ready, with the
                remainder soon to follow over the next several weeks. The
                seminar tier will offer <b>15 live online seminars</b> via Zoom,
                7x facilitated by Filip Niklas and 7x facilitated by Max Macken,
                ending with the pro-seminar. We ran two seminar facilitators at
                the Hegel course last year and students really enjoyed getting
                two different teaching styles and perspectives, not to mention
                extra discussion time. Get ready for a quite the ride!
            </EmailP>

            <EmailP>Yours Sincerely,</EmailP>

            <EmailP>Filip Niklas and Max Macken</EmailP>
        </Section>
    );
}

export function Newsletter_20260331_AristotleSoul_Email({
    unsubscribeId,
}: {
    unsubscribeId: string;
}) {
    return (
        <EmailBaseLayout preview={preview} isSupport={false}>
            <Content />
            <UnsubscribeNewsletter unsubscribeId={unsubscribeId} />
        </EmailBaseLayout>
    );
}

export function Newsletter_20260331_AristotleSoul_Web() {
    return (
        <NewsletterWebLayout>
            <Content />
        </NewsletterWebLayout>
    );
}

export default function Example() {
    return <Newsletter_20260331_AristotleSoul_Email unsubscribeId="123" />;
}
