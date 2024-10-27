import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { dbGetCourseBySlug } from "lib/database/dbFuncs";
import { MDXRenderer } from "lib/components/MDXRenderer";
import { cache, CACHE_REVALIDATION_INTERVAL } from "lib/server/cache";
import { CourseEnroll } from "./CourseEnroll";
import { errorMessages } from "lib/config/errorMessages";
import { TableOfLessons } from "./TableOfLessons";
import { Heading } from "lib/components/ui/Heading";
import { FadeIn } from "lib/components/animations/FadeIn";

const links = {
    courses: "/symposia/courses",
};

export async function CourseFrontPage({ slug }: { slug: string }) {
    const getCourseBySlug = cache(
        async (slug) => {
            return await dbGetCourseBySlug(slug);
        },
        ["/courses", slug],
        { revalidate: CACHE_REVALIDATION_INTERVAL }
    );
    const course = await getCourseBySlug(slug);

    if (!course) {
        return redirect(`/courses?error=${errorMessages.courseNotFound}`);
    }

    return (
        <FadeIn>
            <div className="flex flex-col justify-center items-center py-10">
                <div className="flex justify-center gap-20 flex-wrap">
                    <div className="flex flex-col">
                        <Link
                            href={links.courses}
                            className="text-base self-start  text-primary opacity-70 transition hover:opacity-100 p-2"
                        >
                            {`<- Back to courses`}
                        </Link>
                        <div className="flex flex-col grow items-center justify-center">
                            <Heading>{course.name}</Heading>
                            <Heading as="h6">{course.description}</Heading>
                        </div>
                    </div>

                    {course.imageUrl && (
                        <Image
                            className="mask mask-hexagon"
                            src={course.imageUrl}
                            alt={`Course preview ${course.name}`}
                            width={340}
                            height={240}
                        />
                    )}
                </div>
                <div className="flex justify-center gap-20 flex-wrap-reverse mt-10 md:mt-1">
                    {course?.details?.mdxCompiled ? (
                        <MDXRenderer data={course.details.mdxCompiled} />
                    ) : (
                        <div>No course details</div>
                    )}

                    <div className="flex flex-col justify-start items-center md:items-end md:pt-8">
                        <CourseEnroll slug={slug} />
                        <TableOfLessons
                            lessons={course.lessons}
                            courseSlug={slug}
                        />
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}
