import { Section } from "@react-email/components";
import { EmailBaseLayout } from "./components/EmailBaseLayout";
import { NewsletterWebLayout } from "./components/NewsLetterWebLayout";
import { UnsubscribeNewsletter } from "./components/UnsubscribeNewsletter";
import { EmailA, EmailH1, EmailP } from "./components/EmailHtml";

const preview = `The Essential Relation: Free and Open Reading Group`;

function Content() {
    return (
        <Section>
            <EmailH1>{preview}</EmailH1>

            <EmailP>
                Dear friends of the Logos, our course on{" "}
                <i>Hegel and the Mechanistic Worldview</i> has come to a
                satisfying conclusion. After 8 weeks of grappling with Hegel’s
                analysis of mechanism, we have come out on the other end of the
                tunnel with a fairly comprehensive understanding of what Hegel’s
                story about mechanism is all about. On the journey, we looked at
                how Hegel’s analysis of crucial concepts in mechanics — like
                action and reaction, communication at a distance, and laws —
                interacted with Newton and the wider scientific approach to
                these concepts. Hegel’s relationship with the mechanistic
                science of his day is nuanced and not straightforwardly
                critical; he appears to be incorporating the central ideas of
                mechanics, whilst carving out subtle distinctions between
                himself and other thinkers.
            </EmailP>

            <EmailP>
                The course concluded with a tour-de-force of a guest lecture by
                Dr. Marina Banchetti, who gave us a master course in the
                development of scientific thought from the early alchemists,
                through the subtle distinctions between thinkers like Descartes,
                Gassendi, and Boyle, before concluding with Newton’s
                achievement, which was presented as a synthesis of the old
                alchemical worldview with the mechanics and mathematics of the
                New Science.
            </EmailP>

            <h4>📖 The “Essential Relation” Reading Group</h4>

            <EmailP>
                Following feedback from his course, Ahilleas will be starting an
                online reading group. The objective of the reading group will be
                to read through the “Essential Relation”, chapter 3, of section
                2, of the Doctrine of Essence. The reading group will meet once
                a month for two hours. The format of the group will be that we
                will read the text and discuss it together. There will be no
                fixed schedule — the reading group will go at its own pace.
            </EmailP>

            <EmailP>
                The reason for delving into this chapter is connected to some
                discussions that arose out of the{" "}
                <i>Hegel and the Mechanistic Worldview</i> course. It is in this
                section that Hegel discusses the relationship between wholes and
                parts, and the relationship between forces and their expression.
                Hegel’s understanding of these concepts plays an important role
                in the kinds of criticisms that he has of the science of his
                day, and of their usage of these concepts. As such, it promises
                to be a chapter with wide-reaching implications.
            </EmailP>

            <EmailP>
                There will be a limited number of spots for the reading group,
                and priority will be given to subscribers of the sPhil
                newsletter. The reading group will commence on{" "}
                <b>Sunday the 7th of June 2026 at 20:00 GMT</b>. Please register
                your interest to join the group by the{" "}
                <b>30th of May 2026</b> by emailing{" "}
                <EmailA href="mailto:service@systemphil.com">
                    service@systemphil.com
                </EmailA>
                . Spaces will be allocated on a first come first serve basis.
            </EmailP>

            <h4>📚 The sPhil Bookshop</h4>

            <EmailP>
                Over our years we have acquired numerous philosophy books.
                Unfortunately, we cannot keep them all and we have decided to
                open an informal bookshop online for our newsletter subscribers.
                The books are all in near-new condition and are discounted at
                25% of what they are typically sold for online.
            </EmailP>

            <Section className="text-center">
                <EmailA href="https://docs.google.com/spreadsheets/d/1t2yg5TALl7e6sXDatkQELljOGiFOOjrXTdrnUjdeTKY/edit?usp=sharing">
                    Browse the sPhil Bookshop spreadsheet
                </EmailA>
            </Section>

            <EmailP>
                Please be advised that the cost excludes shipping and packaging.
                Once we have your order and your address, we will calculate the
                cost of shipping and packaging and let you know.
            </EmailP>

            <EmailP>Yours Sincerely,</EmailP>

            <EmailP>Ahilleas Rokni and Filip Niklas</EmailP>
        </Section>
    );
}

export function Newsletter_20260504_HegelMechanismConclusion_Email({
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

export function Newsletter_20260504_HegelMechanismConclusion_Web() {
    return (
        <NewsletterWebLayout>
            <Content />
        </NewsletterWebLayout>
    );
}

export default function Example() {
    return (
        <Newsletter_20260504_HegelMechanismConclusion_Email unsubscribeId="123" />
    );
}
