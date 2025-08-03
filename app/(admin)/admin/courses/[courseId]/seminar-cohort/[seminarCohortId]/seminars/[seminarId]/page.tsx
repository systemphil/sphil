import { VideoForm } from "features/courses/components/forms/VideoForm";
import { Heading } from "lib/components/ui/Heading";
import { errorMessages } from "lib/config/errorMessages";
import {
    dbGetSeminarAndConnectedById,
    dbGetSeminarVideoBySeminarId,
} from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

export default async function AdminSeminarEdit({
    params,
}: {
    params: Promise<{
        seminarId: string | undefined;
        seminarCohortId: string | undefined;
        courseId: string | undefined;
    }>;
}) {
    const { seminarId, seminarCohortId, courseId } = await params;

    const missingParams = !seminarId || !seminarCohortId || !courseId;

    if (missingParams) {
        redirect(`/?error=${errorMessages.missingParams}`);
    }

    const seminar = await dbGetSeminarAndConnectedById({ id: seminarId });

    if (!seminar) {
        redirect(`/?error=${errorMessages.seminarNotFound}`);
    }

    return (
        <div className="grid md:grid-cols-2 p-4">
            <div className="flex flex-col gap-10">
                <Heading as="h3">
                    {seminar.seminarCohort.course.name}{" "}
                    {seminar.seminarCohort.year} Seminar {seminar.order}
                </Heading>
                <div>
                    <Heading as="h4">Seminar Video</Heading>
                    <div className="flex justify-center">
                        <VideoForm
                            videoEntry={seminar.video}
                            videoKind="seminar"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-24">
                <div>
                    <Heading as="h4">Seminar Content</Heading>
                    {/* {lesson.content ? (
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
                    )} */}
                </div>

                <div>
                    <Heading as="h4">Transcript</Heading>
                    {/* {lesson.transcript ? (
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
                    )} */}
                </div>
            </div>
        </div>
    );
}
