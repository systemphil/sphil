import {
    Button,
    Column,
    Img,
    Row,
    Section,
    Text,
} from "@react-email/components";
import { formatCurrency } from "lib/utils";

type OrderInformationProps = {
    order: { id: string; createdAt: Date; pricePaidInCents: number };
    product: { imagePath: string; name: string; description: string };
    courseLink: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export function OrderInformation({
    order,
    product,
    courseLink,
}: OrderInformationProps) {
    return (
        <>
            <Section>
                <Row>
                    <Column>
                        <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                            Order ID
                        </Text>
                        <Text className="mt-0 mr-4">{order.id}</Text>
                    </Column>
                    <Column>
                        <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                            Purchased On
                        </Text>
                        <Text className="mt-0 mr-4">
                            {dateFormatter.format(order.createdAt)}
                        </Text>
                    </Column>
                    <Column>
                        <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                            Price Paid
                        </Text>
                        <Text className="mt-0 mr-4">
                            {formatCurrency(order.pricePaidInCents / 100)}
                        </Text>
                    </Column>
                </Row>
            </Section>
            <Section className="border border-solid border-[#6b0072] rounded-lg p-4 md:p-6 my-4">
                <Img width="100%" alt={product.name} src={product.imagePath} />
                <Row className="mt-8">
                    <Column className="align-bottom">
                        <Text className="text-lg font-bold m-0 mr-4">
                            {product.name}
                        </Text>
                    </Column>
                    <Column align="right">
                        <Button
                            href={courseLink}
                            className="bg-[#6b0072] text-white px-6 py-4 rounded text-lg"
                        >
                            LINK
                        </Button>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Text className="text-gray-500 mb-0">
                            {product.description}
                        </Text>
                    </Column>
                </Row>
            </Section>
        </>
    );
}
