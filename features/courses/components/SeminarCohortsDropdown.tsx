"use client";

import { useState, MouseEvent } from "react";
import { Seminar } from "@prisma/client";
import { Heading } from "lib/components/ui/Heading";
import { romanize } from "lib/utils";
import Link from "next/link";
import { Button, Menu, MenuItem, Box, Divider } from "@mui/material";
import { People as PeopleIcon, Info as InfoIcon } from "@mui/icons-material";
import { dbGetSeminarCohortsByCourseAndUser } from "lib/database/dbFuncs";

const links = {
    courses: "/courses",
};

interface SeminarCohortsDropdownProps {
    seminarCohorts: Awaited<
        ReturnType<typeof dbGetSeminarCohortsByCourseAndUser>
    >;
    courseSlug: string;
}

export function SeminarCohortsDropdown({
    seminarCohorts,
    courseSlug,
}: SeminarCohortsDropdownProps) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {seminarCohorts.map((seminarCohort, index) => (
                <CohortDropdownButton
                    // eslint-disable-next-line @eslint-react/no-array-index-key
                    key={`${seminarCohort.year}-${index}`}
                    seminarCohort={seminarCohort}
                    courseSlug={courseSlug}
                />
            ))}
        </Box>
    );
}

function CohortDropdownButton({
    seminarCohort,
    courseSlug,
}: {
    seminarCohort: Awaited<
        ReturnType<typeof dbGetSeminarCohortsByCourseAndUser>
    >[number];
    courseSlug: string;
}) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
                sx={{ m: 1 }}
            >
                <Heading as="h6" replacementClasses="!text-stone-200">
                    Cohort {seminarCohort.year}
                </Heading>
            </Button>
            <Menu
                disableScrollLock={true}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 208,
                        },
                    },
                }}
            >
                {seminarCohort.details && (
                    <Box>
                        <MenuItem
                            component={Link}
                            href={`${links.courses}/${courseSlug}/seminars/${seminarCohort.year}/information`}
                            onClick={handleClose}
                            sx={{
                                ".dark &:hover": {
                                    bgcolor: "mode.dark.green",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <InfoIcon sx={{ width: 20, height: 20 }} />
                                <Box component="span" sx={{ ml: 1 }}>
                                    Information
                                </Box>
                            </Box>
                        </MenuItem>
                        <Divider />
                    </Box>
                )}

                {seminarCohort.seminars.map((seminar: Seminar) => (
                    <MenuItem
                        key={seminar.order}
                        component={Link}
                        href={`${links.courses}/${courseSlug}/seminars/${seminarCohort.year}/${seminar.order}`}
                        onClick={handleClose}
                        sx={{
                            ".dark &:hover": {
                                bgcolor: "mode.dark.green",
                            },
                        }}
                        className=""
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <PeopleIcon sx={{ width: 20, height: 20 }} />
                            <Box component="span" sx={{ ml: 1 }}>
                                {`Seminar ${romanize(seminar.order)}`}
                            </Box>
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
