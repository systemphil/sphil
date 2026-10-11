import { LessonForm } from "features/courses/components/forms/LessonForm";
import { Heading } from "lib/components/ui/Heading";
import { PageWrapper } from "lib/components/ui/PageWrapper";

/**
 * Admin-gated and reads per-request data, so there is no static shell to
 * validate. `instant = false` on the admin layout does not cover descendants.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

export const metadata = {};

export default async function NewLesson({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    return (
        <PageWrapper>
            <Heading as="h1">New Lesson</Heading>
            <LessonForm courseId={courseId} />
        </PageWrapper>
    );
}
