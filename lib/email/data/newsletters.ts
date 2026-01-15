import { Newsletter_20250406_HegelSLQB1_Announcement_Web } from "../templates/Newsletter_20250406_HegelSLQB1_Announcement";
import { Newsletter_20250926_SchellingAnnouncement_Web } from "../templates/Newsletter_20250926_SchellingAnnouncement";
import { Newsletter_20251201_sPhil2026_Web } from "../templates/Newsletter_20251201_sPhil2026";
import { Newsletter_20260115_HegelMechanism_Web } from "../templates/Newsletter_20260115_HegelMechanism";

export const NEWSLETTERS = [
    {
        id: "sphil-2026-01-15",
        title: "Hegel and the Mechanistic Worldview",
        subtitle: "January 15, 2025",
        component: Newsletter_20260115_HegelMechanism_Web,
    },
    {
        id: "sphil-2026-12-01",
        title: "sPhil 2026 Calendar",
        subtitle: "December 1, 2025",
        component: Newsletter_20251201_sPhil2026_Web,
    },
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
