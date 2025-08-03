import Link from "next/link";
import {
    dbGetLessonAndRelationsById,
    dbGetVideoByLessonId,
} from "lib/database/dbFuncs";
import { Heading } from "lib/components/ui/Heading";
import { LessonForm } from "features/courses/components/forms/LessonForm";
import { CourseMaterialCard } from "features/courses/components/CourseMaterialCard";
import { VideoForm } from "features/courses/components/forms/VideoForm";

export const metadata = {};

export default async function AdminLessonEdit({
    params,
}: {
    params: { courseId: string; lessonId: string };
}) {
    const { lessonId, courseId } = await params;
    if (typeof lessonId !== "string" || typeof courseId !== "string") {
        throw new Error("missing course or lesson id");
    }

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
                            <Link
                                href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-content/new`}
                            >
                                <button className="d-btn d-btn-primary">
                                    Add content
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                <div>
                    <Heading as="h4">Lesson Video</Heading>
                    <VideoForm videoEntry={video} videoKind="lesson" />
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
                            <Link
                                href={`/admin/courses/${courseId}/lessons/${lessonId}/lesson-transcript/new`}
                            >
                                <button className="d-btn d-btn-primary">
                                    Add content
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
