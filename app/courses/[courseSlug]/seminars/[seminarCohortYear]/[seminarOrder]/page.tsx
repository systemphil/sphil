import { SeminarFrontPage } from "features/courses/components/SeminarFrontPage";
import { auth } from "lib/auth/authConfig";
import { Loading } from "lib/components/animations/Loading";
import { AuthViews } from "lib/components/auth/AuthViews";
import { errorMessages } from "lib/config/errorMessages";
import { dbGetSeminarAndConnectedByYearAndUser } from "lib/database/dbFuncs";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function SeminarFrontPageRoute({
    params,
}: {
    params: Promise<{
        courseSlug: string;
        seminarCohortYear: string;
        seminarOrder: string;
    }>;
}) {
    const { seminarCohortYear, courseSlug, seminarOrder } = await params;
    const missingParams = !seminarCohortYear || !courseSlug || !seminarOrder;

    if (missingParams) {
        return redirect(`/?error=${errorMessages.missingParams}`);
    }

    const session = await auth();
    if (!session) {
        return <AuthViews.MustBeLoggedIn />;
    }

    const seminar = await dbGetSeminarAndConnectedByYearAndUser({
        seminarOrder: parseInt(seminarOrder),
        userId: session.user.id,
        year: parseInt(seminarCohortYear),
    });

    if (!seminar) {
        return notFound();
    }

    return (
        <Suspense fallback={<Loading.RingFullPage />}>
            <SeminarFrontPage seminar={seminar} />
        </Suspense>
    );
}
