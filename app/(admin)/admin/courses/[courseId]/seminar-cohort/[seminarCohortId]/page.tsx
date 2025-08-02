import { SeminarCohortForm } from "features/courses/components/forms/SeminarCohortForm";
import { SeminarParticipantsTable } from "features/courses/components/tables/SeminarParticipantsTable";
import { Heading } from "lib/components/ui/Heading";
import { errorMessages } from "lib/config/errorMessages";
import { dbGetSeminarCohortAndSeminarsById } from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

export default async function AdminSeminarCohortEdit({
    params,
}: {
    params: Promise<{ seminarCohortId: string | undefined }>;
}) {
    const { seminarCohortId } = await params;
    if (typeof seminarCohortId !== "string") {
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
                <div className="pr-10">
                    <SeminarParticipantsTable
                        users={seminarCohortAndSeminars.participants}
                    />
                </div>
            </div>

            <pre>{JSON.stringify(seminarCohortAndSeminars, null, 2)}</pre>
        </div>
    );
}
