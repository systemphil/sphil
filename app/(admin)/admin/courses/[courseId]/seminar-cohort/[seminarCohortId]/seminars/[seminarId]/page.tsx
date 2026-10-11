import { Button } from "@mui/material";
import { CourseMaterialCard } from "features/courses/components/CourseMaterialCard";
import { VideoForm } from "features/courses/components/forms/VideoForm";
import { Heading } from "lib/components/ui/Heading";
import { errorMessages } from "lib/config/errorMessages";
import { dbGetSeminarAndConnectedById } from "lib/database/dbFuncs";
import Link from "lib/components/navigation/ClientNextLink";
import { redirect } from "next/navigation";

/**
 * Admin-gated and reads per-request data, so there is no static shell to
 * validate. `instant = false` on the admin layout does not cover descendants.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

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
        <div className="container mx-auto my-6 px-4">
            <Heading as="h2" additionalClasses="mb-8">
                {seminar.seminarCohort.course.name} {seminar.seminarCohort.year}{" "}
                Seminar {seminar.order}
            </Heading>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
                <section>
                    <Heading as="h4">Seminar Video</Heading>
                    <VideoForm
                        videoEntry={seminar.video}
                        videoKind="seminar"
                        courseSlug={seminar.seminarCohort.course.slug}
                    />
                </section>

                <div className="flex flex-col gap-10">
                    <section>
                        <Heading as="h4">Seminar Content</Heading>
                        {seminar.content ? (
                            <CourseMaterialCard
                                href={`/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminars/${seminarId}/seminar-material/${seminar.content.id}`}
                                id={seminar.content.id}
                                modelName="SeminarContent"
                                heading={`Content of Seminar ${seminar.order}`}
                            />
                        ) : (
                            <div className="flex flex-col gap-2 items-center">
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
                    </section>

                    <section>
                        <Heading as="h4">Seminar Transcript</Heading>
                        {seminar.transcript ? (
                            <CourseMaterialCard
                                href={`/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminars/${seminarId}/seminar-material/${seminar.transcript.id}`}
                                id={seminar.transcript.id}
                                modelName="SeminarTranscript"
                                heading={`Transcript of Seminar ${seminar.order}`}
                            />
                        ) : (
                            <div className="flex flex-col gap-2 items-center">
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
                    </section>
                </div>
            </div>
        </div>
    );
}
