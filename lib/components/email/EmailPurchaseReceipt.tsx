import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./OrderInformation";
import { imgCenterStyle } from "./emailUtils";
import { ContactSupport } from "./ContactSupport";
import { TermsApply } from "./TermsApply";

type PurchaseReceiptEmailProps = {
    product: {
        name: string;
        imagePath: string;
        description: string;
    };
    order: { id: string; createdAt: Date; pricePaidInCents: number };
    courseLink: string;
};

// ! BUG where is this coming from??
// Warning: Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.

export function EmailPurchaseReceipt({
    product = {
        name: "DummyProduct",
        imagePath:
            "https://cdn.indiabioscience.org/imager/articles/411714/Aniruddha_feature-image_4b32b63c5c28c858e051e9d1a2a717a1.png",
        description:
            "Experience crystal-clear audio with our Wireless Noise-Canceling Headphones. Designed for comfort and superior sound quality, these headphones offer up to 40 hours of battery life, deep bass, and active noise cancellation for immersive listening. Perfect for travel, work, or relaxation. ",
    },
    order = {
        createdAt: new Date(),
        id: "id",
        pricePaidInCents: 10000,
    },
    courseLink = "https://google.com",
}: PurchaseReceiptEmailProps) {
    return (
        <Html>
            <Preview>Access {product.name} and view receipt</Preview>
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
                                Thank you for your purchase!
                            </h1>
                            <p className="text-gray-500 my-4">
                                You can access your course by clicking the
                                button below, from the course page or your
                                account page.
                            </p>
                            <p className="text-gray-500 my-4">
                                We hope you will enjoy the course and develop
                                your mind to new horizons!
                            </p>
                        </Section>
                        <OrderInformation
                            order={order}
                            product={product}
                            courseLink={courseLink}
                        />
                        <ContactSupport />
                        <TermsApply />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
