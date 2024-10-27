import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { FadeIn } from "lib/components/animations/FadeIn";
import { Loading } from "lib/components/animations/Loading";
import { CourseFrontPage } from "features/courses/components/CourseFrontPage";
import { errorMessages } from "lib/config/errorMessages";

export default async function CourseFrontPageRoute({
    params,
}: {
    params: { courseSlug: string };
}) {
    const { courseSlug: slug } = await params;

    if (typeof slug !== "string") {
        return redirect(`/?error=${errorMessages.missingParams}`);
    }

    return (
        <PageWrapper>
            <FadeIn>
                <Suspense fallback={<Loading.Ball />}>
                    <CourseFrontPage slug={slug} />
                </Suspense>
            </FadeIn>
        </PageWrapper>
    );
}
