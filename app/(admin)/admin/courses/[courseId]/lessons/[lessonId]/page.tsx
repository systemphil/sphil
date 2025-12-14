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
        <div className="grid md:grid-cols-2 p-4">
            <div>
                <Heading as="h2">{lesson.name}</Heading>
                <LessonForm lesson={lesson} courseId={courseId} />
            </div>

            <div className="flex flex-col gap-24">
                <div>
                    <Heading as="h4">Lesson Content</Heading>
                    {lesson.content ? (
                        <CourseMaterialCard
                            href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-material/${lesson.content.id}`}
                            id={lesson.content.id}
                            modelName="LessonContent"
                            heading={lesson.name}
                        />
                    ) : (
                        <div>
                            <Heading as="h2">No content.</Heading>
                            <Button
                                variant="contained"
                                LinkComponent={Link}
                                href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-content/new`}
                            >
                                Add content
                            </Button>
                        </div>
                    )}
                </div>

                <div>
                    <Heading as="h4">Lesson Video</Heading>
                    <div className="flex flex-col justify-center items-center">
                        <VideoForm
                            videoEntry={video}
                            videoKind="lesson"
                            courseSlug={lesson.course.slug}
                        />
                    </div>
                </div>

                <div>
                    <Heading as="h4">Transcript</Heading>
                    {lesson.transcript ? (
                        <CourseMaterialCard
                            href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-material/${lesson.transcript.id}`}
                            id={lesson.transcript.id}
                            modelName="LessonTranscript"
                            heading={lesson.name}
                        />
                    ) : (
                        <div>
                            <Heading as="h2">No transcript.</Heading>
                            <Button
                                variant="contained"
                                LinkComponent={Link}
                                href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-transcript/new`}
                            >
                                Add transcript
                            </Button>
                        </div>
                    )}
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
