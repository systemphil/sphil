import { Section } from "@react-email/components";
import { EmailBaseLayout } from "./components/EmailBaseLayout";
import { NewsletterWebLayout } from "./components/NewsLetterWebLayout";
import { UnsubscribeNewsletter } from "./components/UnsubscribeNewsletter";
import { EmailA, EmailH1, EmailP } from "./components/EmailHtml";
import { VideoLink } from "./components/VideoLink";

const preview = `Hegel and the Mechanistic Worldview`;

function Content() {
    return (
        <Section>
            <EmailH1>{preview}</EmailH1>

            <EmailP>
                Dear friends of the Logos, we are pleased inform you about our
                upcoming course titled{" "}
                <i>Hegel and the Mechanistic Worldview</i>.
            </EmailP>

            <EmailP>
                As we are getting ready to{" "}
                <EmailA href="https://sphil.xyz/courses/hegel-mechanistic-worldview">
                    launch our course
                </EmailA>
                , we have an update for you regarding the course commencement
                date. As we have already said, the lectures for the course will
                become available from the 19th of January 2026 with the first
                lectures. The first seminar will be held on the 1st of February
                2026.
            </EmailP>

            <VideoLink
                text="View the course announcement video here"
                ytUrl="https://youtu.be/qoxLg-bGcIU?si=QE9WuLo2rSZuLORr"
            />

            <EmailP>
                In the meantime, we hope to see you at the{" "}
                <i>Hegel And Newton</i>
                workshop that Ahilleas will be hosting on the 18th of February
                2026 at 19:00 (GMT). The event is free and open to everyone!{" "}
                <EmailA href="https://us06web.zoom.us/j/86844193613?pwd=bhQzjSs6aapctNO4id2jiA9aCqhkOM.1">
                    Zoom link here
                </EmailA>
            </EmailP>

            <EmailP>Yours Sincerely,</EmailP>

            <EmailP>Ahilleas Rokni and Filip Niklas</EmailP>
        </Section>
    );
}

export function Newsletter_20260115_HegelMechanism_Email({
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

export function Newsletter_20260115_HegelMechanism_Web() {
    return (
        <NewsletterWebLayout>
            <Content />
        </NewsletterWebLayout>
    );
}

export default function Example() {
    return <Newsletter_20260115_HegelMechanism_Email unsubscribeId="123" />;
}
