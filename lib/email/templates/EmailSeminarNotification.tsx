import {
    Column,
    Img,
    Row,
    Section,
    Text,
    Button,
    Link,
} from "@react-email/components";
import { Product } from "lib/stripe/stripeFuncs";
import { TermsApply } from "./components/TermsApply";
import { EmailBaseLayout } from "./components/EmailBaseLayout";

type PurchaseReceiptEmailProps = {
    product: Product;
    seminarLink?: string | null;
    courseLink: string;
};

export function EmailSeminarNotification({
    product,
    courseLink,
}: PurchaseReceiptEmailProps) {
    const preview = `Seminar enrollment for ${product.name}`;

    return (
        <EmailBaseLayout preview={preview}>
            <Section>
                <h1
                    className="text-2xl font-bold text-gray-900"
                    style={{ textAlign: "center" }}
                >
                    Thank you for enrolling!
                </h1>
                <p className="text-gray-500 my-4">
                    Your seminar enrollment for {product.name} has been
                    registered. Further information will follow by e-mail closer
                    to the start date.
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
                                    Course Page
                                </Button>
                                <Text className="text-sm font-bold">
                                    🏺 Seminar link will follow by e-mail nearer
                                    the start date. It will also be made
                                    available under Seminar Cohort details
                                    accessible from the{" "}
                                    <Link href={"https://sphil.xyz/my-courses"}>
                                        My Courses
                                    </Link>{" "}
                                    page.
                                </Text>
                            </div>
                        </Row>
                    </Column>
                </Row>
            </Section>
            <TermsApply />
        </EmailBaseLayout>
    );
}

export default function Example() {
    const product = {
        name: "DummyProductName1",
        imagePath:
            "https://cdn.indiabioscience.org/imager/articles/411714/Aniruddha_feature-image_4b32b63c5c28c858e051e9d1a2a717a1.png",
        description:
            "Experience crystal-clear audio with our Wireless Noise-Canceling Headphones. Designed for comfort and superior sound quality, these headphones offer up to 40 hours of battery life, deep bass, and active noise cancellation for immersive listening. Perfect for travel, work, or relaxation. ",
    };

    const courseLink = "https://google.com";

    return (
        <EmailSeminarNotification
            product={product}
            seminarLink={courseLink}
            courseLink={courseLink}
        />
    );
}
