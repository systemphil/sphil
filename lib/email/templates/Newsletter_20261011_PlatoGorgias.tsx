import { Section } from "react-email";
import { EmailBaseLayout } from "./components/EmailBaseLayout";
import { NewsletterWebLayout } from "./components/NewsLetterWebLayout";
import { UnsubscribeNewsletter } from "./components/UnsubscribeNewsletter";
import { EmailA, EmailH1, EmailP, EmailUl } from "./components/EmailHtml";
import { VideoLink } from "./components/VideoLink";

const preview = `Plato's Gorgias`;

function Content() {
    return (
        <Section>
            <EmailH1>{preview}</EmailH1>

            <EmailP>
                Dear friends of the Logos, we are pleased to announce our new
                course on Plato's <i>Gorgias</i>.
            </EmailP>

            <EmailP>
                The <i>Gorgias</i> is one of Plato's most dramatic inquiries,
                and it begins with a deceptively simple question: what is
                rhetoric? Gorgias, the most celebrated orator of his day,
                promises that the art of persuasion is the greatest good there
                is — the power to rule others in the assembly and the courts.
                Socrates is not so sure. Can rhetoric truly confer power, or
                does it only flatter? What is it we actually want when we
                desire power and pleasure? These are hardly antiquarian
                questions. In an age of persuasion engineered at scale, the
                dialogue reads less like a museum piece and more like a
                diagnosis.
            </EmailP>

            <VideoLink
                text="View the course announcement video here"
                ytUrl="https://youtu.be/e4w5MaV9ZjU?si=mynq8lH7vPi5BXH9"
            />

            <EmailP>
                The course follows the dialogue as Socrates faces three
                increasingly formidable interlocutors — Gorgias, Polus and
                Callicles — and as the stakes rise from the nature of rhetoric
                to the nature and structure of desire, the priority of justice
                over pleasure and power, the care of the soul, and the
                notorious claim that it is better to suffer injustice than to
                commit it. Across six lectures we will work through:
            </EmailP>

            <EmailUl>
                <li>I. The Craft of Gorgias</li>
                <li>II. Gorgias' Moral Responsibility and Contradiction</li>
                <li>III. Polus on Desire</li>
                <li>IV. Polus' Proof</li>
                <li>V. Callicles on Nature</li>
                <li>VI. Callicles and the Soul</li>
            </EmailUl>

            <EmailP>
                The course is taught by <b>Max Macken</b>, whom many of you
                will know from facilitating our seminars. Max graduated from
                Trinity College Dublin in 2021, where he studied Kant,
                Heidegger, Plato and analytical philosophy, though his passion
                for philosophy goes back to 2015 and has long reached beyond
                the classroom into essay writing and facilitating discussion.
                Today he is training as a psychotherapist, with an interest in
                communication studies and literature — fitting company for a
                dialogue about persuasion and the care of the soul.
            </EmailP>

            <EmailP>
                As always, the course is offered in three tiers: the{" "}
                <b>Base Tier</b> for self-study with lifetime access to the
                lectures and materials, the <b>Seminar Tier</b> adding{" "}
                <b>8 live online seminars</b> led by Max, and the{" "}
                <b>Dialogue Tier</b> adding weekly 1:1 sessions with the
                teacher (slots are limited). No prior background in philosophy
                or Greek is required.
            </EmailP>

            <EmailP>
                The seminars begin on <b>Sunday, November 1st at 5pm GMT</b>,
                and enrollment opens two weeks prior, on{" "}
                <b>Sunday, October 18th</b>. Find out more on the{" "}
                <EmailA href="https://sphil.xyz/courses/platos-gorgias">
                    course page
                </EmailA>
                .
            </EmailP>

            <EmailP>
                For a taste of the questions at the heart of the dialogue,
                have a look at two of our recent videos:
            </EmailP>

            <div className="my-6">
                <VideoLink
                    text="Rhetoric vs Truth: Two Worlds at Odds or Two Sides of the Same Coin?"
                    ytUrl="https://youtu.be/29zWvyVHOD8?si=8u80vrarcYoAaRLI"
                />
            </div>
            <div className="my-6">
                <VideoLink
                    text="What does health even mean?"
                    ytUrl="https://youtu.be/FI-TYPXZpZE?si=lwrMT4-DpahHkJmC"
                />
            </div>

            <EmailP>Yours Sincerely,</EmailP>

            <EmailP>Filip Niklas and Max Macken</EmailP>
        </Section>
    );
}

export function Newsletter_20261011_PlatoGorgias_Email({
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

export function Newsletter_20261011_PlatoGorgias_Web() {
    return (
        <NewsletterWebLayout>
            <Content />
        </NewsletterWebLayout>
    );
}

export default function Example() {
    return <Newsletter_20261011_PlatoGorgias_Email unsubscribeId="123" />;
}
