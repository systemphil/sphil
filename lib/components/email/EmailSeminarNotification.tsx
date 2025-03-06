import {
    Body,
    Column,
    Container,
    Head,
    Heading,
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
                        <Heading>Seminar enrollment for {product.name}</Heading>
                        <Section className="border border-solid border-[#6b0072] rounded-lg p-4 md:p-6 my-4">
                            <Img
                                width="100%"
                                alt={product.name}
                                src={product.imagePath}
                            />

                            {seminarLink ? (
                                <>
                                    <Text className="text-gray-500 mb-0">
                                        Thank you for enrolling to the seminar
                                        for {product.name}! Below is the seminar
                                        link (Zoom link) for accessing the
                                        seminar session.
                                    </Text>
                                    <Row className="mt-8">
                                        <Column className="align-bottom">
                                            <Text className="text-lg font-bold m-0 mr-4">
                                                {product.name}
                                            </Text>
                                        </Column>
                                        <Column align="right">
                                            <Button
                                                href={seminarLink}
                                                className="bg-[#6b0072] text-white px-6 py-4 rounded-sm text-lg"
                                            >
                                                SEMINAR LINK
                                            </Button>
                                        </Column>
                                    </Row>
                                    <Row>
                                        <Column align="right">
                                            <Button
                                                href={courseLink}
                                                className="bg-[#001172] text-white px-6 py-4 rounded-sm text-lg"
                                            >
                                                View Schedule
                                            </Button>
                                        </Column>
                                    </Row>
                                </>
                            ) : (
                                <>
                                    <Text className="text-gray-500 mb-0">
                                        Thank you for enrolling to the seminar
                                        for {product.name}! A seminar link has
                                        not been set up yet, so please be on the
                                        lookout for a second email nearer to the
                                        starting date.
                                    </Text>
                                    <Row className="mt-8">
                                        <Column className="align-bottom">
                                            <Text className="text-lg font-bold m-0 mr-4">
                                                {product.name}
                                            </Text>
                                        </Column>
                                        <Column align="right">
                                            <Button
                                                href={courseLink}
                                                className="bg-[#001172] text-white px-6 py-4 rounded-sm text-lg"
                                            >
                                                View Schedule
                                            </Button>
                                        </Column>
                                    </Row>
                                </>
                            )}
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
