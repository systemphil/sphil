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

const EMAILS = [
    {
        id: "schelling-2025-09-26",
        title: "Schelling Announcement",
        subtitle: "September 26, 2025",
        icon: <EmailOutlinedIcon fontSize="small" />,
        component: Newsletter_20250926_SchellingAnnouncement_Web,
    },
    // Example for future templates:
    // {
    //     id: "kant-2025-10-10",
    //     title: "Kant: Critique of Pure Reason",
    //     subtitle: "October 10, 2025",
    //     icon: <MarkEmailUnreadOutlinedIcon fontSize="small" />,
    //     component: Newsletter_20251010_Kant_Web,
    // },
];

type EmailId = (typeof EMAILS)[number]["id"];

export function NewsletterBrowser() {
    const [selectedId, setSelectedId] = useState<EmailId>(EMAILS[0]?.id);

    const selectedEmail = EMAILS.find((email) => email.id === selectedId);
    const SelectedComponent = selectedEmail?.component ?? null;

    return (
        <div className="mt-8 flex w-full max-w-5xl gap-6">
            {/* Left menu */}
            <aside className="w-64 shrink-0 rounded-2xl border backdrop-blur-sm">
                <List
                    dense
                    subheader={
                        <ListSubheader
                            component="div"
                            className="!bg-transparent p-2 pt-3"
                        >
                            <Typography variant="body2">
                                Subscribe to our newsletter to stay up to date
                                on new events.
                            </Typography>
                            <div className="max-w-[500px] mt-2">
                                <SubscribeToNewsletterForm />
                            </div>
                            Previous newsletters
                        </ListSubheader>
                    }
                >
                    {EMAILS.map((email) => (
                        <ListItemButton
                            key={email.id}
                            selected={email.id === selectedId}
                            onClick={() => setSelectedId(email.id)}
                        >
                            <div className="mr-2 flex items-center">
                                {email.icon}
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
            <main className="flex-1 overflow-auto rounded-2xl border  p-4 md:p-6">
                {SelectedComponent ? (
                    <SelectedComponent />
                ) : (
                    <Paragraph>
                        Select a newsletter from the list to preview it.
                    </Paragraph>
                )}
            </main>
        </div>
    );
}
