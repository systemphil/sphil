import { MDXRenderer } from "lib/components/MDXRenderer";
import { dbGetSeminarAndConnectedByYearAndUser } from "lib/database/dbFuncs";
import { Heading } from "lib/components/ui/Heading";
import { VideoDataLoader } from "lib/components/VideoDataLoader";
import { Suspense } from "react";
import { Loading } from "lib/components/animations/Loading";
import { Paragraph } from "lib/components/ui/Paragraph";
import { Back } from "lib/components/navigation/Back";
import { TableOfSeminarCohorts } from "./TableOfSeminarCohorts";

export async function SeminarFrontPage({
    seminar,
}: {
    seminar: NonNullable<
        Awaited<ReturnType<typeof dbGetSeminarAndConnectedByYearAndUser>>
    >;
}) {
    const md = "md:grid md:grid-cols-4 md:items-start";
    const lg = "lg:grid-cols-6";
    const xl = "";
    const xxl = "2xl:px-20";

    return (
        <div
            className={`flex flex-col justify-center items-center ${md} ${lg} ${xl} ${xxl} mb-20 min-h-screen`}
        >
            <div className="min-h-[500px] flex flex-col w-full md:col-span-3 md:order-2">
                {seminar.video ? (
                    <Suspense fallback={<Loading.SkeletonFullPage />}>
                        <VideoDataLoader videoEntry={seminar.video} />
                    </Suspense>
                ) : (
                    <div>Video content not ready. Please come back later</div>
                )}
                <div className="max-h-[300px] md:max-h-[500px] lg:max-h-full mt-2 overflow-auto">
                    {seminar?.transcript?.mdxCompiled ? (
                        <MDXRenderer
                            data={seminar.transcript.mdxCompiled}
                            isFullWidth
                        />
                    ) : (
                        <div x-data-label="No transcript available"></div>
                    )}
                </div>
            </div>
            <div className="md:col-span-1 md:p-2 md:order-1 flex justify-end w-full">
                <div className="lg:fixed w-full md:max-w-[175px] 2xl:max-w-[300px] lg:pr-2 my-2">
                    <div className="flex md:flex-col justify-evenly flex-wrap md:flex-nowrap">
                        <Back
                            href={`/courses/${seminar.seminarCohort.course.slug}`}
                            text={`Back to ${seminar.seminarCohort.course.name}`}
                        />
                        <TableOfSeminarCohorts
                            courseSlug={seminar.seminarCohort.course.slug}
                            isCentered
                        />
                    </div>
                </div>
            </div>
            <div className="w-full px-2 md:px-0 md:w-auto md:col-span-4 md:m-4 md:order-3 lg:col-span-2">
                <div className="py-3">
                    <Heading as="h3">Seminar {seminar.order}</Heading>
                    <Paragraph className="!text-center">
                        {seminar.seminarCohort.course.name}{" "}
                        {seminar.seminarCohort.year}
                    </Paragraph>
                </div>

                {seminar?.content?.mdxCompiled ? (
                    <MDXRenderer
                        data={seminar.content.mdxCompiled}
                        isFullWidth
                    />
                ) : (
                    <div x-data-label="No content available"></div>
                )}
            </div>
        </div>
    );
}
