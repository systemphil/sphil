import { CoursesDisplay } from "features/courses/components/CoursesDisplay";
import { FadeIn } from "lib/components/animations/FadeIn";
import { Loading } from "lib/components/animations/Loading";
import { Heading } from "lib/components/ui/Heading";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { Suspense } from "react";

export default async function CoursesPage() {
    return (
        <PageWrapper>
            <div className="my-16">
                <Heading>Available Courses</Heading>
            </div>

            <FadeIn>
                <Suspense fallback={<Loading.Ball />}>
                    <CoursesDisplay />
                </Suspense>
            </FadeIn>
        </PageWrapper>
    );
}