import { Role } from "@prisma/client";
import { EmailPurchaseNotification } from "lib/components/email/EmailPurchaseNotification";

export default function EmailTest() {
    const product = {
        name: "DummyProductName",
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

    const user = {
        name: "Hans Hanson",
        id: "userid-123-123-123",
        email: "hans@hanson.com",
        emailVerified: null,
        stripeCustomerId: "customerID",
        image: null,
        role: "BASIC" as Role,
        productsPurchased: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return (
        <EmailPurchaseNotification
            user={user}
            product={product}
            order={order}
            courseLink={courseLink}
        />
    );
}
