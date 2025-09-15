import { redirect } from "next/navigation";
import { TableOfLessons } from "./TableOfLessons";
import { MDXRenderer } from "lib/components/MDXRenderer";
import { errorMessages } from "lib/config/errorMessages";
import {
    cache,
    CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS,
    cacheKeys,
} from "lib/server/cache";
import { dbGetLessonAndRelationsBySlug } from "lib/database/dbFuncs";
import { Heading } from "lib/components/ui/Heading";
import { VideoDataLoader } from "lib/components/VideoDataLoader";
import { Suspense } from "react";
import { Loading } from "lib/components/animations/Loading";
import { Paragraph } from "lib/components/ui/Paragraph";
import { Back } from "lib/components/navigation/Back";

export async function LessonFrontPage({ lessonSlug }: { lessonSlug: string }) {
    const getLessonAndRelationsBySlug = cache(
        async (slug: string) => {
            return await dbGetLessonAndRelationsBySlug(slug);
        },
        [cacheKeys.allPublicCourses, lessonSlug],
        { revalidate: CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS }
    );
    const lessonData = await getLessonAndRelationsBySlug(lessonSlug);
    if (!lessonData) {
        return redirect(`/courses?error=${errorMessages.lessonNotFound}`);
    }

    const md = "md:grid md:grid-cols-4 md:items-start";
    const lg = "lg:grid-cols-6";
    const xl = "";
    const xxl = "2xl:px-20";

    return (
        <div
            className={`flex flex-col justify-center items-center ${md} ${lg} ${xl} ${xxl} mb-20`}
        >
            <div className="min-h-[500px] flex flex-col w-full md:col-span-3 md:order-2">
                {lessonData.video ? (
                    <Suspense fallback={<Loading.SkeletonFullPage />}>
                        <VideoDataLoader videoEntry={lessonData.video} />
                    </Suspense>
                ) : (
                    <div>Video content not ready. Please come back later</div>
                )}
                <div className="max-h-[300px] md:max-h-[500px] lg:max-h-full mt-2 overflow-auto">
                    {lessonData?.transcript?.mdxCompiled ? (
                        <MDXRenderer
                            data={lessonData.transcript.mdxCompiled}
                            isFullWidth
                        />
                    ) : (
                        <div>No transcript available</div>
                    )}
                </div>
            </div>
            <div className="md:col-span-1 md:p-2 md:order-1 flex justify-end w-full">
                <div className="lg:fixed w-full md:max-w-[175px] 2xl:max-w-[300px] lg:pr-2 my-2">
                    <div className="flex md:flex-col justify-evenly flex-wrap md:flex-nowrap">
                        <Back
                            href={`/symposia/courses/${lessonData.course.slug}`}
                            text={`Back to ${lessonData.course.name}`}
                        />
                        <TableOfLessons
                            lessons={lessonData.course.lessons}
                            courseSlug={lessonData.course.slug}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full px-2 md:px-0 md:w-auto md:col-span-4 md:m-4 md:order-3 lg:col-span-2">
                <div className="py-3">
                    <Heading as="h3">{lessonData.name}</Heading>
                    <Paragraph className="!text-center">
                        {lessonData.description}
                    </Paragraph>
                </div>

                {lessonData?.content?.mdxCompiled ? (
                    <MDXRenderer
                        data={lessonData.content.mdxCompiled}
                        isFullWidth
                    />
                ) : (
                    <div>Lesson content not ready. Please come back later</div>
                )}
            </div>
        </div>
    );
}
