import { LessonForm } from "features/courses/components/forms/LessonForm";
import { Heading } from "lib/components/ui/Heading";
import { PageWrapper } from "lib/components/ui/PageWrapper";

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
