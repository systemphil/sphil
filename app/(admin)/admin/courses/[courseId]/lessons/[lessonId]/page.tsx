import Link from "lib/components/navigation/ClientNextLink";
import {
    dbGetLessonAndRelationsById,
    dbGetVideoByLessonId,
} from "lib/database/dbFuncs";
import { Heading } from "lib/components/ui/Heading";
import { LessonForm } from "features/courses/components/forms/LessonForm";
import { CourseMaterialCard } from "features/courses/components/CourseMaterialCard";
import { VideoForm } from "features/courses/components/forms/VideoForm";
import { Button } from "@mui/material";
import { Suspense } from "react";

/**
 * Admin-gated and reads per-request data, so there is no static shell to
 * validate. `instant = false` on the admin layout does not cover descendants.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

async function AdminLessonEdit({
    courseId,
    lessonId,
}: {
    courseId: string;
    lessonId: string;
}) {
    const lesson = await dbGetLessonAndRelationsById(lessonId);

    if (!lesson) {
        return <Heading as="h2">No lesson found</Heading>;
    }

    const video = await dbGetVideoByLessonId(lessonId);

    return (
        <div className="container mx-auto my-6 px-4">
            <Heading as="h2" additionalClasses="mb-8">
                {lesson.name}
            </Heading>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
                <div className="flex flex-col gap-10">
                    <section>
                        <Heading as="h4">Lesson Details</Heading>
                        <LessonForm lesson={lesson} courseId={courseId} />
                    </section>

                    <section>
                        <Heading as="h4">Lesson Video</Heading>
                        <VideoForm
                            videoEntry={video}
                            videoKind="lesson"
                            courseSlug={lesson.course.slug}
                        />
                    </section>
                </div>

                <div className="flex flex-col gap-10">
                    <section>
                        <Heading as="h4">Lesson Content</Heading>
                        {lesson.content ? (
                            <CourseMaterialCard
                                href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-material/${lesson.content.id}`}
                                id={lesson.content.id}
                                modelName="LessonContent"
                                heading={lesson.name}
                            />
                        ) : (
                            <div className="flex flex-col gap-2 items-center">
                                <p>No content.</p>
                                <Button
                                    variant="contained"
                                    LinkComponent={Link}
                                    href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-content/new`}
                                >
                                    Add content
                                </Button>
                            </div>
                        )}
                    </section>

                    <section>
                        <Heading as="h4">Transcript</Heading>
                        {lesson.transcript ? (
                            <CourseMaterialCard
                                href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-material/${lesson.transcript.id}`}
                                id={lesson.transcript.id}
                                modelName="LessonTranscript"
                                heading={lesson.name}
                            />
                        ) : (
                            <div className="flex flex-col gap-2 items-center">
                                <p>No transcript.</p>
                                <Button
                                    variant="contained"
                                    LinkComponent={Link}
                                    href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-transcript/new`}
                                >
                                    Add transcript
                                </Button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default async function AdminLessonEditPage({
    params,
}: {
    params: Promise<{ courseId: string; lessonId: string }>;
}) {
    const { lessonId, courseId } = await params;
    if (typeof lessonId !== "string" || typeof courseId !== "string") {
        throw new Error("missing course or lesson id");
    }

    return (
        <Suspense>
            <AdminLessonEdit courseId={courseId} lessonId={lessonId} />
        </Suspense>
    );
}
