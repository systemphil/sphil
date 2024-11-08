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

export function PurchaseReceiptEmail({
    product,
    order,
    courseLink,
}: PurchaseReceiptEmailProps) {
    const owlImg = {
        margin: "0 auto",
        marginBottom: "16px",
        borderRadius: "50%",
    };

    return (
        <Html>
            <Preview>Access {product.name} and view receipt</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <Section>
                            <Img
                                src="https://storage.googleapis.com/symposia-prod-images/images/sphil_owl.png"
                                alt="sphil_owl"
                                width="200"
                                height="200"
                                style={owlImg}
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
                        <Section>
                            <p className="text-gray-500 my-4">
                                If there are any issues, please contact support
                                at{" "}
                                <a
                                    href="mailto:support@systemphil.com"
                                    className="text-gray-600 underline hover:text-blue-700"
                                >
                                    support@systemphil.com
                                </a>
                                .
                            </p>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
