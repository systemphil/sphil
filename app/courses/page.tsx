import { CoursesDisplay } from "features/courses/components/CoursesDisplay";
import { FadeIn } from "lib/components/animations/FadeIn";
import { Loading } from "lib/components/animations/Loading";
import { Heading } from "lib/components/ui/Heading";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { dbGetAllPublishedCourses } from "lib/database/dbFuncs";
import { Suspense } from "react";

export const metadata = {};

export async function generateStaticParams() {
    const courses = await dbGetAllPublishedCourses();

    return courses.map((c) => ({
        courseSlug: c.slug,
    }));
}

export default async function CoursesPage() {
    return (
        <PageWrapper>
            <div className="my-16">
                <Heading>Join the Symposia</Heading>
            </div>

            <FadeIn>
                <Suspense fallback={<Loading.RingLg />}>
                    <CoursesDisplay />
                </Suspense>
            </FadeIn>
        </PageWrapper>
    );
}
