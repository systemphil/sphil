"use client";

import { Heading } from "lib/components/ui/Heading";
import { Cards } from "nextra/components";
import { SubHeroBackground } from "./SubHeroBackground";

export const SubdirectoryLanding = ({
    subdirectory,
}: {
    subdirectory: string;
}) => {
    return (
        <main>
            <section
                className={`relative flex flex-col items-center justify-start w-full h-screen overflow-hidden mb-10`}
            >
                <SubHeroBackground>
                    <div className="flex flex-col items-center justify-center">
                        <Heading>{subdirectory.toUpperCase()}</Heading>
                        <div className="flex flex-wrap w-[315px] justify-between  gap-4 bg-white rounded-lg dark:bg-transparent p-8 shadow-[10px_10px_50px_50px_rgba(255,255,255,0.8)] dark:shadow-none">
                            <Cards>
                                <Cards.Card
                                    icon={" 📄 " as any}
                                    title="Guides"
                                    href={`/docs/${subdirectory}/guides`}
                                />
                                <Cards.Card
                                    icon={" 📄 " as any}
                                    title="Reference"
                                    href={`/docs/${subdirectory}/reference`}
                                />
                            </Cards>
                        </div>
                    </div>
                </SubHeroBackground>
            </section>
        </main>
    );
};
