import { LessonFrontPage } from "features/courses/components/LessonFrontPage";
import { auth } from "lib/auth/authConfig";
import { Loading } from "lib/components/animations/Loading";
import { errorMessages } from "lib/config/errorMessages";
import { dbGetUserPurchasedCourses } from "lib/database/dbFuncs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {};

export const dynamic = "force-dynamic";

export default async function LessonFrontPageRoute({
    params,
}: {
    params: { lessonSlug: string; courseSlug: string };
}) {
    const { lessonSlug, courseSlug } = await params;
    const notPurchasedRedirect = `/courses/${courseSlug}?error=${errorMessages.courseNotPurchased}`;

    if (typeof lessonSlug !== "string") {
        return redirect(`/?error=${errorMessages.missingParams}`);
    }

    const session = await auth();
    if (!session) {
        return redirect(
            `/courses/${courseSlug}?error=${errorMessages.mustBeLoggedIn}`
        );
    }

    const purchasedCourses = await dbGetUserPurchasedCourses(session.user.id);
    if (!purchasedCourses) {
        return redirect(notPurchasedRedirect);
    }
    const hasPurchased = purchasedCourses.some((purchasedCourse) => {
        return purchasedCourse.slug === courseSlug;
    });
    if (!hasPurchased) {
        return redirect(notPurchasedRedirect);
    }

    return (
        <Suspense fallback={<Loading.RingFullPage />}>
            <LessonFrontPage lessonSlug={lessonSlug} />
        </Suspense>
    );
}
