import { SeminarCohortDetailsFrontPage } from "features/courses/components/SeminarCohortDetailsFrontPage";
import { auth } from "lib/auth/authConfig";
import { Loading } from "lib/components/animations/Loading";
import { AuthViews } from "lib/components/auth/AuthViews";
import { errorMessages } from "lib/config/errorMessages";
import {
    dbGetCourseDataCache,
    dbGetSeminarCohortDataCache,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function SeminarCohortInformationPage({
    params,
}: {
    params: Promise<{
        courseSlug: string;
        seminarCohortYear: string;
    }>;
}) {
    const { seminarCohortYear, courseSlug } = await params;
    const missingParams = !seminarCohortYear || !courseSlug;

    if (missingParams) {
        return redirect(`/?error=${errorMessages.missingParams}`);
    }

    const session = await auth();
    if (!session) {
        return <AuthViews.MustBeLoggedIn />;
    }

    const course = await dbGetCourseDataCache(courseSlug);
    if (!course) {
        return redirect(`/?error=${errorMessages.courseNotFound}`);
    }

    const seminarCohort = await dbGetSeminarCohortDataCache({
        year: parseInt(seminarCohortYear, 10),
        courseSlug,
        courseId: course.id,
        userId: session.user.id,
    });

    if (!seminarCohort) {
        return redirect(`/?error=${errorMessages.seminarCohortNotFound}`);
    }
    if (!seminarCohort.details) {
        return redirect(
            `/?error=${errorMessages.seminarCohortDetailsNotFound}`
        );
    }

    return (
        <Suspense fallback={<Loading.RingFullPage />}>
            <SeminarCohortDetailsFrontPage seminarCohort={seminarCohort} />
        </Suspense>
    );
}
