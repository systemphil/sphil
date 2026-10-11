import { connection } from "next/server";
import { Button } from "@mui/material";
import { CourseMaterialCard } from "features/courses/components/CourseMaterialCard";
import { CourseSeminarsSortable } from "features/courses/components/CourseSeminarsSortable";
import { SeminarCohortForm } from "features/courses/components/forms/SeminarCohortForm";
import { SeminarCreateNewButton } from "features/courses/components/SeminarCreateNewButton";
import { SeminarParticipantsTable } from "features/courses/components/tables/SeminarParticipantsTable";
import { auth } from "lib/auth/authConfig";
import { determineAdminCourseAccess } from "lib/auth/authFuncs";
import { Heading } from "lib/components/ui/Heading";
import { errorMessages } from "lib/config/errorMessages";
import {
    dbGetCourseAndDetailsAndLessonsById,
    dbGetSeminarCohortAndSeminarsById,
} from "lib/database/dbFuncs";
import Link from "lib/components/navigation/ClientNextLink";
import { redirect } from "next/navigation";

/**
 * Admin-gated and reads per-request data, so there is no static shell to
 * validate. `instant = false` on the admin layout does not cover descendants.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

export default async function AdminSeminarCohortEdit({
    params,
}: {
    params: Promise<{
        seminarCohortId: string | undefined;
        courseId: string | undefined;
    }>;
}) {
    const { seminarCohortId, courseId } = await params;
    if (typeof seminarCohortId !== "string" || typeof courseId !== "string") {
        redirect(`/?error=${errorMessages.missingParams}`);
    }

    // auth() reads the current time; mark the render as per-request first.
    // @see https://nextjs.org/docs/messages/blocking-prerender-current-time
    await connection();
    const session = await auth();

    if (!session) {
        redirect(`/?error=${errorMessages.missingSession}`);
    }

    const seminarCohortAndSeminars = await dbGetSeminarCohortAndSeminarsById({
        id: seminarCohortId,
    });

    if (!seminarCohortAndSeminars) {
        redirect(`/?error=${errorMessages.seminarCohortNotFound}`);
    }

    const course = await dbGetCourseAndDetailsAndLessonsById(courseId);

    if (!course) {
        redirect(`/?error=${errorMessages.courseNotFound}`);
    }

    const { courseAccess, seminarAccess } = determineAdminCourseAccess(
        session,
        course
    );

    return (
        <div className="container mx-auto my-6 px-4">
            <div className="mb-8">
                <Heading as="h2">
                    Seminar Cohort {seminarCohortAndSeminars.year}
                </Heading>
                <p className="text-center text-lg text-gray-600 dark:text-gray-300">
                    {seminarCohortAndSeminars.course.name}
                </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 items-start">
                {courseAccess && (
                    <div className="flex flex-col gap-10">
                        <section>
                            <Heading as="h4">Cohort Settings</Heading>
                            <SeminarCohortForm
                                seminarCohort={seminarCohortAndSeminars}
                            />
                        </section>

                        <section>
                            <Heading as="h4">Participants</Heading>
                            <SeminarParticipantsTable
                                users={seminarCohortAndSeminars.participants}
                            />
                        </section>
                    </div>
                )}

                <div className="flex flex-col gap-10">
                    {courseAccess && (
                        <section>
                            <Heading as="h4">Seminar Cohort Details</Heading>
                            {seminarCohortAndSeminars.details ? (
                                <CourseMaterialCard
                                    href={`/admin/courses/${courseId}/seminar-cohort/${seminarCohortAndSeminars.id}/seminar-cohort-details/${seminarCohortAndSeminars.details.id}`}
                                    heading="General details of the course"
                                    id={seminarCohortAndSeminars.details.id}
                                    modelName="SeminarCohortDetails"
                                />
                            ) : (
                                <div className="flex flex-col gap-2 items-center">
                                    <p>No details.</p>
                                    <Button
                                        variant="contained"
                                        LinkComponent={Link}
                                        href={`/admin/courses/${courseId}/seminar-cohort/${seminarCohortAndSeminars.id}/seminar-cohort-details/new`}
                                    >
                                        Add details
                                    </Button>
                                </div>
                            )}
                        </section>
                    )}

                    {seminarAccess && (
                        <section className="flex flex-col gap-4">
                            <Heading as="h4">Seminars</Heading>
                            {seminarCohortAndSeminars.seminars.length > 0 ? (
                                <CourseSeminarsSortable
                                    courseId={courseId}
                                    seminarCohortId={seminarCohortId}
                                    seminars={seminarCohortAndSeminars.seminars}
                                />
                            ) : (
                                <p className="text-center">None yet.</p>
                            )}
                            <div className="flex justify-center">
                                <SeminarCreateNewButton
                                    courseId={courseId}
                                    seminarCohortId={seminarCohortId}
                                />
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
