import { CourseMaterialCard } from "features/courses/components/CourseMaterialCard";
import { CourseSeminarsSortable } from "features/courses/components/CourseSeminarsSortable";
import { SeminarCohortForm } from "features/courses/components/forms/SeminarCohortForm";
import { SeminarCreateNewButton } from "features/courses/components/SeminarCreateNewButton";
import { SeminarParticipantsTable } from "features/courses/components/tables/SeminarParticipantsTable";
import { Heading } from "lib/components/ui/Heading";
import { errorMessages } from "lib/config/errorMessages";
import { dbGetSeminarCohortAndSeminarsById } from "lib/database/dbFuncs";
import Link from "next/link";
import { redirect } from "next/navigation";

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

    const seminarCohortAndSeminars = await dbGetSeminarCohortAndSeminarsById({
        id: seminarCohortId,
    });

    if (!seminarCohortAndSeminars) {
        redirect(`/?error=${errorMessages.seminarCohortNotFound}`);
    }

    return (
        <div className="grid md:grid-cols-2 p-4">
            <div>
                <Heading as="h2">
                    Seminar Cohort {seminarCohortAndSeminars.year}{" "}
                </Heading>
                <Heading as="h4">
                    {seminarCohortAndSeminars.course.name}
                </Heading>
                <SeminarCohortForm seminarCohort={seminarCohortAndSeminars} />
                <div className="pr-10 pt-6">
                    <SeminarParticipantsTable
                        users={seminarCohortAndSeminars.participants}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div>
                    <div>
                        <Heading as="h4">Seminar Cohort Details</Heading>
                        {seminarCohortAndSeminars.details ? (
                            <CourseMaterialCard
                                href={`/admin/courses/${courseId}/seminar-cohort/${seminarCohortAndSeminars.id}/seminar-cohort-details/${seminarCohortAndSeminars.details.id}`}
                                heading="General details of the course"
                                id={seminarCohortAndSeminars.details.id}
                                modelName="CourseDetails"
                            />
                        ) : (
                            <div>
                                <p>None yet.</p>
                                <Link
                                    href={`/admin/courses/${courseId}/seminar-cohort/${seminarCohortAndSeminars.id}/seminar-cohort-details/new`}
                                >
                                    <button className="d-btn d-btn-primary">
                                        Add details
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div>
                        <Heading as="h4">Seminars</Heading>
                        {seminarCohortAndSeminars.seminars.length > 0 ? (
                            <CourseSeminarsSortable
                                courseId={courseId}
                                seminarCohortId={seminarCohortId}
                                seminars={seminarCohortAndSeminars.seminars}
                            />
                        ) : (
                            <div className="flex justify-center py-2">
                                <p>None yet.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <SeminarCreateNewButton
                            courseId={courseId}
                            seminarCohortId={seminarCohortId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
