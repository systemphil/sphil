import { auth } from "lib/auth/authConfig";
import { Heading } from "lib/components/ui/Heading";
import {
    dbGetCourseDataCache,
    dbGetSeminarCohortsDataCache,
} from "lib/database/dbFuncs";
import { Box } from "@mui/material";
import { SeminarCohortsDropdown } from "./SeminarCohortsDropdown";
import { SeminarsMap } from "./SeminarsMap";

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

    const course = await dbGetCourseDataCache(courseSlug);

    if (!course) {
        console.error("SeminarCohort table expected course data");
        return null;
    }

    const seminarCohorts = await dbGetSeminarCohortsDataCache({
        courseSlug,
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
                            hasSeminarCohortDetails={!!seminarCohort.details}
                        />
                    </Box>
                ))}
            </Box>
        );
    }

    return null;
}
