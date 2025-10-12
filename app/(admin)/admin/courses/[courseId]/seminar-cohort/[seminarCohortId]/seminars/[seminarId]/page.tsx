import { Button } from "@mui/material";
import { CourseMaterialCard } from "features/courses/components/CourseMaterialCard";
import { VideoForm } from "features/courses/components/forms/VideoForm";
import { Heading } from "lib/components/ui/Heading";
import { errorMessages } from "lib/config/errorMessages";
import { dbGetSeminarAndConnectedById } from "lib/database/dbFuncs";
import Link from "next/link";
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
                    {seminar.content ? (
                        <CourseMaterialCard
                            href={`/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminars/${seminarId}/seminar-material/${seminar.content.id}`}
                            id={seminar.content.id}
                            modelName="SeminarContent"
                            heading={`Content of Seminar ${seminar.order}`}
                        />
                    ) : (
                        <div className="flex flex-col gap-2 justify-center items-center">
                            <p>No content.</p>
                            <Button
                                variant="contained"
                                LinkComponent={Link}
                                href={`/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminars/${seminarId}/seminar-content/new`}
                            >
                                Add content
                            </Button>
                        </div>
                    )}
                </div>

                <div>
                    <Heading as="h4">Seminar Transcript</Heading>
                    {seminar.transcript ? (
                        <CourseMaterialCard
                            href={`/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminars/${seminarId}/seminar-material//${seminar.transcript.id}`}
                            id={seminar.transcript.id}
                            modelName="LessonTranscript"
                            heading={`Transcript of Seminar ${seminar.order}`}
                        />
                    ) : (
                        <div className="flex flex-col gap-2 justify-center items-center">
                            <p>No transcript.</p>
                            <Button
                                variant="contained"
                                LinkComponent={Link}
                                href={`/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminars/${seminarId}/seminar-transcript/new`}
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
