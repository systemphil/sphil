"use client";

import { Heading } from "lib/components/ui/Heading";
import { Paragraph } from "lib/components/ui/Paragraph";
import { Cards } from "nextra/components";
import { ReactNode } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import BookIcon from "@mui/icons-material/Book";
import { Link } from "nextra-theme-docs";

export function EncyclopaediaLanding() {
    const cardClasses = "min-w-[220px] m-2";
    return (
        <div>
            <div className="my-8 flex justify-center flex-col items-center">
                <Heading as="h1">Encyclopaedia</Heading>
                <Paragraph className="text-left">
                    The sPhil Encyclopaedia is organized into systems of
                    particular philosophers, each further subdivided into
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
                        icon={<ImportContactsIcon />}
                        title="Index"
                        href="/articles/index"
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
