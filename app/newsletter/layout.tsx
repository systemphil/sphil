"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { Typography } from "@mui/material";
import { SubscribeToNewsletterForm } from "features/marketing/components/SubscribeToNewsletter";
import { NEWSLETTERS } from "lib/email/data/newsletters";
import { ScreenWrapper } from "lib/components/ui/ScreenWrapper";

export default function NewsletterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <ScreenWrapper className="flex flex-col justify-start md:justify-center items-center py-6">
            <div className="mt-8 flex justify-center w-full max-w-5xl gap-6 flex-wrap">
                {/* Left menu - Sticky Sidebar */}
                <aside
                    className="
                        sm:sticky
                        top-24
                        h-[calc(100vh-8rem)]
                        w-64
                        shrink-0
                        overflow-y-auto
                        rounded-2xl
                        border
                        backdrop-blur-sm
                    "
                >
                    <List
                        dense
                        subheader={
                            <ListSubheader
                                component="div"
                                className="!bg-transparent p-2 pt-3"
                            >
                                <Typography variant="body2" component="div">
                                    Subscribe to our newsletter to be the first
                                    to know about our activities.
                                </Typography>
                                <div className="mt-2">
                                    <SubscribeToNewsletterForm />
                                </div>
                                <Typography
                                    component="div"
                                    variant="overline"
                                    className="mt-3 block text-xs"
                                >
                                    Previous newsletters
                                </Typography>
                            </ListSubheader>
                        }
                    >
                        {NEWSLETTERS.map((email) => {
                            const href = `/newsletter/${email.id}`;
                            const isActive = pathname === href;

                            return (
                                <Link
                                    href={href}
                                    key={email.id}
                                    className="no-underline text-inherit"
                                >
                                    <ListItemButton selected={isActive}>
                                        <div className="mr-2 flex items-center">
                                            <EmailOutlinedIcon fontSize="small" />
                                        </div>
                                        <ListItemText
                                            primary={email.title}
                                            secondary={email.subtitle}
                                            slotProps={{
                                                primary: {
                                                    className:
                                                        "text-sm font-medium",
                                                },
                                                secondary: {
                                                    className: "text-xs",
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                </Link>
                            );
                        })}
                    </List>
                </aside>

                {/* Right preview - Renders the 'children' (the page.tsx) */}
                <article className="flex-1 rounded-2xl border p-4 md:p-6 min-w-[290px]">
                    {children}
                </article>
            </div>
        </ScreenWrapper>
    );
}
