import { redirect } from "next/navigation";
import Image from "next/image";
import { dbGetCourseBySlug } from "lib/database/dbFuncs";
import { MDXRenderer } from "lib/components/MDXRenderer";
import { CourseEnroll } from "./CourseEnroll";
import { errorMessages } from "lib/config/errorMessages";
import { TableOfLessons } from "./TableOfLessons";
import { Heading } from "lib/components/ui/Heading";
import { FadeIn } from "lib/components/animations/FadeIn";
import { Back } from "lib/components/navigation/Back";
import { TableOfSeminarCohorts } from "./TableOfSeminarCohorts";
import { Suspense } from "react";

const links = {
    courses: "/symposia/courses",
};

export async function CourseFrontPage({ slug }: { slug: string }) {
    const course = await dbGetCourseBySlug(slug);

    if (!course) {
        return redirect(`/courses?error=${errorMessages.courseNotFound}`);
    }

    return (
        <FadeIn className="w-full">
            <div className="flex flex-col justify-center items-center py-10">
                <div className="flex justify-center gap-10 flex-wrap">
                    <div className="flex flex-col">
                        <Back href={links.courses} text="Back to courses" />
                        <div className="flex flex-col grow items-center justify-center">
                            <Heading>{course.name}</Heading>
                            <Heading as="h6">{course.description}</Heading>
                        </div>
                    </div>

                    {course.imageUrl && (
                        <div className="">
                            <Image
                                priority={true}
                                className="rounded-md"
                                src={course.imageUrl}
                                alt={`Course preview ${course.name}`}
                                width={800}
                                height={240}
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-10 flex-wrap mt-5 md:grid md:grid-cols-5 relative">
                    <div className="max-w-[800px] md:col-span-3 md:col-start-1 lg:col-start-2 flex justify-center">
                        {course?.details?.mdxCompiled ? (
                            <MDXRenderer data={course.details.mdxCompiled} />
                        ) : (
                            <div>No course details</div>
                        )}
                    </div>

                    <div className="flex flex-col justify-start items-center md:pt-8 gap-4 md:col-start-5">
                        <div className="md:sticky top-3">
                            <TableOfLessons
                                lessons={course.lessons}
                                courseSlug={slug}
                            />
                            <Suspense>
                                <TableOfSeminarCohorts
                                    courseSlug={slug}
                                    isCentered={false}
                                    isDropdown
                                />
                            </Suspense>
                            {course.infoboxDescription ? (
                                <Infobox
                                    infoboxTitle={course.infoboxTitle}
                                    infoboxDescription={
                                        course.infoboxDescription
                                    }
                                />
                            ) : null}
                            <Suspense>
                                <CourseEnroll slug={slug} />
                            </Suspense>
                            <div className="mt-4">
                                <Back
                                    href={links.courses}
                                    text="Back to courses"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}

function Infobox({
    infoboxTitle,
    infoboxDescription,
}: {
    infoboxTitle?: string | null;
    infoboxDescription: string;
}) {
    return (
        <div className="border w-[300px] md:w-[200px] xl:w-[280px] flex flex-col justify-center items-center p-3 gap-2 mb-2">
            <Heading
                as="h4"
                replacementClasses="text-primary dark:text-acid-green"
            >
                {infoboxTitle || "❗ Info"}
            </Heading>
            <p className="text-md text-slate-600 dark:text-gray-300 px-2">
                {infoboxDescription}
            </p>
        </div>
    );
}
