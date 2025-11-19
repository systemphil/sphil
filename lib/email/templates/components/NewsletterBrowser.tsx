"use client";

import { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { Paragraph } from "lib/components/ui/Paragraph";
import { Newsletter_20250926_SchellingAnnouncement_Web } from "lib/email/templates/Newsletter_20250926_SchellingAnnouncement";
import { SubscribeToNewsletterForm } from "features/marketing/components/SubscribeToNewsletter";
import { Typography } from "@mui/material";
import { Newsletter_20250406_HegelSLQB1_Announcement_Web } from "../Newsletter_20250406_HegelSLQB1_Announcement";

const EMAILS = [
    {
        id: "schelling-2025-09-26",
        title: "Schelling Announcement",
        subtitle: "September 26, 2025",
        component: Newsletter_20250926_SchellingAnnouncement_Web,
    },
    {
        id: "hegel-2025-04-06",
        title: "Hegel Quality of Being Announcement",
        subtitle: "April 6, 2025",
        component: Newsletter_20250406_HegelSLQB1_Announcement_Web,
    },
];

type EmailId = (typeof EMAILS)[number]["id"];

export function NewsletterBrowser() {
    const [selectedId, setSelectedId] = useState<EmailId>(EMAILS[0]?.id);

    const selectedEmail = EMAILS.find((email) => email.id === selectedId);
    const SelectedComponent = selectedEmail?.component ?? null;

    const handleSelect = (id: EmailId) => {
        setSelectedId(id);

        if (typeof window !== "undefined") {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="mt-8 flex justify-center w-full max-w-5xl gap-6 flex-wrap">
            {/* Left menu */}
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
                                Subscribe to our newsletter to be the first to
                                know about our activities.
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
                    {EMAILS.map((email) => (
                        <ListItemButton
                            key={email.id}
                            selected={email.id === selectedId}
                            onClick={() => handleSelect(email.id)}
                        >
                            <div className="mr-2 flex items-center">
                                <EmailOutlinedIcon fontSize="small" />
                            </div>
                            <ListItemText
                                primary={email.title}
                                secondary={email.subtitle}
                                slotProps={{
                                    primary: {
                                        className: "text-sm font-medium",
                                    },
                                    secondary: {
                                        className: "text-xs",
                                    },
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </aside>

            {/* Right preview */}
            <article className="flex-1 rounded-2xl border p-4 md:p-6 min-w-[290px]">
                {SelectedComponent ? (
                    <SelectedComponent />
                ) : (
                    <Paragraph>
                        Select a newsletter from the list to preview it.
                    </Paragraph>
                )}
            </article>
        </div>
    );
}
