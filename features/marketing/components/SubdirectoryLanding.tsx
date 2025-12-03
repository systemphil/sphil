"use client";

import { Heading } from "lib/components/ui/Heading";
import { Cards } from "nextra/components";
import { SubHeroBackground } from "./SubHeroBackground";
import { Paragraph } from "lib/components/ui/Paragraph";

export const SubdirectoryLanding = ({
    subdirectory,
    tagline,
}: {
    subdirectory: string;
    tagline?: string;
}) => {
    return (
        <main>
            <section
                className={`relative flex flex-col items-center justify-start w-full h-screen overflow-hidden mb-10`}
            >
                <SubHeroBackground>
                    <div className="flex flex-col items-center justify-center">
                        <Heading>{subdirectory.toUpperCase()}</Heading>
                        <div className="flex flex-wrap max-w-[350px] justify-between  gap-4 bg-white rounded-lg dark:bg-transparent p-8 shadow-[10px_10px_50px_50px_rgba(255,255,255,0.8)] dark:shadow-none">
                            {tagline ? (
                                <Paragraph className="text-center text-sm">
                                    {tagline}
                                </Paragraph>
                            ) : null}
                            <Cards.Card
                                icon={<span>📄</span>}
                                title="Guides"
                                href={`/articles/${subdirectory}/guides`}
                            />
                            <Cards.Card
                                icon={<span>📄</span>}
                                title="Reference"
                                href={`/articles/${subdirectory}/reference`}
                            />
                        </div>
                    </div>
                </SubHeroBackground>
            </section>
        </main>
    );
};
