import { EmailSeminarNotification } from "lib/components/email/EmailSeminarNotification";

export default function PurchaseReceipt() {
    const product = {
        name: "DummyProductName",
        imagePath:
            "https://cdn.indiabioscience.org/imager/articles/411714/Aniruddha_feature-image_4b32b63c5c28c858e051e9d1a2a717a1.png",
        description:
            "Experience crystal-clear audio with our Wireless Noise-Canceling Headphones. Designed for comfort and superior sound quality, these headphones offer up to 40 hours of battery life, deep bass, and active noise cancellation for immersive listening. Perfect for travel, work, or relaxation. ",
    };

    const courseLink = "https://google.com";

    return (
        <EmailSeminarNotification
            product={product}
            seminarLink={null}
            courseLink={courseLink}
        />
    );
}
