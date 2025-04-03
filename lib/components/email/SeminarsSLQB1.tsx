import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
} from "@react-email/components";
import { imgCenterStyle } from "./emailUtils";
import { ContactSupport } from "./ContactSupport";

export function SeminarsSLQB1() {
    return (
        <Html>
            <Preview>Seminar Information</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <Section>
                            <Img
                                src="https://storage.googleapis.com/sphil-prod-images/images/sphil_owl.png"
                                alt="sphil_owl"
                                width="200"
                                height="200"
                                style={imgCenterStyle}
                            />
                        </Section>
                        <Section>
                            <h1
                                className="text-2xl font-bold text-gray-900"
                                style={{ textAlign: "center" }}
                            >
                                The Metaphysician&apos;s Purgatorio
                            </h1>

                            <p className="text-gray-600 my-4">
                                Thank you for enrolling in the seminar for the
                                Quality of Being course. Our first seminar is
                                right around the corner and below is some
                                practical information.
                            </p>

                            <ul className="text-gray-600 my-4">
                                <li>📅 First seminar: April 6, 21:00 CET</li>
                                <li>
                                    📍 Where:{" "}
                                    <Link href="https://us06web.zoom.us/j/85635105989?pwd=8huzVaMJpCY1zbmObucaX36w7SQ7JW.1">
                                        Zoom link
                                    </Link>
                                </li>
                                <li>
                                    📖 What to prepare: Be sure to have watched
                                    the first lecture and done the required
                                    reading. Try think carefully about the
                                    questions and be sure to write down your own
                                    and bring them to the seminar!
                                </li>
                            </ul>

                            <p className="text-gray-600 my-4">
                                Looking forward to meeting you all!
                            </p>

                            <p className="text-gray-600 my-4">
                                Yours Sincerely,
                            </p>

                            <p className="text-gray-600 my-4">
                                Filip Niklas and Ahilleas Rokni
                            </p>
                        </Section>
                        <ContactSupport />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
