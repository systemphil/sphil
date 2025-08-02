import { errorMessages } from "lib/config/errorMessages";
import { dbGetSeminarById } from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

export default async function AdminSeminarEdit({
    params,
}: {
    params: Promise<{
        seminarId: string | undefined;
        seminarCohortId: string | undefined;
        courseId: string | undefined;
    }>;
}) {
    const { seminarId, seminarCohortId, courseId } = await params;

    const missingParams = !seminarId || !seminarCohortId || !courseId;

    if (missingParams) {
        redirect(`/?error=${errorMessages.missingParams}`);
    }

    const seminar = await dbGetSeminarById({ id: seminarId });

    if (!seminar) {
        redirect(`/?error=${errorMessages.seminarNotFound}`);
    }

    return (
        <div>
            Cool
            <pre>{JSON.stringify(seminar, null, 2)}</pre>
        </div>
    );
}
