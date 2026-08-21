import { Section } from "react-email";
import { EmailBaseLayout } from "./components/EmailBaseLayout";
import { NewsletterWebLayout } from "./components/NewsLetterWebLayout";
import { UnsubscribeNewsletter } from "./components/UnsubscribeNewsletter";
import { EmailA, EmailH1, EmailP, EmailUl } from "./components/EmailHtml";

const preview = `Hegel's Ontology: The First In-Person sPhil Workshop`;

function Content() {
    return (
        <Section>
            <EmailH1>{preview}</EmailH1>

            <EmailP>Dear Friends,</EmailP>

            <EmailP>
                This September, it will have been 2 years since sPhil was
                launched. Given this upcoming anniversary, we have decided to
                hold the first in-person sPhil workshop. The title of the
                workshop is: <i>Hegel’s Ontology: Do Categories Exist?</i>
            </EmailP>

            <EmailP>
                The workshop will focus on the all-important question of how to
                understand Hegel’s philosophical project as an ontology. Some of
                the topics that we will be considering include, but are not
                limited to:
            </EmailP>

            <EmailUl>
                <li>What does it mean for there to be categories?</li>
                <li>
                    Are these categories just for us or do they form part of
                    reality?
                </li>
                <li>
                    What does it mean for a category to form part of reality?
                </li>
                <li>Does a category exist?</li>
                <li>If yes, what does it mean for a category to exist?</li>
                <li>
                    Categories are things that can be sensibly intuited or that
                    can causally interact, so in what sense can they exist?
                </li>
                <li>
                    Is the existence of a category different to the existence of
                    an object?
                </li>
            </EmailUl>

            <h4>🗓️ Date & Format</h4>

            <EmailP>
                The workshop will be held on{" "}
                <b>Saturday the 5th of September</b>. It will go from{" "}
                <b>10:00 – 16:00</b>. The aim of the workshop is to encourage
                discussion on these topics. As such, there will be brief talks
                by Ahilleas and Filip, before opening up to a general
                round-table discussion. Participants are welcome to prepare
                their own presentations for the workshop — please let us know if
                you would like to present something.
            </EmailP>

            <EmailP>
                The workshop will be held during the same week as the HSGB
                conference in Oxford, England. The hope is that attendees will
                make the most of their journey by being able to participate in
                both events.
            </EmailP>

            <EmailP>
                This workshop is an opportunity for the sPhil community to come
                together, to discuss philosophy in person, and to get to know
                each other more generally.
            </EmailP>

            <EmailP>
                Please get in touch with us if you would be looking to attend
                the workshop by emailing{" "}
                <EmailA href="mailto:service@systemphil.com">
                    service@systemphil.com
                </EmailA>
                .
            </EmailP>

            <EmailP>Best wishes,</EmailP>

            <EmailP>Ahilleas &amp; Filip</EmailP>
        </Section>
    );
}

export function Newsletter_20260515_HegelOntologyWorkshop_Email({
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

export function Newsletter_20260515_HegelOntologyWorkshop_Web() {
    return (
        <NewsletterWebLayout>
            <Content />
        </NewsletterWebLayout>
    );
}

export default function Example() {
    return (
        <Newsletter_20260515_HegelOntologyWorkshop_Email unsubscribeId="123" />
    );
}
