import { Section } from "@react-email/components";
import { OrderInformation } from "./components/OrderInformation";
import { TermsApply } from "./components/TermsApply";
import { EmailBaseLayout } from "./components/EmailBaseLayout";

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
    product,
    order,
    courseLink,
}: PurchaseReceiptEmailProps) {
    const preview = `Access ${product.name} and view receipt`;
    return (
        <EmailBaseLayout preview={preview}>
            <Section>
                <h1
                    className="text-2xl font-bold text-gray-900"
                    style={{ textAlign: "center" }}
                >
                    Thank you for your purchase!
                </h1>
                <p className="text-gray-500 my-4">
                    You can access your course by clicking the button below,
                    from the course page or your account page.
                </p>
                <p className="text-gray-500 my-4">
                    We hope you will enjoy the course and develop your mind to
                    new horizons!
                </p>
            </Section>
            <OrderInformation
                order={order}
                product={product}
                courseLink={courseLink}
            />
            <TermsApply />
        </EmailBaseLayout>
    );
}

export default function Example() {
    const product = {
        name: "DummyProductName Very Long Exclusive Great Deal Much To Think About Greatest Part 2",
        imagePath:
            "https://cdn.indiabioscience.org/imager/articles/411714/Aniruddha_feature-image_4b32b63c5c28c858e051e9d1a2a717a1.png",
        description:
            "Experience crystal-clear audio with our Wireless Noise-Canceling Headphones. Designed for comfort and superior sound quality, these headphones offer up to 40 hours of battery life, deep bass, and active noise cancellation for immersive listening. Perfect for travel, work, or relaxation. ",
    };

    const order = {
        createdAt: new Date(),
        id: "321434214-41234324-321432424",
        pricePaidInCents: 10050,
    };

    const courseLink = "https://google.com";

    return (
        <EmailPurchaseReceipt
            product={product}
            order={order}
            courseLink={courseLink}
        />
    );
}
