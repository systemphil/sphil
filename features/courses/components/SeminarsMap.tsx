"use client";

import type { Seminar } from "@prisma/client";
import { romanize } from "lib/utils";
import Link from "next/link";
import { Box, List, ListItem, ListItemButton, Divider } from "@mui/material";
import { People as PeopleIcon, Info as InfoIcon } from "@mui/icons-material";

const links = {
    courses: "/courses",
};

export function SeminarsMap({
    seminars,
    courseSlug,
    seminarCohortYear,
    isCentered = false,
    hasSeminarCohortDetails = false,
}: {
    seminars: Seminar[];
    courseSlug: string;
    seminarCohortYear: number;
    isCentered?: boolean;
    hasSeminarCohortDetails?: boolean;
}) {
    return (
        <List sx={{ maxWidth: 320, p: 0 }}>
            {hasSeminarCohortDetails && courseSlug && seminarCohortYear && (
                <ListItem disablePadding>
                    <Box sx={{ width: "100%" }}>
                        <SeminarCohortInformationLink
                            href={`${links.courses}/${courseSlug}/seminars/${seminarCohortYear}/information`}
                            isCentered={isCentered}
                        />
                        <Divider sx={{ mx: 7 }} />
                    </Box>
                </ListItem>
            )}

            {seminars.map((seminar: Seminar) => (
                <ListItem key={seminar.order} disablePadding>
                    <ListItemButton
                        component={Link}
                        href={`${links.courses}/${courseSlug}/seminars/${seminarCohortYear}/${seminar.order}`}
                        sx={{
                            borderRadius: 1,
                            p: 1,
                            transition: "all 300ms",
                            justifyContent: isCentered
                                ? "center"
                                : "flex-start",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                pl: 0.5,
                            }}
                        >
                            <PeopleIcon sx={{ width: 20, height: 20 }} />
                            <Box component="span" sx={{ ml: 1 }}>
                                {`Seminar ${romanize(seminar.order)}`}
                            </Box>
                        </Box>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}

function SeminarCohortInformationLink({
    href,
    isCentered = false,
}: {
    href: string;
    isCentered?: boolean;
}) {
    return (
        <ListItemButton
            component={Link}
            href={href}
            sx={{
                borderRadius: 1,
                p: 1,
                transition: "all 300ms",
                justifyContent: isCentered ? "center" : "flex-start",
                "&:hover": {
                    bgcolor: "mode.light.slate.200/90",
                    ".dark &": {
                        bgcolor: "mode.dark.green",
                    },
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    pl: 0.5,
                }}
            >
                <InfoIcon sx={{ width: 20, height: 20 }} />
                <Box component="span" sx={{ ml: 1 }}>
                    Information
                </Box>
            </Box>
        </ListItemButton>
    );
}
