/* eslint-disable @next/next/no-img-element */
import { imgCenterStyle } from "lib/email/templates/emailUtils";
import { ReactNode } from "react";

export function NewsletterWebLayout({ children }: { children: ReactNode }) {
    return (
        <div className="font-sans  min-h-screen py-8">
            <div className="max-w-xl mx-auto p-4">
                <section className="mb-8">
                    <img
                        src="https://storage.googleapis.com/sphil-prod-images/images/sphil_owl.png"
                        alt="sphil_owl"
                        width="200"
                        height="200"
                        style={imgCenterStyle}
                        className="mx-auto"
                    />
                </section>
                {children}
            </div>
        </div>
    );
}
