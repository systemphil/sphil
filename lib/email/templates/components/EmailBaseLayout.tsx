import type { ReactNode } from "react";
import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
} from "@react-email/components";
import { imgCenterStyle } from "../emailUtils";
import { ContactSupport } from "./ContactSupport";

export function EmailBaseLayout({
    children,
    preview,
    isSupport = true,
}: {
    children: ReactNode;
    preview: string;
    isSupport?: boolean;
}) {
    return (
        <Html>
            <Preview>{preview}</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl px-4">
                        <Section>
                            <Img
                                src="https://storage.googleapis.com/sphil-static-assets/sphil_owl.png"
                                alt="sphil_owl"
                                width="200"
                                height="200"
                                style={imgCenterStyle}
                            />
                        </Section>
                        {children}
                        {isSupport && <ContactSupport />}
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
