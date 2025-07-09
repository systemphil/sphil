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
        <div>
            <pre>{JSON.stringify(seminarCohortAndSeminars, null, 2)}</pre>
        </div>
    );
}
