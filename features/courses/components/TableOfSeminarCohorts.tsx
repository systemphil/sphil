import type { Seminar } from "@prisma/client";
import { auth } from "lib/auth/authConfig";
import { Heading } from "lib/components/ui/Heading";
import {
    dbGetCourseBySlug,
    dbGetSeminarCohortsByCourseAndUser,
} from "lib/database/dbFuncs";
import { romanize } from "lib/utils";
import Link from "next/link";
import { Box, List, ListItem, ListItemButton, Divider } from "@mui/material";
import { People as PeopleIcon, Info as InfoIcon } from "@mui/icons-material";
import { SeminarCohortsDropdown } from "./SeminarCohortsDropdown";

const links = {
    courses: "/courses",
};

export async function TableOfSeminarCohorts({
    courseSlug,
    isCentered = false,
    isDropdown = false,
}: {
    courseSlug: string;
    isCentered?: boolean;
    isDropdown?: boolean;
}) {
    const session = await auth();

    if (!session) {
        return null;
    }

    const course = await dbGetCourseBySlug(courseSlug);

    if (!course) {
        console.error("SeminarCohort table expected course data");
        return null;
    }

    const seminarCohorts = await dbGetSeminarCohortsByCourseAndUser({
        courseId: course.id,
        userId: session.user.id,
    });

    if (seminarCohorts.length > 0) {
        if (isDropdown) {
            return (
                <Box sx={{ mt: 1, py: { md: 1 }, maxWidth: 320 }}>
                    <Heading as="h4">Seminars</Heading>
                    <SeminarCohortsDropdown
                        seminarCohorts={seminarCohorts}
                        courseSlug={course.slug}
                    />
                </Box>
            );
        }

        return (
            <Box sx={{ mt: 1, py: { md: 1 }, maxWidth: 320 }}>
                <Heading as="h4">Seminars</Heading>
                {seminarCohorts.map((seminarCohort) => (
                    <Box key={seminarCohort.id}>
                        <Heading as="h6">Cohort {seminarCohort.year}</Heading>
                        <SeminarsMap
                            isCentered={isCentered}
                            seminars={seminarCohort.seminars}
                            courseSlug={course.slug}
                            seminarCohortYear={seminarCohort.year}
                            hasSeminarCohortDetails={
                                seminarCohort.details ? true : false
                            }
                        />
                    </Box>
                ))}
            </Box>
        );
    }

    return null;
}

function SeminarsMap({
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
