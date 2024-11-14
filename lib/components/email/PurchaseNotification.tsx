import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./OrderInformation";
import { User } from "@prisma/client";
import { UserInformation } from "./UserInformation";

type PurchaseReceiptEmailProps = {
    product: {
        name: string;
        imagePath: string;
        description: string;
    };
    order: { id: string; createdAt: Date; pricePaidInCents: number };
    courseLink: string;
    user: User;
};

export function PurchaseNotification({
    user,
    product,
    order,
    courseLink,
}: PurchaseReceiptEmailProps) {
    return (
        <Html>
            <Preview>New purchase for {product.name}</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <Heading>Purchase Notification</Heading>
                        <UserInformation user={user} />
                        <OrderInformation
                            order={order}
                            product={product}
                            courseLink={courseLink}
                        />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
