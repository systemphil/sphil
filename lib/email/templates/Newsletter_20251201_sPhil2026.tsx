import { Img, Section } from "@react-email/components";
import { EmailBaseLayout } from "./components/EmailBaseLayout";
import { NewsletterWebLayout } from "./components/NewsLetterWebLayout";
import { UnsubscribeNewsletter } from "./components/UnsubscribeNewsletter";
import { EmailA, EmailH1, EmailP } from "./components/EmailHtml";

const preview = `2026 Calendar`;

function Content() {
    return (
        <Section>
            <EmailH1>sPhil {preview}</EmailH1>

            <EmailP>
                Dear friends of the Logos, we are pleased to announce our course
                plans for 2026.
            </EmailP>

            <EmailP>
                The first year of running our first courses at sPhil is soon
                behind us. We successfully launched two courses this year and
                we'd like to thank all students that participated. As we
                continue our mission to Study the Great Texts, we are thrilled
                to unveil four immersive, challenging, and rewarding courses for
                the coming year. Our 2026 curriculum covers seminal works from
                Ancient Greece through the Enlightenment and the German
                Idealists, providing a rich, comprehensive intellectual journey
                spanning the depths of reality, through the creative potential
                of all living beings to the exuberant imaginative genius of
                humanity.
            </EmailP>

            <Img
                src="https://storage.googleapis.com/sphil-static-assets/sPhil_2026.webp"
                alt="sphil_2026_calendar"
                width="400"
                height="400"
                className="mx-auto mb-4 rounded-md"
            />

            <Section className="text-center">
                <EmailA href="https://storage.googleapis.com/sphil-static-assets/sPhil_2026.webp">
                    Click here to view the calendar in full
                </EmailA>
            </Section>

            <h4>📚 The 2026 Course Lineup</h4>

            <EmailP>
                We are honored to have a passionate and talented faculty lead
                these explorations into some of the most enduring works of human
                thought.
            </EmailP>

            <table>
                <thead>
                    <tr>
                        <th>Course Topic</th>
                        <th>Duration (est)</th>
                        <th>Instructor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ width: "200px" }}>
                            <strong>Hegel’s Mechanism</strong>
                        </td>
                        <td>8-weeks</td>
                        <td>Ahilleas Rokni</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>
                                Aristotle’s <i>On the Soul</i>
                            </strong>
                        </td>
                        <td>8-weeks</td>
                        <td>Filip Niklas</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>
                                Milton’s <i>Paradise Lost</i>
                            </strong>
                        </td>
                        <td>12-weeks</td>
                        <td>Kenneth Solberg</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>
                                Plato’s <i>Gorgias</i>
                            </strong>
                        </td>
                        <td>6-weeks</td>
                        <td>Max Macken</td>
                    </tr>
                </tbody>
            </table>

            <EmailP>
                Whether your interest lies in metaphysics, political philosophy,
                poetry, or ethics, these courses promise deep engagement with
                texts that continue to shape our understanding of the world.
            </EmailP>

            <EmailP>
                Registration details, schedules, and specific course
                descriptions will be released in due course (keep an eye out on
                our media channels or this newsletter!). In the meantime, you
                can review the full visual course map attached to this email!
                Please note: Plans may be subject to change.
            </EmailP>

            <EmailP>We look forward to studying alongside you in 2026.</EmailP>

            <EmailP>Yours Sincerely,</EmailP>

            <EmailP>Filip Niklas and Ahilleas Rokni</EmailP>
        </Section>
    );
}

export function Newsletter_20251201_sPhil2026_Email({
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

export function Newsletter_20251201_sPhil2026_Web() {
    return (
        <NewsletterWebLayout>
            <Content />
        </NewsletterWebLayout>
    );
}

export default function Example() {
    return <Newsletter_20251201_sPhil2026_Email unsubscribeId="123" />;
}
