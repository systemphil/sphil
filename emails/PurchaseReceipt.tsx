import { EmailPurchaseReceipt } from "lib/components/email/EmailPurchaseReceipt";

export default function EmailTest() {
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
