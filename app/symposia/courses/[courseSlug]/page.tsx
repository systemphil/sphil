import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { Loading } from "lib/components/animations/Loading";
import { CourseFrontPage } from "features/courses/components/CourseFrontPage";
import { errorMessages } from "lib/config/errorMessages";

export const metadata = {};

export const dynamic = "force-dynamic";

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
            <Suspense fallback={<Loading.RingFullPage />}>
                <CourseFrontPage slug={slug} />
            </Suspense>
        </PageWrapper>
    );
}
