"use client";

import { Heading } from "lib/components/ui/Heading";
import { Paragraph } from "lib/components/ui/Paragraph";
import { Cards } from "nextra/components";
import type { ReactNode } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import BookIcon from "@mui/icons-material/Book";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Link } from "nextra-theme-docs";

export function EncyclopaediaLanding() {
    const cardClasses = "min-w-[220px] m-2";
    return (
        <div>
            <div className="my-8 flex justify-center flex-col items-center">
                <Heading as="h1">Encyclopaedia</Heading>
                <Paragraph className="text-justify">
                    The sPhil Encyclopaedia is a free and open resource built on
                    open-source principles. Anyone may contribute by editing or
                    expanding articles through open pull requests. It is
                    organized into systems of authors or schools of thought,
                    presenting their concepts in a structured and evolving form.
                    The project is also a place to exercise scholarly writing,
                    test interpretations, and engage in rigorous and spirited
                    debate with others who care about the life of the great
                    ideas. Each particular system is further subdivided into
                    modular{" "}
                    <Link href="/articles/contributing#general-division-of-the-encyclopaedia">
                        Guides
                    </Link>{" "}
                    and{" "}
                    <Link href="/articles/contributing#general-division-of-the-encyclopaedia">
                        Reference
                    </Link>
                    .
                </Paragraph>
            </div>

            <CardGrouping>
                <Cards.Card
                    className={cardClasses}
                    icon={<MenuBookIcon />}
                    title="Hegel Guides"
                    href="/articles/hegel/guides"
                />
                <Cards.Card
                    className={cardClasses}
                    icon={<BookIcon />}
                    title="Hegel Reference"
                    href="/articles/hegel/reference"
                />
            </CardGrouping>

            <CardGrouping>
                <Cards.Card
                    className={cardClasses}
                    icon={<MenuBookIcon />}
                    title="Kant Guides"
                    href="/articles/kant/guides"
                />
                <Cards.Card
                    className={cardClasses}
                    icon={<BookIcon />}
                    title="Kant Reference"
                    href="/articles/kant/reference"
                />
            </CardGrouping>

            <div className="my-8 flex justify-center flex-col items-center">
                <Paragraph className="text-left mb-4">
                    Visit the index to view all articles in alphabetical order.
                </Paragraph>
                <CardGrouping>
                    <Cards.Card
                        className={cardClasses}
                        icon={<FormatListBulletedIcon />}
                        title="Index"
                        href="/articles/encyclopaedia-index"
                    />
                </CardGrouping>
            </div>

            <div className="my-8 flex justify-center flex-col items-center">
                <Paragraph className="text-left mb-4">
                    Interested in contributing, learning about our methodology,
                    or running sPhil on your own machine? Visit our Contributing
                    section for more information.
                </Paragraph>
                <CardGrouping>
                    <Cards.Card
                        className={cardClasses}
                        icon={<ImportContactsIcon />}
                        title="Contributing"
                        href="/articles/contributing"
                    />
                </CardGrouping>
            </div>
        </div>
    );
}

function CardGrouping({ children }: { children: ReactNode }) {
    return <div className="flex justify-center flex-wrap">{children}</div>;
}
