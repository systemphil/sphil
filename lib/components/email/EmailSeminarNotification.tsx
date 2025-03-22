import {
    Body,
    Column,
    Container,
    Head,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
    Button,
} from "@react-email/components";
import { Product } from "lib/stripe/stripeFuncs";
import { imgCenterStyle } from "./emailUtils";
import { ContactSupport } from "./ContactSupport";
import { TermsApply } from "./TermsApply";

type PurchaseReceiptEmailProps = {
    product: Product;
    seminarLink?: string | null;
    courseLink: string;
};

export function EmailSeminarNotification({
    product,
    seminarLink,
    courseLink,
}: PurchaseReceiptEmailProps) {
    return (
        <Html>
            <Preview>Seminar enrollment for {product.name}</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <Section>
                            <Img
                                src="https://storage.googleapis.com/sphil-prod-images/images/sphil_owl.png"
                                alt="sphil_owl"
                                width="100"
                                height="100"
                                style={imgCenterStyle}
                            />
                        </Section>
                        <Section>
                            <h1
                                className="text-2xl font-bold text-gray-900"
                                style={{ textAlign: "center" }}
                            >
                                Thank you for enrolling!
                            </h1>
                            <p className="text-gray-500 my-4">
                                Your seminar enrollment for {product.name} has
                                been registered. Further information will follow
                                by e-mail closer to the start date.
                            </p>
                        </Section>
                        <Section className="border border-solid border-[#6b0072] rounded-lg p-4 md:p-6 my-4">
                            <Row className="mt-8 gap-2">
                                <Column className="align-center">
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Img
                                            width="100%"
                                            alt={product.name}
                                            src={product.imagePath}
                                        />
                                    </div>
                                </Column>
                                <Column align="right" className="min-w-32">
                                    <Row align="right">
                                        <div
                                            style={{
                                                textAlign: "right",
                                            }}
                                        >
                                            <Button
                                                href={courseLink}
                                                className="bg-[#001172] text-white p-2 rounded-sm text-md my-4"
                                            >
                                                View Schedule
                                            </Button>
                                            {seminarLink ? (
                                                <Button
                                                    href={seminarLink}
                                                    className="bg-[#6b0072] text-white p-2 rounded-sm text-md my-4"
                                                >
                                                    SEMINAR LINK
                                                </Button>
                                            ) : (
                                                <Text className="text-sm font-bold">
                                                    ⚠️ Seminar link not set up
                                                    yet. Lookout for{" "}
                                                    <b>second email</b>!
                                                </Text>
                                            )}
                                        </div>
                                    </Row>
                                </Column>
                            </Row>
                        </Section>
                        <ContactSupport />
                        <TermsApply />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
