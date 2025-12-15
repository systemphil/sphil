import { CourseEnrollNowPage } from "features/courses/components/CourseEnrollNowPage";
import { LessonFrontPage } from "features/courses/components/LessonFrontPage";
import { auth } from "lib/auth/authConfig";
import { Loading } from "lib/components/animations/Loading";
import { AuthViews } from "lib/components/auth/AuthViews";
import { errorMessages } from "lib/config/errorMessages";
import { dbGetUserPurchasedCourses } from "lib/database/dbFuncs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function LessonFrontPageRoute({
    params,
}: {
    params: Promise<{ lessonSlug: string; courseSlug: string }>;
}) {
    const { lessonSlug, courseSlug } = await params;

    if (typeof lessonSlug !== "string") {
        return redirect(`/?error=${errorMessages.missingParams}`);
    }

    const session = await auth();
    if (!session) {
        return <AuthViews.MustBeLoggedIn />;
    }

    const purchasedCourses = await dbGetUserPurchasedCourses(session.user.id);
    if (!purchasedCourses) {
        return <CourseEnrollNowPage slug={courseSlug} />;
    }
    const hasPurchased = purchasedCourses.some((purchasedCourse) => {
        return purchasedCourse.slug === courseSlug;
    });
    if (!hasPurchased) {
        return <CourseEnrollNowPage slug={courseSlug} />;
    }

    return (
        <Suspense fallback={<Loading.RingFullPage />}>
            <LessonFrontPage
                lessonSlug={lessonSlug}
                userId={session.user.id}
                courseSlug={courseSlug}
            />
        </Suspense>
    );
}
